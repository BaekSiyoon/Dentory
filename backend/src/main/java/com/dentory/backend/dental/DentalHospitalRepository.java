package com.dentory.backend.dental;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// 치과 정보 조회
public interface DentalHospitalRepository extends JpaRepository<DentalHospital, Long> {

    // 병원코드 중복 확인
    boolean existsByHospitalCode(String hospitalCode);

    // 사용중인 치과 조회
    List<DentalHospital> findAllByActiveTrue();

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