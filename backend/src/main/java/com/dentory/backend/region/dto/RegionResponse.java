package com.dentory.backend.region.dto;

import com.dentory.backend.region.Region;
import lombok.Getter;

@Getter
// 지역 조회 응답
public class RegionResponse {

    private Long id;
    private String regionCode;
    private String displayName;

    // Region Entity > Response DTO 변환
    public RegionResponse(Region region) {
        this.id = region.getId();
        this.regionCode = region.getRegionCode();
        this.displayName = region.getDisplayName();
    }
}