package com.dentory.backend.region;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.dentory.backend.region.dto.RegionResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository regionRepository;

    public List<RegionResponse> getRegions() {
        return regionRepository.findAllByActiveTrueOrderByIdAsc()
                .stream()
                .map(region -> new RegionResponse(region))
                .toList();
    }
}