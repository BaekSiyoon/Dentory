import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

interface KakaoMapProps {
  hospitals: DentalData[];
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

const MARKER_WIDTH = 44;
const MARKER_HEIGHT = 58;

const KakaoMap = ({ hospitals, latitude, longitude }: KakaoMapProps) => {
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

        // 현재 위치를 기준으로 지도 생성
        const center = new window.kakao.maps.LatLng(latitude, longitude);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        });

        let openedInfoWindow: any = null;

        // 현재 위치와 치과 마커가 모두 보이도록 범위 계산
        const bounds = new window.kakao.maps.LatLngBounds();

        const currentPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );

        bounds.extend(currentPosition);

        // 지도 빈 영역 클릭 시 열려있는 병원 정보 닫기
        window.kakao.maps.event.addListener(map, "click", () => {
          if (openedInfoWindow) {
            openedInfoWindow.close();
            openedInfoWindow = null;
          }
        });

        // 현재 위치 마커 이미지
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

        new window.kakao.maps.Marker({
          position: currentPosition,
          map,
          image: currentMarkerImage,
        });

        // 치과 마커 이미지
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

        hospitals.forEach((hospital) => {
          if (hospital.latitude == null || hospital.longitude == null) {
            return;
          }

          // 치과 좌표 기준 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(
            hospital.latitude,
            hospital.longitude
          );

          bounds.extend(markerPosition);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map,
            image: dentalMarkerImage,
          });

          // 마커 클릭 시 보여줄 병원 정보
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="
                width:240px;
                padding:12px 14px;
                font-size:13px;
                color:#5A4033;
                line-height:1.4;
                box-sizing:border-box;
              ">
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

                <button
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
                </button>
              </div>
            `,
          });

          // 마커 클릭 시 병원 정보 열기
          window.kakao.maps.event.addListener(marker, "click", () => {
            if (openedInfoWindow) {
              openedInfoWindow.close();
            }

            infoWindow.open(map, marker);
            openedInfoWindow = infoWindow;

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

        // 현재 위치와 치과 마커가 모두 보이도록 지도 범위 조정
        if (hospitals.length > 0) {
          map.setBounds(bounds);
        }
      });
    };

    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      createMap();
      return;
    }

    // 카카오 지도 SDK 동적 로드
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
  }, [hospitals, latitude, longitude, router]);

  return (
    <div
      ref={mapRef}
      className="h-[420px] w-full rounded-2xl bg-[#F5F5F5]"
    />
  );
};

export default KakaoMap;