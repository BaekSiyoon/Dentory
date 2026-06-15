import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainMenu from "../components/mainMenu";
import KakaoMap from "../components/dentalInfo/kakaoMap";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  StarFilled,
  LikeFilled,
} from "@ant-design/icons";

interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  specialist: boolean;
  openNow: boolean;
  distance: number | null;
}

interface DentalPageResponse {
  content: DentalData[];
  totalElements: number;
  totalPages: number;
  number: number;
}

const DentalDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [dental, setDental] = useState<DentalData | null>(null);
  const [nearbyDentals, setNearbyDentals] = useState<DentalData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // URL의 id 값으로 치과 상세 정보 조회
  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);

    fetch(`http://localhost:8080/api/dentals/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("치과 상세 조회 실패");
        }

        return res.json();
      })
      .then((result: DentalData) => {
        setDental(result);

        // 상세 병원 좌표를 기준으로 주변 치과를 조회해 지도에 함께 표시
        if (result.latitude != null && result.longitude != null) {
          fetch(
            `http://localhost:8080/api/dentals/nearby?lat=${result.latitude}&lng=${result.longitude}&radius=0.5&page=0&size=8`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error("주변 치과 조회 실패");
              }

              return res.json();
            })
            .then((nearbyResult: DentalPageResponse) => {
              setNearbyDentals(nearbyResult.content);
            })
            .catch((error) => {
              console.error("주변 치과 조회 실패", error);
              setNearbyDentals([result]);
            });
        } else {
          setNearbyDentals([result]);
        }
      })
      .catch((error) => {
        console.error("치과 상세 조회 실패", error);
        setDental(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <MainMenu />
        <main className="min-h-screen bg-[#FBF3E4] px-5 py-10 text-center text-[15px] font-bold text-[#5A4033]">
          치과 정보를 불러오는 중입니다.
        </main>
      </>
    );
  }

  if (!dental) {
    return (
      <>
        <MainMenu />
        <main className="min-h-screen bg-[#FBF3E4] px-5 py-10 text-center text-[15px] font-bold text-[#5A4033]">
          치과 정보를 찾을 수 없습니다.
        </main>
      </>
    );
  }

  return (
    <>
      <MainMenu />

      <main className="min-h-screen bg-[#FBF3E4] px-5 py-6 text-[#5B463A] md:px-8">
        <div className="mx-auto max-w-[980px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-[17px] font-extrabold text-[#5A4033] transition-colors hover:text-[#FFB84D] md:text-[19px]"
          >
            <svg className="h-4 w-4 -translate-y-px md:h-5 md:w-5" viewBox="0 0 24 24" fill="none">
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

          <section className="overflow-hidden rounded-[18px] shadow-sm">
            <img
              src="/images/dental/detailSample.png"
              alt={`${dental.name} 이미지`}
              className="h-[190px] w-full object-cover md:h-[290px]"
            />
          </section>

          <section className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_6px_16px_rgba(80,60,40,0.10)] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[24px] font-extrabold md:text-[30px]">
                  {dental.name}
                </h1>

                <div className="mt-2.5 flex items-center gap-2 text-[14px] font-bold">
                  <StarFilled style={{ color: "#FFB84D" }} />
                  <span>4.8</span>
                  <span className="font-medium text-[#7C6A5F]">리뷰 342</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-1.5 md:flex-row">
                {dental.specialist && (
                  <span className="rounded-full bg-[#7DA35A] px-3 py-1 text-center text-[12px] font-bold text-white">
                    전문의
                  </span>
                )}

                {dental.openNow ? (
                  <span className="rounded-full bg-[#FCBF5D] px-3 py-1 text-center text-[12px] font-bold text-[#5A4033]">
                    진료중
                  </span>
                ) : (
                  <span className="rounded-full bg-[#EEEAE5] px-3 py-1 text-center text-[12px] font-bold text-[#7C6A5F]">
                    진료종료
                  </span>
                )}
              </div>
            </div>

            <p className="mt-5 text-[14px] font-medium leading-relaxed md:text-[15px]">
              {dental.name}은 {dental.address}에 위치한 치과입니다.
              <br />
              방문 전 전화로 진료 가능 여부를 확인해보세요.
            </p>

            <div className="mt-6 space-y-5">
              <InfoItem icon={<EnvironmentOutlined />} title="주소">
                {dental.address}
              </InfoItem>

              <InfoItem icon={<PhoneOutlined />} title="전화번호">
                {dental.phone || "전화번호 정보 없음"}
              </InfoItem>

              <InfoItem icon={<ClockCircleOutlined />} title="진료상태">
                {dental.openNow ? "현재 진료중입니다." : "현재 진료중이 아닙니다."}
              </InfoItem>

              <div className="flex gap-2.5">
                <CalendarOutlined
                  className="mt-1 text-[16px]"
                  style={{ color: "#FFB84D" }}
                />
                <div>
                  <h2 className="mb-2.5 text-[15px] font-extrabold">진료과목</h2>
                  <div className="flex flex-wrap gap-2">
                    {treatments.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[#DDECC8] px-3.5 py-1 text-[12px] font-bold text-[#6E9B4F]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_6px_16px_rgba(80,60,40,0.10)] md:p-6">
            <h2 className="mb-4 text-[19px] font-extrabold">위치</h2>

            {dental.latitude != null && dental.longitude != null ? (
              <div className="overflow-hidden rounded-[16px]">
                <KakaoMap
                  hospitals={nearbyDentals}
                  latitude={dental.latitude}
                  longitude={dental.longitude}
                  selectedHospitalId={dental.id}
                  enableDynamicSearch
                />
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-2xl bg-[#F5F8F1] md:h-[280px]">
                <div className="text-center">
                  <EnvironmentOutlined className="text-[42px] text-[#7DA35A]" />
                  <p className="mt-3 text-[14px] font-bold text-[#6B5A50]">
                    위치 정보가 없습니다.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="mt-4 rounded-[18px] bg-white p-4 shadow-[0_6px_16px_rgba(80,60,40,0.10)] md:p-6">
            <h2 className="mb-4 text-[19px] font-extrabold">리뷰 342</h2>

            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.date}
                  className="border-b border-[#EEEAE5] pb-5 last:border-b-0"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <strong className="text-[14px]">{review.name}</strong>
                    <span className="rounded-md bg-[#DDECC8] px-2 py-0.5 text-[10px] font-bold text-[#6E9B4F]">
                      {review.tag}
                    </span>
                  </div>

                  <div className="mb-2.5 flex items-center gap-2 text-[12px]">
                    <span className="text-[#FFB84D]">★★★★★</span>
                    <span className="text-[#7C6A5F]">{review.date}</span>
                  </div>

                  <p className="text-[13px] leading-relaxed md:text-[14px]">
                    {review.content}
                  </p>

                  <p className="mt-3 text-[12px] font-bold text-[#7C6A5F]">
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
    <div className="flex gap-2.5">
      <span className="mt-1 text-[16px] text-[#FFB84D]">{icon}</span>
      <div>
        <h2 className="mb-1 text-[15px] font-extrabold">{title}</h2>
        <div className="text-[13px] font-medium leading-relaxed text-[#7C6A5F] md:text-[14px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DentalDetailPage;