package com.dentory.backend.dental;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// 치과 정보 조회
public interface DentalHospitalRepository extends JpaRepository<DentalHospital, Long> {

    // 병원코드 중복 확인
    boolean existsByHospitalCode(String hospitalCode);

    // 사용중인 치과 조회
    List<DentalHospital> findAllByActiveTrue();

    // 상세 API 호출용 요양기호가 있는 치과만 조회
    List<DentalHospital> findAllByActiveTrueAndEncryptedYkihoIsNotNull();

    // 상세 페이지 치과 단건 조회
    // 삭제되지 않고 사용중인(active=true) 치과만 조회
    Optional<DentalHospital> findByIdAndActiveTrue(Long id);

    // 지역, 전문의 조건으로 치과 검색
    // 진료과목/진료시간은 병원 데이터에 아직 없어서 추후 조건 추가
    @Query("""
            SELECT dh
            FROM DentalHospital dh
            WHERE dh.active = true
            AND (:regionName IS NULL OR dh.address LIKE %:regionName%)
            AND (:specialistOnly = false OR dh.specialist = true)
            """)
    Page<DentalHospital> searchDentals(
            @Param("regionName") String regionName,
            @Param("specialistOnly") boolean specialistOnly,
            Pageable pageable
    );

    // 현재 위치 기준 반경 내 치과 조회
    @Query(
            value = """
                    SELECT *
                    FROM dental_hospital dh
                    WHERE dh.active = true
                    AND dh.latitude IS NOT NULL
                    AND dh.longitude IS NOT NULL
                    AND (
                        6371 * acos(
                            cos(radians(:lat))
                            * cos(radians(dh.latitude))
                            * cos(radians(dh.longitude) - radians(:lng))
                            + sin(radians(:lat))
                            * sin(radians(dh.latitude))
                        )
                    ) <= :radius
                    ORDER BY (
                        6371 * acos(
                            cos(radians(:lat))
                            * cos(radians(dh.latitude))
                            * cos(radians(dh.longitude) - radians(:lng))
                            + sin(radians(:lat))
                            * sin(radians(dh.latitude))
                        )
                    ) ASC
                    """,
            countQuery = """
                    SELECT count(*)
                    FROM dental_hospital dh
                    WHERE dh.active = true
                    AND dh.latitude IS NOT NULL
                    AND dh.longitude IS NOT NULL
                    AND (
                        6371 * acos(
                            cos(radians(:lat))
                            * cos(radians(dh.latitude))
                            * cos(radians(dh.longitude) - radians(:lng))
                            + sin(radians(:lat))
                            * sin(radians(dh.latitude))
                        )
                    ) <= :radius
                    """,
            nativeQuery = true
    )
    Page<DentalHospital> findNearbyDentals(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius,
            Pageable pageable
    );
}