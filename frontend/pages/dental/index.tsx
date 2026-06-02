import React, { useEffect, useRef, useState } from "react";
import MainMenu from "../components/mainMenu";

interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string;
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
      <label className="mb-3 block text-base font-bold text-[#5A4033]">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`cursor-pointer flex h-[56px] w-full items-center justify-between rounded-full border-[2px] bg-white px-6 text-left text-lg font-bold text-[#5A4033] transition-all duration-200
            ${
              open
                ? "border-[#FCBF5D]"
                : "border-[#EEEAE5] hover:border-[#FCBF5D]"
            }
          `}
        >
          <span className="truncate">{selectedOption?.label || "전체"}</span>

          <span
            className={`ml-4 h-3 w-3 shrink-0 rotate-45 border-b-[3px] border-r-[3px] transition-all duration-200
              ${
                open
                  ? "translate-y-1 rotate-[225deg] border-[#FCBF5D]"
                  : "-translate-y-1 border-[#6A554B]"
              }
            `}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-5 w-[230px] rounded-[28px] border-[2px] border-[#EEEAE5] bg-white p-4 shadow-[0_12px_35px_rgba(80,60,40,0.15)]">
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
  const [data, setData] = useState<DentalData[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const [regionValue, setRegionValue] = useState("전체");
  const [treatmentValue, setTreatmentValue] = useState("전체");
  const [timeValue, setTimeValue] = useState("전체");
  const [specialistOnly, setSpecialistOnly] = useState(false);
  // 진료과목 카테고리 원본 데이터
  const [treatmentCategories, setTreatmentCategories] = useState<TreatmentCategory[]>([]);

  // 치과 목록 조회
  useEffect(() => {
    fetch("http://localhost:8080/api/dentals")
      .then((res) => res.json())
      .then((result) => {
        console.log("치과 데이터", result);
        setData(result);
      })
      .catch((error) => {
        console.error("치과 정보 조회 실패", error);
      });
  }, []);

  // 지역 목록 조회
  useEffect(() => {
    fetch("http://localhost:8080/api/regions")
      .then((res) => res.json())
      .then((result) => {
        console.log("지역 데이터", result);
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
        console.log("진료과목 데이터", result);
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
      treatmentCategoryId: treatmentValue === "전체" ? null : Number(treatmentValue),
      treatmentTime: timeValue === "ALL" ? null : timeValue,
      specialistOnly,
    };

    console.log("검색 조건", searchParams);
  };

  return (
    <>
      <MainMenu />

      <main className="min-h-screen bg-[#FFFAF0] px-5 py-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
          <section className="rounded-[24px] bg-white p-8 shadow-[0_10px_25px_rgba(80,60,40,0.12)]">
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
                className="h-[56px] rounded-full bg-[#FCBF5D] text-lg font-bold text-[#5A4033] shadow-[0_8px_18px_rgba(80,60,40,0.18)] transition hover:bg-[#F3AD43]">
                검색하기
              </button>
            </div>

            <div className="mt-8 border-t border-[#EEEAE5] pt-6">
              <label className="flex cursor-pointer items-center gap-4 text-lg font-bold text-[#5A4033]">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={specialistOnly}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setSpecialistOnly(checked);

                      console.log("전문의 필터 변경", checked);
                    }}
                    className="peer sr-only"
                  />

                  <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-[#B8B8B8] bg-white transition-all peer-checked:border-[#FCBF5D] peer-checked:bg-[#FCBF5D]">
                    {specialistOnly && (
                      <svg
                        className="h-4 w-4"
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

          <section className="flex h-[78px] items-center justify-between rounded-[20px] bg-white px-7 shadow-[0_8px_20px_rgba(80,60,40,0.12)]">
            <div className="flex items-center gap-3 text-2xl font-bold text-[#4E382D]">
              <span className="text-[#FCBF5D]">📍</span>
              지도로 보기
            </div>
            <span className="text-3xl font-bold text-[#5A4033]">⌄</span>
          </section>

          <p className="text-xl font-bold text-[#5A4033]">
            총 <span className="text-[#FCBF5D]">{data.length || 50}</span>개의 치과
          </p>

          <section className="flex flex-col gap-5">
            {(data.length > 0
              ? data
              : [
                  {
                    id: 1,
                    name: "서울 밝은 치과",
                    address: "서울시 강남구 테헤란로 100",
                    phone: "02-1234-5678",
                  },
                ]
            ).map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between gap-6 rounded-[24px] bg-white p-7 shadow-[0_6px_18px_rgba(80,60,40,0.08)] md:flex-row md:items-center"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <img
                    src="/images/dental/defaultDental.png"
                    alt="치과 이미지"
                    className="h-[160px] w-[210px] rounded-[24px] object-cover"
                  />

                  <div>
                    <h2 className="text-3xl font-bold text-[#5A4033]">
                      {item.name}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-xl font-bold text-[#6A554B]">
                      <span className="text-[#FCBF5D]">★</span>
                      <span>4.5</span>
                      <span className="font-medium">리뷰 510</span>
                    </div>

                    <p className="mt-3 text-lg font-medium text-[#6A554B]">
                      📍 {item.address}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {["임플란트", "교정", "미백"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#DDECC8] px-5 py-2 text-lg font-bold text-[#7DA35A]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 md:self-start">
                  <span className="rounded-full bg-[#7DA35A] px-5 py-2 text-lg font-bold text-white">
                    전문의
                  </span>
                  <span className="rounded-full bg-[#FCBF5D] px-5 py-2 text-lg font-bold text-[#5A4033]">
                    진료중
                  </span>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default DentalInfo;