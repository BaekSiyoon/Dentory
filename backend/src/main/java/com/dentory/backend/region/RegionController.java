package com.dentory.backend.region;

import com.dentory.backend.region.dto.RegionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;
    private final RegionImportService regionImportService;

    @GetMapping
    public List<RegionResponse> getRegions() {
        return regionService.getRegions();
    }

    @PostMapping("/import")
    public String importRegions() throws Exception {
        regionImportService.importAllRegions();
        return "전국 시군구 지역 데이터 저장 완료";
    }
}