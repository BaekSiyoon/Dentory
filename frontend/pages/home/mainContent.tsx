import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import apiClient from "../../common/ApiClient";

import "swiper/css";
import "swiper/css/pagination";


const MainContent = () => {
  const router = useRouter();

  // api 테스트
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await apiClient.get("/test");
  //     } catch (error) {
  //       console.error("API 호출 실패:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const dentalBtnClick = () => {
    router.push("/dentalInfo");
  };

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
    <section className="relative bg-[#F7F5EE]">
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
        className="w-full home-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="h-[calc(100vh-70px)]">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={slide.mobileImage}
                />
                <img
                  src={slide.webImage}
                  alt=""
                />
              </picture>

              <div className="absolute inset-0" />
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12">
                  <div className="mt-120 ml-10 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={dentalBtnClick}
                      className="rounded-full bg-[#FCBF5D] px-8 py-4 text-base font-bold text-white shadow-md transition-all duration-300 hover:bg-[#D88945]"
                      >
                        치과 찾기
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push('/community')}
                      className="rounded-full border border-[#DDECC8] bg-white px-8 py-4 text-base font-bold text-[#7DA35A] shadow-sm transition-all duration-300 hover:bg-[#DDECC8] hover:text-[#7DA35A]"
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