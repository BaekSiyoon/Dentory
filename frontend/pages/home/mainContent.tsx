import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import apiClient from "../../common/ApiClient";

const MainContent = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await apiClient.get("/test");
      } catch (error) {
        console.error("API 호출 실패:", error);
      }
    };

    fetchData();
  }, []);

  const dentalBtnClick = () => {
    router.push("/dentalInfo");
  };

  const slides = [
    {
      image: "/images/backgroundImg1.jpg",
      title: "실제 진료 경험으로",
      subTitle: "믿을 수 있는 치과를 찾아보세요",
      description: "치과 검색부터 솔직한 리뷰까지 Dentory에서 한 번에 확인해보세요.",
    },
    {
      image: "/images/backgroundImg2.jpg",
      title: "광고보다 솔직한 후기",
      subTitle: "진짜 방문 경험을 확인하세요",
      description: "사용자의 실제 리뷰를 바탕으로 더 신중하게 치과를 선택할 수 있어요.",
    },
    {
      image: "/images/backgroundImg3.jpg",
      title: "나에게 맞는 치과 찾기",
      subTitle: "지역과 진료과목으로 쉽게 검색",
      description: "교정, 임플란트, 스케일링 등 필요한 진료 정보를 빠르게 찾아보세요.",
    },
    {
      image: "/images/backgroundImg4.jpg",
      title: "함께 나누는 치과 정보",
      subTitle: "커뮤니티에서 경험을 공유해요",
      description: "상담과 후기를 통해 더 믿을 수 있는 치과 정보를 만들어가요.",
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
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[520px] w-full overflow-hidden md:h-[620px]">
              <img
                src={slide.image}
                alt={`Dentory 메인 배너 ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12">
                  <div className="max-w-2xl rounded-[2rem] bg-[#F7F5EE]/90 p-6 shadow-xl backdrop-blur-sm md:p-10">
                    <span className="mb-4 inline-block rounded-full bg-[#DDECC8] px-4 py-2 text-sm font-bold text-[#5F4B3F]">
                      Dentory Review Service
                    </span>

                    <h1 className="text-4xl font-extrabold leading-tight text-[#5F4B3F] md:text-5xl lg:text-6xl">
                      {slide.title}
                      <br />
                      <span className="text-[#D88945]">{slide.subTitle}</span>
                    </h1>

                    <p className="mt-6 text-base leading-7 text-[#7A6B60] md:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={dentalBtnClick}
                        className="rounded-full bg-[#D88945] px-8 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#C97835]"
                      >
                        치과 찾기
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push("/community")}
                        className="rounded-full border border-[#D88945] bg-white px-8 py-4 text-base font-bold text-[#D88945] shadow-sm transition hover:bg-[#FFF5EA]"
                      >
                        커뮤니티 보기
                      </button>
                    </div>
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