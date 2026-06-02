package com.dentory.backend.region;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.dentory.backend.region.dto.RegionResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
// 지역 조회
public class RegionService {

    private final RegionRepository regionRepository;

     // 활성화된 지역 목록 반환
    public List<RegionResponse> getRegions() {
        return regionRepository.findAllByActiveTrueOrderByIdAsc()
                .stream()
                .map(region -> new RegionResponse(region))
                .toList();
    }
}