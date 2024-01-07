import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* HERO */}
      <section className="hero bg-[#10375C] pt-[76px] pb-[170px]">
        <div className="container w-full lg:max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Hero content */}
          <section className="hero__content text-white flex-shrink-0 lg:w-[44%] lg:order-1 mb-8 lg:mb-0">
            <h1 className="hero__heading text-white text-4xl lg:text-7xl font-semibold leading-tight mb-4">
              Welcome to Our&nbsp;ZenClass Website
            </h1>
            <p className="hero__desc text-gray-300 mt-[22px] text-lg lg:text-xl leading-7 lg:w-[90%]">
              Explore a unique online learning hub for teachers and students to
              share knowledge interactively
            </p>
            <div className="hero__row mt-6 lg:mt-12">
              <a
                href="#!"
                className="btn bg-[#2E80CE] text-white px-6 py-3 lg:px-14 lg:py-5 rounded-full mr-4 lg:mr-[38px] text-base lg:text-lg"
              >
                {t("Get started")}
              </a>
              <span className="hero__phone text-white text-lg lg:text-xl font-normal">
                or call (123) 456-7890
              </span>
            </div>
          </section>

          {/* Hero media */}
          <div className="hero__media flex-grow relative lg:w-[50%] lg:order-2">
            <figure className="hero__images flex items-center justify-end">
              <img
                src="./assets/imgs/class-01.jpg"
                alt=""
                className="hero__img w-full lg:w-[330px] h-[300px] lg:h-[540px] rounded-lg object-cover"
                style={{ zIndex: 1 }}
              />
              <img
                src="./assets/imgs/class-02.jpg"
                alt=""
                className="hero__img object-cover mt-4 w-full lg:w-[210px] h-[180px] lg:h-[410px] rounded-lg ml-[-6px] relative z-0"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="work pt-[170px] pb-[170px] bg-[#F6FBFF]">
        <div className="container w-max  lg:max-w-[calc(100%-20rem)] mx-auto">
          <h2 className="section-heading font-semibold text-5xl leading-[1.2] tracking-tight text-[#10375c]">
            How it works
          </h2>
          <p className="section-desc work__desc mt-[18px] max-w-[468px] text-[#575F66] font-sora font-light leading-[30px] text-lg">
            Exceptional online education for all learners. Your bright academic
            journey starts with ZenClass
          </p>

          <div className="work__list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-30 mt-[70px]">
            {/* Work item 1 */}
            <section className="work-item w-[370px] h-[402px] bg-white p-11 border-[14px] border-[#EAF6FF] rounded-md transition-transform hover:translate-y-[-16px] hover:border-blue-500">
              <img
                src="./assets/icons/create-class.svg"
                alt=""
                className="work-item__icon h-16 w-22"
              />
              <h3 className="work-item__heading mt-[18px] font-semibold text-2xl leading-[1.38] text-[#10375c]">
                Create class
              </h3>
              <p className="work-item__desc mt-[28px] mb-[18px] text-[#575F66] font-sora text-base font-light leading-[28px]">
                Create classes and invite students to join, establishing a
                high-quality online learning environment.
              </p>
              <a
                href="#!"
                className="work-item__more text-[#2E80CE] font-sora text-base font-normal leading-[28px]"
              >
                Learn More
              </a>
            </section>

            {/* Work item 2 */}
            <section className="work-item w-[370px] h-[402px] bg-white p-11 border-[14px] border-[#EAF6FF] rounded-md transition-transform hover:translate-y-[-16px] hover:border-blue-500">
              <img
                src="./assets/icons/student.svg"
                alt=""
                className="work-item__icon h-16 w-22"
              />
              <h3 className="work-item__heading mt-[18px] font-semibold text-2xl leading-[1.38] text-[#10375c]">
                Flexible Interaction
              </h3>
              <p className="work-item__desc mt-[28px] mb-[18px] text-[#575F66] font-sora text-base font-light leading-[28px]">
                Students discuss, question, and complete assignments for a
                dynamic learning experience.
              </p>
              <a
                href="#!"
                className="work-item__more text-[#2E80CE] font-sora text-base font-normal leading-[28px]"
              >
                Learn More
              </a>
            </section>

            {/* Work item 3 */}
            <section className="work-item w-[370px] h-[402px] bg-white p-11 border-[14px] border-[#EAF6FF] rounded-md transition-transform hover:translate-y-[-16px] hover:border-blue-500">
              <img
                src="./assets/icons/document.svg"
                alt=""
                className="work-item__icon h-16 w-22"
              />
              <h3 className="work-item__heading mt-[18px] font-semibold text-2xl leading-[1.38] text-[#10375c]">
                Content Management
              </h3>
              <p className="work-item__desc mt-[28px] mb-[18px] text-[#575F66] font-sora text-base font-light leading-[28px]">
                Easily share documents, lectures, and more, facilitating
                efficient information connectivity.
              </p>
              <a
                href="#!"
                className="work-item__more text-[#2E80CE] font-sora text-base font-normal leading-[28px]"
              >
                Learn More
              </a>
            </section>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feature pt-[170px] pb-[170px]">
        <div className="container w-max lg:max-w-[calc(100%-20rem)] mx-auto ">
          <div className="feature__inner flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-36">
            <div className="feature__media w-full md:w-2/3 lg:w-3/5">
              <figure className="feature__images relative">
                <img
                  src="./assets/imgs/hand.jpg"
                  alt=""
                  className="feature__img w-full md:w-[512px] h-[370px] md:h-[420px] lg:h-[500px] rounded-md object-cover"
                />
              </figure>
            </div>
            <section className="feature__content max-w-[470px]">
              <h2 className="text-[#10375C] text-4xl md:text-5xl lg:text-6xl font-sora font-semibold leading-tight tracking-tight">
                Begin Learning with ZenClass.
              </h2>
              <p className="section-desc mt-4 md:mt-6 text-[#575F66] text-base md:text-lg font-sora font-light leading-[30px]">
                Let's join forces to construct an exceptional and nurturing
                space for our collective learning journey !
              </p>
              <a
                href="#!"
                className="btn feature__cta mt-6 md:mt-8 inline-flex items-center justify-center min-w-[205px] h-[60px] rounded-full font-normal text-xl text-white bg-[#2e80ce] hover:bg-blue-400 transition duration-300"
              >
                Learn More
              </a>
            </section>
          </div>
        </div>
      </section>

      {/* MEMBER */}
      <section className="member pt-[170px] pb-[170px] text-center">
        <div className="container w-max lg:max-w-[calc(100%-20rem)] mx-auto">
          <header className="member-header flex flex-col items-center">
            <h2 className="section-heading text-[#10375C] text-center font-sora font-semibold text-5xl leading-14 tracking-tight">
              About Our Team
            </h2>
            <a
              href="#!"
              className="btn member__cta mt-8 px-6 py-3 bg-[#2E80CE] rounded-full text-white"
            >
              Meet our team
            </a>
          </header>

          <div className="member__list flex flex-wrap justify-center items-center mt-20 gap-8 md:gap-16 lg:gap-[150px]">
            {/* Member item 1 */}
            <article className="member-item hover:scale-110">
              <div className="member-item__img-bg">
                <img
                  src="./assets/imgs/quang.png"
                  alt="Dr. Essence Page"
                  className="member-item__thumb bg-[#EAF6FF] rounded-md  h-[290px] w-[260px]"
                />
              </div>
              <h3 className="member-item__name mt-3 text-[#10375c] text-lg font-semibold">
                Trần Xuân Quang
              </h3>
              <p className="member-item__desc mt-2 text-[#575f66] text-sm font-light">
                HCM - University of Science
              </p>
            </article>

            {/* Member item 2 */}
            <article className="member-item hover:scale-110">
              <div className="member-item__img-bg">
                <img
                  src="./assets/imgs/duy.png"
                  alt="Dr. Essence Page"
                  className="member-item__thumb bg-[#EAF6FF] rounded-md h-[290px] w-[260px]"
                />
              </div>
              <h3 className="member-item__name mt-3 text-[#10375c] text-lg font-semibold">
                Hồ Quốc Duy
              </h3>
              <p className="member-item__desc mt-2 text-[#575f66] text-sm font-light">
                HCM - University of Science
              </p>
            </article>

            {/* Member item 3 */}
            <article className="member-item hover:scale-110">
              <div className="member-item__img-bg">
                <img
                  src="./assets/imgs/hieu.png"
                  alt="Dr. Essence Page"
                  className="member-item__thumb bg-[#EAF6FF] rounded-md h-[290px] w-[260px]"
                />
              </div>
              <h3 className="member-item__name mt-3 text-[#10375c] text-lg font-semibold">
                Phan Lê Minh Hiếu
              </h3>
              <p className="member-item__desc mt-2 text-[#575f66] text-sm font-light">
                HCM - University of Science
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SCROLL TO TOP */}
      {showScrollBtn && (
        <button
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-2 rounded-full opacity-40"
          onClick={scrollToTop}
          title="Go to top"
        >
          <img
            src="./assets/icons/arrow-up.svg"
            alt="Dr. Essence Page"
            className="h-5 w-5 filter invert"
          />
        </button>
      )}
    </>
  );
};

export default HeroSection;
