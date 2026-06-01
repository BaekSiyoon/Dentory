package com.dentory.backend.region;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Long> {
    boolean existsByRegionCode(String regionCode);

    List<Region> findAllByActiveTrueOrderByIdAsc();
}