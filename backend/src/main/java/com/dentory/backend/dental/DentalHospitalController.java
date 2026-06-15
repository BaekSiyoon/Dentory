package com.dentory.backend.dental;
import java.util.List;

import com.dentory.backend.dental.dto.DentalHospitalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/dentals")
@RequiredArgsConstructor

// 치과 정보 조회
public class DentalHospitalController {

    private final DentalHospitalService dentalHospitalService;
    private final DentalHospitalImportService dentalHospitalImportService;

    // 치과 목록 조회
    @GetMapping
    public List<DentalHospitalResponse> getDentalHospitals() {
        return dentalHospitalService.getDentalHospitals();
    }

    // 현재 위치 기준 근처 치과 조회
    @GetMapping("/nearby")
    public Page<DentalHospitalResponse> getNearbyDentals(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1") double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return dentalHospitalService.getNearbyDentals(
                lat,
                lng,
                radius,
                page,
                size
        );
    }

    // 지역, 전문의 조건으로 치과 검색
    @GetMapping("/search")
    public Page<DentalHospitalResponse> searchDentals(
            @RequestParam(required = false) String regionName,
            @RequestParam(defaultValue = "false") boolean specialistOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return dentalHospitalService.searchDentals(
                regionName,
                specialistOnly,
                page,
                size
        );
    }

    // 공공 API 치과 정보 저장
    @PostMapping("/import")
    public String importDentalHospitals() throws Exception {
        dentalHospitalImportService.importDentalHospitals();
        return "치과 정보 저장 완료";
    }

    // 치과 상세 조회
   @GetMapping("/{id}")
   public DentalHospitalResponse getDentalHospital(
           @PathVariable Long id
   ) {
       return dentalHospitalService.getDentalHospital(id);
   }
}