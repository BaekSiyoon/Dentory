import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface DentalPageResponse {
  content: DentalData[];
  totalElements: number;
  totalPages: number;
  number: number;
}

interface KakaoMapProps {
  hospitals: DentalData[];
  latitude: number;
  longitude: number;
  selectedHospitalId?: number; // 상세 페이지에서 현재 보고 있는 치과를 초록 마커로 표시하기 위한 id
  enableDynamicSearch?: boolean; // 상세 페이지에서 지도 이동 또는 확대/축소 후 주변 치과를 다시 조회할지 여부
}

declare global {
  interface Window {
    kakao: any;
  }
}

const MARKER_WIDTH = 44;
const MARKER_HEIGHT = 58;

const KakaoMap = ({
  hospitals,
  latitude,
  longitude,
  selectedHospitalId,
  enableDynamicSearch = false,
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim();

    if (!kakaoMapKey || !mapRef.current) {
      return;
    }

    const scriptId = "kakao-map-script";

    const createMap = () => {
      if (!window.kakao?.maps || !mapRef.current) {
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapRef.current) {
          return;
        }

        const centerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: centerPosition,
          level: selectedHospitalId != null ? 3 : 4,
        });

        let openedInfoWindow: any = null;
        let markers: any[] = [];
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

        const currentMarkerImage = new window.kakao.maps.MarkerImage(
          "/images/map/currentMarker.png",
          new window.kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
          {
            offset: new window.kakao.maps.Point(
              MARKER_WIDTH / 2,
              MARKER_HEIGHT
            ),
          }
        );

        const dentalMarkerImage = new window.kakao.maps.MarkerImage(
          "/images/map/dentalMarker.png",
          new window.kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
          {
            offset: new window.kakao.maps.Point(
              MARKER_WIDTH / 2,
              MARKER_HEIGHT
            ),
          }
        );

        // 기존 마커를 지도에서 제거한 뒤 새 마커를 다시 그리기 위해 사용
        const clearMarkers = () => {
          markers.forEach((marker) => {
            marker.setMap(null);
          });

          markers = [];
        };

        // 병원 마커 클릭 시 보여줄 정보창 HTML 생성
        const createInfoContent = (
          hospital: DentalData,
          isSelectedHospital: boolean
        ) => {
          return `
            <div style="
              width:240px;
              padding:12px 14px;
              font-size:13px;
              color:#5A4033;
              line-height:1.4;
              box-sizing:border-box;
            ">
              ${
                isSelectedHospital
                  ? `<span style="
                      display:inline-block;
                      margin-bottom:6px;
                      border-radius:9999px;
                      background:#7DA35A;
                      padding:4px 8px;
                      color:white;
                      font-size:11px;
                      font-weight:700;
                    ">
                      현재 보고 있는 치과
                    </span>`
                  : ""
              }

              <strong style="
                display:block;
                margin-bottom:4px;
                font-size:14px;
                color:#4E382D;
              ">
                ${hospital.name}
              </strong>

              <span style="
                display:block;
                width:210px;
                font-size:12px;
                color:#6A554B;
                white-space:normal;
                word-break:keep-all;
                overflow-wrap:break-word;
              ">
                ${hospital.address}
              </span>

              ${
                !isSelectedHospital
                  ? `<button
                      id="dental-detail-${hospital.id}"
                      style="
                        margin-top:10px;
                        border:none;
                        border-radius:9999px;
                        background:#FCBF5D;
                        padding:6px 12px;
                        color:#5A4033;
                        font-size:12px;
                        font-weight:700;
                        cursor:pointer;
                      "
                    >
                      상세보기
                    </button>`
                  : ""
              }
            </div>
          `;
        };

        // 전달받은 병원 목록으로 지도 마커를 그림
        const drawHospitalMarkers = (
          hospitalList: DentalData[],
          useBounds: boolean
        ) => {
          clearMarkers();

          if (openedInfoWindow) {
            openedInfoWindow.close();
            openedInfoWindow = null;
          }

          const bounds = new window.kakao.maps.LatLngBounds();
          bounds.extend(centerPosition);

          // 리스트 페이지에서는 현재 위치를 초록 마커로 표시
          // 상세 페이지에서는 선택된 병원이 초록 마커가 되므로 별도 현재 위치 마커를 만들지 않음
          if (selectedHospitalId == null) {
            const currentMarker = new window.kakao.maps.Marker({
              position: centerPosition,
              map,
              image: currentMarkerImage,
            });

            markers.push(currentMarker);
          }

          hospitalList.forEach((hospital) => {
            if (hospital.latitude == null || hospital.longitude == null) {
              return;
            }

            const markerPosition = new window.kakao.maps.LatLng(
              hospital.latitude,
              hospital.longitude
            );

            bounds.extend(markerPosition);

            const isSelectedHospital = selectedHospitalId === hospital.id;

            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map,
              image: isSelectedHospital ? currentMarkerImage : dentalMarkerImage,
            });

            markers.push(marker);

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: createInfoContent(hospital, isSelectedHospital),
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              if (openedInfoWindow) {
                openedInfoWindow.close();
              }

              infoWindow.open(map, marker);
              openedInfoWindow = infoWindow;

              if (isSelectedHospital) {
                return;
              }

              setTimeout(() => {
                const detailButton = document.getElementById(
                  `dental-detail-${hospital.id}`
                );

                detailButton?.addEventListener("click", () => {
                  router.push(`/dental/${hospital.id}`);
                });
              }, 0);
            });
          });

          // 리스트 페이지에서는 처음 진입 시 현재 위치와 주변 치과가 모두 보이도록 조정
          // 상세 페이지에서는 현재 병원을 중심으로 확대해서 보여줘야 하므로 bounds를 적용하지 않음
          if (useBounds && selectedHospitalId == null && hospitalList.length > 0) {
            map.setBounds(bounds);
          }

          if (selectedHospitalId != null) {
            map.setCenter(centerPosition);
          }
        };

        // 상세 페이지에서 지도 이동/확대/축소 후 현재 지도 중심 기준으로 주변 치과 재조회
        const fetchDentalsByMapCenter = () => {
          if (!enableDynamicSearch) {
            return;
          }

          const mapCenter = map.getCenter();
          const level = map.getLevel();

          // 지도를 멀리 축소할수록 조금 더 넓은 반경으로 조회
          const radius = level <= 3 ? 0.5 : level <= 5 ? 1 : 2;

          fetch(
            `http://localhost:8080/api/dentals/nearby?lat=${mapCenter.getLat()}&lng=${mapCenter.getLng()}&radius=${radius}&page=0&size=40`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error("지도 주변 치과 조회 실패");
              }

              return res.json();
            })
            .then((result: DentalPageResponse) => {
              drawHospitalMarkers(result.content, false);
            })
            .catch((error) => {
              console.error("지도 주변 치과 조회 실패", error);
            });
        };

        // 지도 빈 영역 클릭 시 열려있는 병원 정보 닫기
        window.kakao.maps.event.addListener(map, "click", () => {
          if (openedInfoWindow) {
            openedInfoWindow.close();
            openedInfoWindow = null;
          }
        });

        // 지도 이동 또는 확대/축소가 끝난 뒤 주변 병원을 다시 조회
        // 너무 자주 호출되지 않도록 짧게 debounce 처리
        if (enableDynamicSearch) {
          window.kakao.maps.event.addListener(map, "idle", () => {
            if (idleTimer) {
              clearTimeout(idleTimer);
            }

            idleTimer = setTimeout(() => {
              fetchDentalsByMapCenter();
            }, 350);
          });
        }

        drawHospitalMarkers(hospitals, true);

        if (selectedHospitalId != null) {
          map.setCenter(centerPosition);
          map.setLevel(3);
        }
      });
    };

    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      createMap();
      return;
    }

    const script = document.createElement("script");

    script.id = scriptId;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;

    script.onload = () => {
      createMap();
    };

    script.onerror = (error) => {
      console.log("카카오 스크립트 로드 실패", error);
    };

    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [
    hospitals,
    latitude,
    longitude,
    selectedHospitalId,
    enableDynamicSearch,
    router,
  ]);

  return (
    <div
      ref={mapRef}
      className="h-[330px] w-full rounded-2xl bg-[#F5F5F5]"
    />
  );
};

export default KakaoMap;