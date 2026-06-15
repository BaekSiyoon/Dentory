package com.dentory.backend.region;
import java.util.List;

import com.dentory.backend.region.dto.RegionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
// 지역 정보 조회 및 지역 데이터 등록 API
public class RegionController {

    private final RegionService regionService;
    private final RegionImportService regionImportService;

    // 활성화된 지역 목록 조회
    @GetMapping
    public List<RegionResponse> getRegions() {
        return regionService.getRegions();
    }

    // 공공데이터(행정안전부 표준지역코드) API를 통해 전국 시군구 데이터 저장
    @PostMapping("/import")
    public String importRegions() throws Exception {
        regionImportService.importAllRegions();
        return "전국 시군구 지역 데이터 저장 완료";
    }
}