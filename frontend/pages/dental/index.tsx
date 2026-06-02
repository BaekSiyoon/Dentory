import React, { useEffect, useRef, useState } from "react";
import MainMenu from "../components/mainMenu";

interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  specialist?: boolean;
  openNow?: boolean;
}
interface DentalPageResponse {
  content: DentalData[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// 지역 조회 API 응답 타입
interface Region {
  id: number;
  regionCode: string;
  displayName: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}
// 진료과목 조회 API 응답 타입
interface TreatmentSubject {
  id: number;
  name: string;
  englishName: string;
  description: string;
  officialSpecialty: boolean;
}
interface TreatmentCategory {
  id: number;
  name: string;
  subjects: TreatmentSubject[];
}

const CustomSelect = ({ label, value, options, onChange }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // 셀렉트 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <label className="mb-2 block text-[14px] font-bold text-[#5A4033]">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`cursor-pointer flex h-11 w-full items-center justify-between rounded-full border bg-white px-5 text-left text-[14px] font-bold text-[#5A4033] transition-all duration-200
            ${
              open
                ? "border-[#FCBF5D]"
                : "border-[#EEEAE5] hover:border-[#FCBF5D]"
            }
          `}
        >
          <span className="truncate">{selectedOption?.label || "전체"}</span>

          <span
            className={`ml-4 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-200
              ${
                open
                  ? "translate-y-1 rotate-225 border-[#FCBF5D]"
                  : "-translate-y-1 border-[#6A554B]"
              }
            `}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-2 w-[230px] rounded-[28px] border-2 border-[#EEEAE5] bg-white p-4 shadow-[0_12px_35px_rgba(80,60,40,0.15)]">
            <ul className="custom-select-scroll flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-2">
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={`cursor-pointer w-full rounded-full px-5 py-3 text-left text-lg font-bold transition-all duration-200
                        ${
                          selected
                            ? "bg-[#FCBF5D] text-[#5A4033]"
                            : "bg-white text-[#5A4033] hover:bg-[#FFF7EA]"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-select-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-select-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-select-scroll::-webkit-scrollbar-thumb {
          background: #eeeae5;
          border-radius: 9999px;
        }

        .custom-select-scroll:hover::-webkit-scrollbar-thumb {
          background: #fcbf5d;
        }
      `}</style>
    </div>
  );
};

const DentalInfo = () => {
  const resultRef = useRef<HTMLParagraphElement | null>(null);
  const [data, setData] = useState<DentalData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [regions, setRegions] = useState<Region[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [latitude, setLatitude] = useState(37.5194);
  const [longitude, setLongitude] = useState(127.0473);
  const [regionValue, setRegionValue] = useState("전체");
  const [treatmentValue, setTreatmentValue] = useState("전체");
  const [timeValue, setTimeValue] = useState("ALL");
  const [specialistOnly, setSpecialistOnly] = useState(false);
  // 진료과목 카테고리 원본 데이터
  const [treatmentCategories, setTreatmentCategories] = useState<TreatmentCategory[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [locationReady, setLocationReady] = useState(false);

  const dentalImages = [
    "/images/dental/defaultDental1.png",
    "/images/dental/defaultDental2.png",
    "/images/dental/defaultDental3.png",
    "/images/dental/defaultDental4.png",
    "/images/dental/defaultDental5.png",
    "/images/dental/defaultDental6.png",
    "/images/dental/defaultDental7.png",
    "/images/dental/defaultDental8.png",
    "/images/dental/defaultDental9.png",
  ];
  
  useEffect(() => {
  if (!navigator.geolocation) {
    setLocationReady(true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLocationReady(true);
    },
    () => {
      console.log("위치 권한 거부 - 청담동 기본 위치 사용");
      setLocationReady(true);
    }
  );
}, []);

  // 치과 목록 조회
  const radius = 1;
  const pageSize = 10;

  // 현재 위치 기준 치과 목록 조회
  const fetchNearbyDentals = (
    page: number,
    lat: number,
    lng: number
  ) => {
    fetch(
      `http://localhost:8080/api/dentals/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((result: DentalPageResponse) => {
        setData(result.content);
        setTotalCount(result.totalElements);
        setTotalPages(result.totalPages);
        setCurrentPage(result.number);
      })
      .catch((error) => {
        console.error("치과 정보 조회 실패", error);
      });
  };

