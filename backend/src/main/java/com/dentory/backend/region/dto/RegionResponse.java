package com.dentory.backend.region.dto;

import com.dentory.backend.region.Region;
import lombok.Getter;

@Getter
public class RegionResponse {

    private Long id;
    private String regionCode;
    private String displayName;

    public RegionResponse(Region region) {
        this.id = region.getId();
        this.regionCode = region.getRegionCode();
        this.displayName = region.getDisplayName();
    }
}