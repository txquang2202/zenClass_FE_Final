import React from "react";

function CreateClassModal({ isOpen, onClose }) {
  return (
    <div
      className={`modal ${
        isOpen ? "block" : "hidden"
      } fixed inset-0 z-10 overflow-y-auto`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="bg-blue-500 text-white px-4 py-3">
            <h4 className="text-lg font-semibold">Create a New Class</h4>
          </div>

          {/* Modal body */}
          <div className="p-6">
            {/* Add your form or content for creating a new class here */}
            <form>
              {/* Example: Class name input */}
              <div className="mb-4">
                <label
                  htmlFor="className"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Class Name
                </label>
                <input
                  type="text"
                  id="className"
                  name="className"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter class name"
                />
              </div>

              {/* Additional form fields for class creation */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter class description"
                ></textarea>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClassModal;