  useEffect(() => {
    if (!locationReady) {
      return;
    }

    fetchNearbyDentals(0, latitude, longitude);
  }, [locationReady, latitude, longitude]);

  // 지역 목록 조회
  useEffect(() => {
    fetch("http://localhost:8080/api/regions")
      .then((res) => res.json())
      .then((result) => {
        // console.log("지역 데이터", result);
        setRegions(result);
      })
      .catch((error) => {
        console.error("지역 조회 실패", error);
      });
  }, []);

  // 진료과목 카테고리 조회
  useEffect(() => {
    fetch("http://localhost:8080/api/treatmentCategories")
      .then((res) => res.json())
      .then((result) => {
        // console.log("진료과목 데이터", result);
        setTreatmentCategories(result);
      })
      .catch((error) => {
        console.error("진료과목 조회 실패", error);
      });
  }, []);

  // 지역 API 데이터 > 셀렉트 옵션 형식으로 변환
  const regionOptions: SelectOption[] = [
    { label: "전체", value: "전체" },
    ...regions.map((region) => ({
      label: region.displayName,
      value: region.regionCode,
    })),
  ];

  // 진료과목 카테고리 > 셀렉트 옵션 형식으로 변환
  const treatmentOptions: SelectOption[] = [
    { label: "전체", value: "전체" },
    ...treatmentCategories.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  ];

  // 진료시간은 현재 일단 고정값
  const timeOptions = [
    { label: "전체", value: "ALL" },
    { label: "진료중", value: "OPEN_NOW" },
    { label: "야간진료", value: "NIGHT_CARE" },
    { label: "휴일진료", value: "HOLIDAY_CARE" },
  ];

  // 검색 버튼 클릭시 
  const handleSearch = () => {
    const searchParams = {
      regionCode: regionValue === "전체" ? null : regionValue,
      treatmentCategoryId:
        treatmentValue === "전체" ? null : Number(treatmentValue),
      treatmentTime: timeValue === "ALL" ? null : timeValue,
      specialistOnly,
    };

    console.log("검색 조건", searchParams);

    fetchNearbyDentals(0, latitude, longitude);
  };

