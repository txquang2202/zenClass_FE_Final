import React from "react";
import { Link } from "react-router-dom";

function ServerErrorPage(props) {
  const error = console.error();
  return (
    <section className="page_500 bg-white py-[80px] font-arvo">
      <div className="container mx-auto">
        <div className="text-center">
          {/* <div
            className="five_zero_zero_bg bg-center bg-cover h-96"
            style={{
              backgroundImage:
                "url(https://example.com/path/to/your/image.jpg)", // Thay đổi đường dẫn đến hình ảnh phù hợp
              backgroundSize: "500px 500px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-6xl"></h1>
          </div> */}

          <div className="contant_box_500 mt-[120px]">
            <h3 className="text-6xl">500 Server Error</h3>
            <p className="text-xl mt-[20px]">
              Internal server error occurred or the session has exprired
            </p>
            <p className="text-xl mt-[20px]">{error}</p>
            <Link
              to="/home"
              className="link_500 text-white font-bold py-2 px-4 bg-green-500 rounded mt-5 inline-block"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServerErrorPage;
