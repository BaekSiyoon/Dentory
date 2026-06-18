package com.dentory.backend.region;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

// 지역 정보 조회
public interface RegionRepository extends JpaRepository<Region, Long> {

    // 지역코드 존재 여부 확인
    boolean existsByRegionCode(String regionCode);

    // 지역코드로 지역 조회
    Optional<Region> findByRegionCode(String regionCode);

    // 활성화된 지역 조회
    List<Region> findAllByActiveTrueOrderByIdAsc();
}