  // 페이지 이동
  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return;
    }

    fetchNearbyDentals(page, latitude, longitude);
    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // 페이지 버튼 표시
  const pageGroupSize = 5;
  const currentGroup = Math.floor(currentPage / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage },
    (_, index) => startPage + index
  );

  return (
    <>
      <MainMenu />
      <main className="min-h-screen bg-[#FFFAF0] px-5 py-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
          <section className="rounded-3xl bg-white p-6 shadow-[0_10px_25px_rgba(80,60,40,0.12)]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_1fr_1fr] md:items-end">
              <CustomSelect
                label="지역 선택"
                value={regionValue}
                options={regionOptions}
                onChange={setRegionValue}
              />

              <CustomSelect
                label="진료과목"
                value={treatmentValue}
                options={treatmentOptions}
                onChange={setTreatmentValue}
              />

              <CustomSelect
                label="진료시간"
                value={timeValue}
                options={timeOptions}
                onChange={setTimeValue}
              />

              <button 
                onClick={handleSearch}
                className="h-11 rounded-full bg-[#FCBF5D] text-[14px] font-bold text-[#5A4033] shadow-[0_6px_14px_rgba(80,60,40,0.16)] transition hover:bg-[#F3AD43]">
                검색하기
              </button>
            </div>

            <div className="mt-6 border-t border-[#EEEAE5] pt-5">
              <label className="flex cursor-pointer items-center gap-3 text-[14px] font-bold text-[#5A4033]">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={specialistOnly}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSpecialistOnly(checked);
                    }}
                    className="peer sr-only"
                  />

                  <div className="flex h-5 w-5 items-center justify-center rounded border border-[#B8B8B8] bg-white transition-all peer-checked:border-[#FCBF5D] peer-checked:bg-[#FCBF5D]">
                    {specialistOnly && (
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span>전문의만 보기</span>
              </label>
            </div>
          </section>

          <section
            onClick={() => setMapOpen((prev) => !prev)}
            className="cursor-pointer flex h-[78px] items-center justify-between rounded-[20px] bg-white px-7 shadow-[0_8px_20px_rgba(80,60,40,0.12)]"
          >
            <div className="flex items-center gap-3 text-[18px] font-bold text-[#4E382D]">
              <svg
                className="h-7 w-7 text-[#FCBF5D]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 6.5L9 4L15 6.5L21 4V17.5L15 20L9 17.5L3 20V6.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 4V17.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 6.5V20"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>

              <span>지도로 보기</span>
            </div>

            <span
              className={`ml-4 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-200
                ${
                  mapOpen
                    ? "translate-y-1 rotate-225 border-[#FCBF5D]"
                    : "-translate-y-1 border-[#6A554B]"
                }
              `}
            />
          </section>

          <p ref={resultRef} className="-mb-6 ml-2 text-[18px] font-bold text-[#5A4033]">
            내 주변 치과 <span className="text-[#FCBF5D]">{totalCount.toLocaleString()}</span>개
          </p>

          <section className="flex flex-col gap-5">
            {data.length === 0 && (
              <p className="rounded-[20px] bg-white p-8 text-center text-lg font-bold text-[#6A554B] shadow-[0_6px_18px_rgba(80,60,40,0.08)]">
                조건에 맞는 치과가 없습니다.
              </p>
            )}

            {data.map((item, index) => (
              <article
                key={item.id}
                className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-5 shadow-[0_6px_18px_rgba(80,60,40,0.08)] md:flex-row md:items-center"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <img
                    src={dentalImages[index % dentalImages.length]}
                    alt="치과 이미지"
                    className="h-[140px] w-[190px] rounded-3xl object-cover"
                  />

                  <div>
                    <h2 className="text-[22px] font-bold text-[#5A4033]">
                      {item.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-[#6A554B]">
                      <span className="text-[#FCBF5D]">★</span>
                      <span>4.5</span>
                      <span className="font-medium">리뷰 510</span>
                    </div>

                    <p className="mt-1 text-[14px] font-medium text-[#6A554B]">
                      📍 {item.address}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      {["임플란트", "교정", "미백"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#DDECC8] px-4 py-1.5 text-[13px] font-bold text-[#7DA35A]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 md:self-start">
                  {item.specialist && (
                    <span className="rounded-full bg-[#7DA35A] px-4 py-1.5 text-[13px] font-bold text-white">
                      전문의
                    </span>
                  )}

                  {item.openNow && (
                    <span className="rounded-full bg-[#FCBF5D] px-4 py-1.5 text-[13px] font-bold text-[#5A4033]">
                      진료중
                    </span>
                  )}
                </div>
              </article>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                  currentPage === 0
                    ? "cursor-not-allowed border-[#F1EBDD] text-[#D3C9BA]"
                    : "cursor-pointer border-[#EEE4D5] text-[#5A4033] hover:border-[#FCBF5D]"
                }`}
              >
                <svg className="h-3 w-3 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {pageNumbers.map((page) => {
                const active = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-[14px] font-semibold transition-all duration-200 ${
                      active
                        ? "border-[#FCBF5D] bg-[#FCBF5D] text-[#5A4033]"
                        : "border-[#EEE4D5] bg-transparent text-[#5A4033] hover:border-[#FCBF5D]"
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                  currentPage >= totalPages - 1
                    ? "cursor-not-allowed border-[#F1EBDD] text-[#D3C9BA]"
                    : "cursor-pointer border-[#EEE4D5] text-[#5A4033] hover:border-[#FCBF5D]"
                }`}
              >
                <svg className="h-3 w-3 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </main>
    </>
  );
};

export default DentalInfo;