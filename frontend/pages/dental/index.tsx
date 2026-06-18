import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import MainMenu from "../../components/mainMenu";
import KakaoMap from "../../components/dentalInfo/kakaoMap";

interface DentalSubject {
  subjectCode: string;
  subjectName: string;
}
interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  specialist?: boolean;
  openNow?: boolean;
  subjects?: DentalSubject[];
}
interface DentalPageResponse {
  content: DentalData[];
  totalElements: number;
  totalPages: number;
  number: number;
}

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

type SearchMode = "nearby" | "search";

const CustomSelect = ({ label, value, options, onChange }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

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
          className={`flex h-11 w-full cursor-pointer items-center justify-between rounded-full border bg-white px-5 text-left text-[14px] font-bold text-[#5A4033] transition-all duration-200 ${
            open
              ? "border-[#FCBF5D]"
              : "border-[#EEEAE5] hover:border-[#FCBF5D]"
          }`}
        >
          <span className="truncate">{selectedOption?.label || "전체"}</span>

          <span
            className={`ml-4 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-200 ${
              open
                ? "translate-y-1 rotate-225 border-[#FCBF5D]"
                : "-translate-y-1 border-[#6A554B]"
            }`}
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
                      className={`w-full cursor-pointer rounded-full px-5 py-3 text-left text-lg font-bold transition-all duration-200 ${
                        selected
                          ? "bg-[#FCBF5D] text-[#5A4033]"
                          : "bg-white text-[#5A4033] hover:bg-[#FFF7EA]"
                      }`}
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

// 진료과목 태그 색상
const subjectTagColors = [
  "bg-[#FFF4CC] text-[#B8860B]",
  "bg-[#FFE6D5] text-[#D97706]",
  "bg-[#FDE2F3] text-[#BE185D]",
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#DBEAFE] text-[#2563EB]",
  "bg-[#EDE9FE] text-[#7C3AED]",
];

const DentalInfo = () => {
  const resultRef = useRef<HTMLParagraphElement | null>(null);
  const router = useRouter();

  const [data, setData] = useState<DentalData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [regions, setRegions] = useState<Region[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationReady, setLocationReady] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [searchedByRegion, setSearchedByRegion] = useState(false);

  const [regionValue, setRegionValue] = useState("전체");
  const [treatmentValue, setTreatmentValue] = useState("전체");
  const [timeValue, setTimeValue] = useState("ALL");
  const [specialistOnly, setSpecialistOnly] = useState(false);

  const [treatmentCategories, setTreatmentCategories] = useState<
    TreatmentCategory[]
  >([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("nearby");

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

  const radius = 1;
  const pageSize = 10;

  const updatePageData = (result: DentalPageResponse) => {
    setData(result.content);
    setTotalCount(result.totalElements);
    setTotalPages(result.totalPages);
    setCurrentPage(result.number);
  };

  const resetPageData = () => {
    setData([]);
    setTotalCount(0);
    setTotalPages(0);
    setCurrentPage(0);
  };

  const getSelectedRegionName = (value: string) => {
    if (value === "전체") {
      return null;
    }

    const selectedRegion = regions.find((region) => region.regionCode === value);

    if (!selectedRegion) {
      return null;
    }

    return selectedRegion.displayName.split(" ").pop() ?? null;
  };

  const fetchNearbyDentals = (page: number, lat: number, lng: number) => {
    setSearchMode("nearby");

    fetch(
      `http://localhost:8080/api/dentals/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=${page}&size=${pageSize}`
    )
      .then((res) => res.json())
      .then((result: DentalPageResponse) => {
        updatePageData(result);
      })
      .catch((error) => {
        console.error("치과 정보 조회 실패", error);
      });
  };

  const fetchSearchDentals = (
    page: number,
    regionName: string | null,
    onlySpecialist: boolean
  ) => {
    setSearchMode("search");

    const params = new URLSearchParams({
      page: String(page),
      size: String(pageSize),
      specialistOnly: String(onlySpecialist),
    });

    if (regionName) {
      params.append("regionName", regionName);
    }

    fetch(`http://localhost:8080/api/dentals/search?${params.toString()}`)
      .then((res) => res.json())
      .then((result: DentalPageResponse) => {
        updatePageData(result);

        if (locationDenied && regionName) {
          setSearchedByRegion(true);
        }
      })
      .catch((error) => {
        console.error("치과 검색 실패", error);
      });
  };

  const runSearch = (
    page: number,
    nextSpecialistOnly = specialistOnly,
    nextRegionValue = regionValue
  ) => {
    const regionName = getSelectedRegionName(nextRegionValue);

    console.log("검색 조건", {
      regionName,
      treatmentCategoryId:
        treatmentValue === "전체" ? null : Number(treatmentValue),
      treatmentTime: timeValue === "ALL" ? null : timeValue,
      specialistOnly: nextSpecialistOnly,
    });

    // 위치 거부 상태에서 지역을 전체로 검색하면 안내 상태로 되돌림
    if (locationDenied && !regionName) {
      resetPageData();
      setSearchMode("search");
      setSearchedByRegion(false);
      return;
    }

    if (regionName || nextSpecialistOnly) {
      fetchSearchDentals(page, regionName, nextSpecialistOnly);
      return;
    }

    if (latitude != null && longitude != null && !locationDenied) {
      fetchNearbyDentals(page, latitude, longitude);
      return;
    }

    resetPageData();
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setLocationReady(true);
      setSearchedByRegion(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationDenied(false);
        setLocationReady(true);
      },
      () => {
        setLocationDenied(true);
        setLocationReady(true);
        setSearchedByRegion(false);
        resetPageData();
      }
    );
  }, []);

  useEffect(() => {
    if (!locationReady || locationDenied || latitude == null || longitude == null) {
      return;
    }

    fetchNearbyDentals(0, latitude, longitude);
  }, [locationReady, locationDenied, latitude, longitude]);

  useEffect(() => {
    fetch("http://localhost:8080/api/regions")
      .then((res) => res.json())
      .then((result: Region[]) => {
        setRegions(result);
      })
      .catch((error) => {
        console.error("지역 조회 실패", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/treatmentCategories")
      .then((res) => res.json())
      .then((result) => {
        setTreatmentCategories(result);
      })
      .catch((error) => {
        console.error("진료과목 조회 실패", error);
      });
  }, []);

  const sortedRegions = [...regions].sort((a, b) => {
    const sidoOrder = [
      "서울",
      "경기",
      "인천",
      "부산",
      "대구",
      "광주",
      "대전",
      "울산",
      "세종",
      "강원",
      "충북",
      "충남",
      "전북",
      "전남",
      "경북",
      "경남",
      "제주",
    ];

    const aIndex = sidoOrder.findIndex((sido) =>
      a.displayName.startsWith(sido)
    );
    const bIndex = sidoOrder.findIndex((sido) =>
      b.displayName.startsWith(sido)
    );

    const safeAIndex = aIndex === -1 ? sidoOrder.length : aIndex;
    const safeBIndex = bIndex === -1 ? sidoOrder.length : bIndex;

    if (safeAIndex !== safeBIndex) {
      return safeAIndex - safeBIndex;
    }

    return a.displayName.localeCompare(b.displayName, "ko-KR");
  });

  const regionOptions: SelectOption[] = [
    { label: "전체", value: "전체" },
    ...sortedRegions.map((region) => ({
      label: region.displayName,
      value: region.regionCode,
    })),
  ];

  const treatmentOptions: SelectOption[] = [
    { label: "전체", value: "전체" },
    ...treatmentCategories.map((category) => ({
      label: category.name,
      value: String(category.id),
    })),
  ];

  const timeOptions = [
    { label: "전체", value: "ALL" },
    { label: "진료중", value: "OPEN_NOW" },
    { label: "야간진료", value: "NIGHT_CARE" },
    { label: "휴일진료", value: "HOLIDAY_CARE" },
  ];

  const handleSearch = () => {
    runSearch(0);
  };

  const handleSpecialistChange = (checked: boolean) => {
    setSpecialistOnly(checked);
    runSearch(0, checked);
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return;
    }

    if (searchMode === "search") {
      fetchSearchDentals(page, getSelectedRegionName(regionValue), specialistOnly);
    } else if (latitude != null && longitude != null) {
      fetchNearbyDentals(page, latitude, longitude);
    }

    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const mapCenterHospital = data.find(
    (item) => item.latitude != null && item.longitude != null
  );

  const mapLatitude = latitude ?? mapCenterHospital?.latitude ?? null;
  const mapLongitude = longitude ?? mapCenterHospital?.longitude ?? null;

  const showLocationGuide = locationDenied && !searchedByRegion;

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
            {showLocationGuide && (
              <div className="mb-5 rounded-2xl bg-[#FFF7EA] px-5 py-4 text-[14px] font-bold text-[#5A4033]">
                현재 위치를 사용할 수 없습니다. 지역을 선택하여 치과를
                검색해주세요.
              </div>
            )}

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
                type="button"
                onClick={handleSearch}
                className="h-11 rounded-full bg-[#FCBF5D] text-[14px] font-bold text-[#5A4033] shadow-[0_6px_14px_rgba(80,60,40,0.16)] transition hover:bg-[#F3AD43]"
              >
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
                      handleSpecialistChange(e.target.checked);
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

          <section className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_20px_rgba(80,60,40,0.12)]">
            <button
              type="button"
              onClick={() => setMapOpen((prev) => !prev)}
              className="flex h-[78px] w-full cursor-pointer items-center justify-between px-7"
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
                  <path d="M9 4V17.5" stroke="currentColor" strokeWidth="2" />
                  <path d="M15 6.5V20" stroke="currentColor" strokeWidth="2" />
                </svg>

                <span>지도로 보기</span>
              </div>

              <span
                className={`ml-4 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-200 ${
                  mapOpen
                    ? "translate-y-1 rotate-225 border-[#FCBF5D]"
                    : "-translate-y-1 border-[#6A554B]"
                }`}
              />
            </button>

            {mapOpen && (
              <div className="px-5 pb-5">
                {mapLatitude != null && mapLongitude != null && data.length > 0 ? (
                  <KakaoMap
                    hospitals={data}
                    latitude={mapLatitude}
                    longitude={mapLongitude}
                  />
                ) : (
                  <div className="flex h-[260px] items-center justify-center rounded-2xl bg-[#F5F8F1] text-center text-[15px] font-bold text-[#6A554B]">
                    위치를 허용하거나 지역을 선택하여 검색해주세요.
                  </div>
                )}
              </div>
            )}
          </section>

          <p
            ref={resultRef}
            className="-mb-6 ml-2 text-[18px] font-bold text-[#5A4033]"
          >
            {showLocationGuide ? (
              "지역을 선택해주세요"
            ) : searchMode === "search" ? (
              <>
                검색 결과{" "}
                <span className="text-[#FCBF5D]">
                  {totalCount.toLocaleString()}
                </span>
                개
              </>
            ) : (
              <>
                내 주변 치과{" "}
                <span className="text-[#FCBF5D]">
                  {totalCount.toLocaleString()}
                </span>
                개
              </>
            )}
          </p>

          <section className="flex flex-col gap-5">
            {data.length === 0 && (
              <p className="rounded-[20px] bg-white p-8 text-center text-lg font-bold text-[#6A554B] shadow-[0_6px_18px_rgba(80,60,40,0.08)]">
                {showLocationGuide
                  ? "위치를 사용할 수 없습니다. 지역을 선택하여 검색해주세요."
                  : "조건에 맞는 치과가 없습니다."}
              </p>
            )}

            {data.map((item, index) => (
              <article
                key={item.id}
                onClick={() => router.push(`/dental/${item.id}`)}
                className="flex cursor-pointer flex-col justify-between gap-5 rounded-3xl bg-white p-5 shadow-[0_6px_18px_rgba(80,60,40,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(80,60,40,0.12)] md:flex-row md:items-center"
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
                      {(item.subjects ?? [])
                        .slice(0, 4)
                        .map((subject, subjectIndex) => (
                          <span
                            key={subject.subjectCode}
                            className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
                              subjectTagColors[
                                subjectIndex % subjectTagColors.length
                              ]
                            }`}
                          >
                            {subject.subjectName}
                          </span>
                        ))}

                      {(item.subjects?.length ?? 0) > 4 && (
                        <span className="rounded-full bg-[#F3F4F6] px-4 py-1.5 text-[13px] font-bold text-[#6B7280]">
                          +{(item.subjects?.length ?? 0) - 4}
                        </span>
                      )}
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