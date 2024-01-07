// Modal.jsx
import React from "react";

function Modal({ handleClose, show, children }) {
  const modalClassName = show
    ? "fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10"
    : "hidden";

  const modalContentClassName = show
    ? "fixed bg-white w-80 md:w-96 max-w-xs md:max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg"
    : "";

  const closeButtonClassName =
    "absolute top-3 right-3 text-gray-600 cursor-pointer";

  return (
    <div className={modalClassName}>
      {show && (
        <section className={modalContentClassName}>
          {children}
          <button className={closeButtonClassName} onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </section>
      )}
    </div>
  );
}

export default Modal;
