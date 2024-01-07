import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page_404 bg-white py-[80px] font-arvo">
      <div className="container mx-auto">
        <div className="text-center">
          <div
            className="four_zero_four_bg bg-center bg-cover h-96"
            style={{
              backgroundImage:
                "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
              backgroundSize: "500px 500px",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="text-6xl"></h1>
          </div>

          <div className="contant_box_404 mt-[-50px]">
            <h3 className="text-6xl">Look like you're lost</h3>
            <p className="text-xl mt-[20px]">
              The page you are looking for is not available!
            </p>
            <Link
              to="/"
              className="link_404 text-white font-bold py-2 px-4 bg-green-500 rounded mt-5 inline-block"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
