import React from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const MainContent = () => {
  const router = useRouter();

  const slides = [
    {
      webImage: "/images/home/webBanner1.png",
      mobileImage: "/images/home/mobileBanner1.png",
    },
    {
      webImage: "/images/home/webBanner2.png",
      mobileImage: "/images/home/mobileBanner2.png",
    },
    {
      webImage: "/images/home/webBanner3.png",
      mobileImage: "/images/home/mobileBanner3.png",
    },
    {
      webImage: "/images/home/webBanner4.png",
      mobileImage: "/images/home/mobileBanner4.png",
    },
  ];

  return (
    <section className="bg-[#F7F5EE]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop
        className="home-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[calc(100vh-70px)] overflow-hidden">
              <picture className="block h-full w-full">
                <source
                  media="(max-width: 1024px)"
                  srcSet={slide.mobileImage}
                />

                <img
                  src={slide.webImage}
                  alt={`Dentory banner ${index + 1}`}
                  className="block h-full w-full object-cover object-center"
                />
              </picture>

              <div className="absolute left-0 right-0 bottom-[72px] lg:bottom-[110px]">
                <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
                  <div className="flex flex-row justify-center gap-2 lg:ml-12 lg:justify-start">
                    <button
                        type="button"
                        onClick={() => router.push("/dentalInfo")}
                        className="w-fit rounded-full bg-[#FCBF5D] px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#D88945] md:px-8 md:py-4 md:text-base"
                      >
                        치과 찾기
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/community")}
                      className="w-fit rounded-full border border-[#DDECC8] bg-white px-5 py-3 text-sm font-bold text-[#7DA35A] shadow-sm transition-all duration-300 hover:bg-[#DDECC8] md:px-8 md:py-4 md:text-base"
                    >
                      커뮤니티 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default MainContent;