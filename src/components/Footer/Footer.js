import React from "react";

const Footer = () => {
  return (
    <footer className="footer pt-20 bg-[#10375C] text-white font-open-sans mt-auto flex flex-col justify-between min-h-screen ">
      <div className="container mx-auto max-w-[calc(100%-20rem)] w-max lg:max-w-[calc(100%-15rem)] ">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="col-span-1">
            {/* <!-- Logo --> */}
            <a href="/">
              <div className="logo flex items-center gap-3">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/icons/class.ico`}
                  alt="ZenClass"
                  width="50"
                  height="60"
                />
                <div className="text-white text-lg font-sans font-semibold">
                  ZenClass
                </div>
              </div>
            </a>
            <p className="footer__desc mt-5 w-48 text-[#A9B3BB] font-open-sans text-base font-normal leading-[28px]">
              Explore a unique online learning hub for teachers and students to
              share knowledge interactively
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="footer__heading mb-5 text-white font-open-sans text-base font-semibold leading-[28px]">
              Support
            </h3>
            <ul className="footer__list text-[#A9B3BB] font-open-sans text-sm font-normal leading-[26px] space-y-1">
              <li className="footer__item">
                <a href="#" className="footer__link">
                  Help center
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  Account information
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  About
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="footer__heading mb-5 text-white font-open-sans text-base font-semibold leading-[28px]">
              Support
            </h3>
            <ul className="footer__list text-[#A9B3BB] font-open-sans text-sm font-normal leading-[26px] space-y-1">
              <li className="footer__item">
                <a href="#" className="footer__link">
                  Help center
                </a>
              </li>
              <li className="footer__item">
                <a href="#" className="footer__link">
                  Account information
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="footer__heading mb-5 text-white font-open-sans text-base font-semibold leading-[28px]">
              Stay In Touch
            </h3>
            <div className="footer__social flex items-center gap-4 mb-5">
              <a
                href="#"
                className="footer__social-btn w-8 h-8 text-blue-900 bg-white rounded-full flex items-center justify-center"
              >
                <svg width="6" height="12" fill="currentColor">
                  <path d="M3.99 11.936V6.03H5.765L6 3.952H3.99L3.993 2.911C3.993 2.369 4.048 2.079 4.878 2.079H5.988V0H4.212C2.08 0 1.33 1.008 1.33 2.704V3.952H0V6.03H1.33V11.852C1.847 11.95 2.383 12 2.931 12c.354 0 .639-.02.99-.064Z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="footer__social-btn w-8 h-8 text-blue-900 bg-white rounded-full flex items-center justify-center"
              >
                <svg width="16" height="12" fill="currentColor">
                  <path d="M16 1.421C15.405 1.662 14.771 1.821 14.11 1.899C14.79 1.524 15.309.935 15.553.225 14.919.574 14.219.821 13.473.958 12.871.366 12.013 0 11.077 0 9.261 0 7.799 1.361 7.799 3.029 7.799 3.269 7.821 3.499 7.875 3.719 5.148 3.596 2.735 2.39 1.114.552.831 1.005.665 1.524.665 2.082.665 3.131 1.25 4.061 2.122 4.599 1.595 4.59 1.078 4.448.64 4.226.64 4.235.64 4.247.64 4.259.64 5.73 1.777 6.953 3.268 7.234 3.001 7.302 2.71 7.334 2.408 7.334 2.198 7.334 1.986 7.323 1.787 7.282 2.212 8.481 3.418 9.363 4.852 9.391 3.736 10.197 2.319 10.683.785 10.683.516 10.683.258 10.671 0 10.641C1.453 11.506 3.175 12 5.032 12 11.068 12 14.368 7.385 14.368 3.384 14.368 3.25 14.363 3.121 14.356 2.993 15.007 2.566 15.554 2.033 16 1.421Z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="footer__social-btn w-8 h-8 text-blue-900 bg-white rounded-full flex items-center justify-center"
              >
                <svg width="10" height="12" fill="currentColor">
                  <path d="M0 1.394C0 .989891.146 0.656558.439 0.393939.732 0.131309 1.113 0 1.581 0c.46 0 .832.129 1.116.388.293.266.44.613.44 1.041 0 .388-.142.711-.43 1 .146 0 .299.008.456.026V12H0V3.903H2.949V12H0.163L0 1.394ZM4.492 12H7.278V7.479C7.278 7.196 7.311 6.978 7.378 6.824 7.495 6.549 7.673 6.317 7.912 6.127 8.15 5.937 8.449 5.842 8.809 5.842 9.746 5.842 10.214 6.453 10.214 7.673V12H13V7.358C13 6.162 12.707 5.255 12.122 4.636 11.536 4.018 10.762 3.709 9.8 3.709 8.721 3.709 7.88 4.158 7.278 5.054V5.079H7.265L7.278 5.055V3.903H4.492C4.509 4.162 4.517 4.966 4.517 6.315 4.517 7.665 4.509 9.56 4.492 12Z"></path>
                </svg>
              </a>
            </div>

            <h3 className="footer__heading mt-4 mb-5 font-semibold text-base leading-7">
              Subscribe
            </h3>

            <p className="footer__desc text-[#A9B3BB] font-open-sans text-sm font-normal leading-[26px]">
              Subscribe our newsletter for the latest update of Dental care
            </p>

            <form className="footer-form flex gap-3 mt-3" action="">
              <input
                className="footer-form__input w-48 h-12 px-4 outline-none rounded"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email..."
              />
              <button
                className="btn footer-form__submit min-w-28 h-12 px-3 rounded-md text-white bg-[#2E80CE] hover:bg-blue-500 transition duration-300"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer__copyright mt-20 border-t border-solid border-[#406181]">
          <p className="footer__copyright-text mt-4 pb-6 text-[#AAB3BA] font-open-sans text-sm font-normal leading-[26px] text-center">
            2023 HQD. Copyright and All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
