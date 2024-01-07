// ChatApp.js
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const ChatApp = () => {
  const token = localStorage.getItem("token");

  let data;
  if (token) data = jwtDecode(token);

  const dataUser = localStorage.getItem("user");
  const user = JSON.parse(dataUser);
  // const avtPath = `${user.img}`;
  const myAvtPath = `${user.img}`;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username] = useState(data.fullname);
  const [avatar] = useState(myAvtPath);
  const socketRef = useRef();
  const isMessageInputEmpty = messageInput.trim() === "";
  const { t } = useTranslation();

  useEffect(() => {
    // Khởi tạo socket khi component được mount
    socketRef.current = io(process.env.REACT_APP_BA_BASE_URL);

    // Lắng nghe sự kiện "chat message" từ máy chủ
    socketRef.current.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Ngắt kết nối khi component bị hủy
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    // Gửi sự kiện "chat message" với nội dung tin nhắn và tên người gửi đến máy chủ
    socketRef.current.emit("chat message", {
      user: username,
      text: messageInput,
      avatar: avatar,
      timestamp: new Date(), // Thêm trường timestamp với thời gian hiện tại
    });

    // Xóa nội dung của ô nhập tin nhắn
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the "Enter" key in a textarea/input
      handleSendMessage(); // Call the sendMessage function when "Enter" is pressed
    }
  };

  return (
    <div className="flex flex-col justify-items-center h-[600px] rounded-lg ">
      <div className="flex flex-col h-[550px] bg-gray-50  rounded-lg w-2/3 mx-auto">
        <h2 className="text-3xl text-[#10375c] bg-white pb-2 font-bold">
          {t("Chat Group")}
        </h2>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mt-2 flex items-stretch  rounded  gap-1 max-w-lg ${
                message.user === username
                  ? "ml-auto flex-row-reverse"
                  : "mr-auto"
              }`}
            >
              {message.user !== username && (
                <img
                  src={message.avatar}
                  alt={`${message.user}'s Avatar`}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div>
                {message.user !== username && (
                  <p className="text-gray-500 text-xs">{message.user}</p>
                )}
                <p
                  className={`bg-blue-400 py-1 px-3 rounded-lg overflow-hidden overflow-wrap break-word ${
                    message.user === username
                      ? "bg-[#2E80CE] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </p>
              </div>
              {/* <p className="text-xs text-gray-400">
                {new Date(message.timestamp).toLocaleString()}
              </p> */}
            </div>
          ))}
        </div>
        <div className="flex items-center p-4">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border rounded p-2 mr-2"
            placeholder="Your message"
          />
          <button
            onClick={handleSendMessage}
            className={`bg-[#2E80CE] text-white p-2 rounded font-semibold font-sans ${
              isMessageInputEmpty ? "bg-opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isMessageInputEmpty}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
