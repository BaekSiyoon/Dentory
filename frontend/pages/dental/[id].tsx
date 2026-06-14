import React from "react";
import { useRouter } from "next/router";
import MainMenu from "../components/mainMenu";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  StarFilled,
  LikeFilled,
} from "@ant-design/icons";

const DentalDetailPage = () => {
  const router = useRouter();

  const treatments = ["임플란트", "교정", "미백", "치주치료"];

  const reviews = [
    {
      name: "김**",
      tag: "임플란트",
      date: "2026.05.20",
      content:
        "원장님이 정말 친절하시고 꼼꼼하게 상담해주셨어요. 임플란트 시술도 전혀 아프지 않았고, 사후관리도 잘 해주셔서 만족스럽습니다.",
      help: 24,
    },
    {
      name: "이**",
      tag: "교정",
      date: "2026.05.15",
      content:
        "교정 상담을 받았는데 다른 곳보다 저렴하고 설명도 자세히 해주셨어요. 다만 대기 시간이 좀 길었습니다.",
      help: 18,
    },
    {
      name: "박**",
      tag: "스케일링",
      date: "2026.05.10",
      content:
        "스케일링 받으러 갔는데 시설도 깨끗하고 직원분들도 친절하세요. 정기적으로 다니려고 합니다.",
      help: 12,
    },
  ];

  return (
    <>
      <MainMenu />

      <main className="min-h-screen bg-[#FBF3E4] px-5 py-7 text-[#5B463A] md:px-10">
        <div className="mx-auto max-w-[1080px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 flex items-center gap-2 text-[24px] font-extrabold text-[#5A4033] transition-opacity hover:opacity-70 md:text-[28px]"
          >
            <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>목록으로</span>
          </button>

          <section className="overflow-hidden rounded-[20px] shadow-sm">
            <img
              src="/images/dental/detailSample.png"
              alt="치과 상세 이미지"
              className="h-[220px] w-full object-cover md:h-[340px]"
            />
          </section>

          <section className="mt-5 rounded-[20px] bg-white p-5 shadow-[0_8px_20px_rgba(80,60,40,0.10)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-extrabold md:text-[36px]">
                  서울 밝은 치과
                </h1>

                <div className="mt-3 flex items-center gap-2 text-[16px] font-bold">
                  <StarFilled className="text-[#FFB84D]" />
                  <span>4.8</span>
                  <span className="font-medium text-[#7C6A5F]">리뷰 342</span>
                </div>
              </div>

              <span className="rounded-full bg-[#7DA35A] px-4 py-1.5 text-[13px] font-bold text-white">
                전문의
              </span>
            </div>

            <p className="mt-6 text-[15px] font-medium leading-relaxed md:text-[17px]">
              20년 경력의 전문의가 직접 진료하는 치과입니다. 첨단 장비와 최신
              기술로 환자분들께 최상의 진료를 제공하고 있습니다.
            </p>

            <div className="mt-8 space-y-6">
              <InfoItem icon={<EnvironmentOutlined />} title="주소">
                서울시 강남구 테헤란로 123, 3층
              </InfoItem>

              <InfoItem icon={<PhoneOutlined />} title="전화번호">
                02-1234-5678
              </InfoItem>

              <InfoItem icon={<ClockCircleOutlined />} title="진료시간">
                <p>평일: 09:00 - 18:00</p>
                <p>토요일: 09:00 - 14:00</p>
                <p>일요일: 휴진</p>
              </InfoItem>

              <div className="flex gap-3">
                <CalendarOutlined className="mt-1 text-[18px] text-[#FFB84D]" />
                <div>
                  <h2 className="mb-3 text-[16px] font-extrabold">진료과목</h2>
                  <div className="flex flex-wrap gap-2">
                    {treatments.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#DDECC8] px-4 py-1.5 text-[13px] font-bold text-[#6E9B4F]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[20px] bg-white p-5 shadow-[0_8px_20px_rgba(80,60,40,0.10)] md:p-8">
            <h2 className="mb-6 text-[22px] font-extrabold">위치</h2>

            <div className="flex h-[230px] items-center justify-center rounded-[18px] bg-[#F5F8F1] md:h-[330px]">
              <div className="text-center">
                <EnvironmentOutlined className="text-[54px] text-[#7DA35A]" />
                <p className="mt-4 text-[16px] font-bold text-[#6B5A50]">
                  카카오 지도 영역
                </p>
              </div>
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(80,60,40,0.10)]">
            <div className="grid grid-cols-3 border-b border-[#EDE8E1] text-center text-[16px] font-extrabold md:text-[18px]">
              <button className="relative py-5 text-[#FFB84D] after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:bg-[#FFB84D]">
                상세정보
              </button>
              <button className="py-5 text-[#5B463A]">리뷰 342</button>
              <button className="py-5 text-[#5B463A]">사진</button>
            </div>

            <div className="p-5 md:p-8">
              <h2 className="text-[22px] font-extrabold">병원 소개</h2>
              <p className="mt-4 text-[15px] leading-relaxed md:text-[17px]">
                20년 경력의 전문의가 직접 진료하는 치과입니다. 첨단 장비와 최신
                기술로 환자분들께 최상의 진료를 제공하고 있습니다.
              </p>

              <h2 className="mt-8 text-[22px] font-extrabold">주요 진료</h2>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed md:text-[17px]">
                <li>• 임플란트 - 최신 디지털 임플란트 시스템</li>
                <li>• 교정 - 투명 교정, 설측 교정</li>
                <li>• 미백 - 전문가 미백 시스템</li>
                <li>• 치주치료 - 잇몸 질환 전문 치료</li>
              </ul>
            </div>
          </section>

          <section className="mt-5 rounded-[20px] bg-white p-5 shadow-[0_8px_20px_rgba(80,60,40,0.10)] md:p-8">
            <h2 className="mb-5 text-[22px] font-extrabold">리뷰 342</h2>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.date} className="border-b border-[#EEEAE5] pb-6 last:border-b-0">
                  <div className="mb-2 flex items-center gap-2">
                    <strong className="text-[15px]">{review.name}</strong>
                    <span className="rounded-md bg-[#DDECC8] px-2 py-1 text-[11px] font-bold text-[#6E9B4F]">
                      {review.tag}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-[13px]">
                    <span className="text-[#FFB84D]">★★★★★</span>
                    <span className="text-[#7C6A5F]">{review.date}</span>
                  </div>

                  <p className="text-[14px] leading-relaxed md:text-[15px]">
                    {review.content}
                  </p>

                  <p className="mt-4 text-[13px] font-bold text-[#7C6A5F]">
                    <LikeFilled className="mr-1 text-[#FFB84D]" />
                    도움돼요 {review.help}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

const InfoItem = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex gap-3">
      <span className="mt-1 text-[18px] text-[#FFB84D]">{icon}</span>
      <div>
        <h2 className="mb-1.5 text-[16px] font-extrabold">{title}</h2>
        <div className="text-[14px] font-medium leading-relaxed text-[#7C6A5F] md:text-[15px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DentalDetailPage;