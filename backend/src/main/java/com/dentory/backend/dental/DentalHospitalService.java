package com.dentory.backend.dental;
import java.util.List;

import com.dentory.backend.dental.dto.DentalHospitalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor

// 치과 정보 조회
public class DentalHospitalService {

    private final DentalHospitalRepository dentalHospitalRepository;

    // 사용중인 치과 목록 조회
    public List<DentalHospitalResponse> getDentalHospitals() {
        return dentalHospitalRepository.findAllByActiveTrue()
                .stream()
                .map(DentalHospitalResponse::new)
                .toList();
    }

    // 현재 위치 기준 근처 치과 조회
    public Page<DentalHospitalResponse> getNearbyDentals(
            double lat,
            double lng,
            double radius,
            int page,
            int size
    ) {
        return dentalHospitalRepository.findNearbyDentals(
                        lat,
                        lng,
                        radius,
                        PageRequest.of(page, size)
                )
                .map(DentalHospitalResponse::new);
    }

    // 지역, 전문의 조건으로 치과 검색
    @Transactional(readOnly = true)
    public Page<DentalHospitalResponse> searchDentals(
            String regionName,
            boolean specialistOnly,
            int page,
            int size
    ) {
        return dentalHospitalRepository.searchDentals(
                        regionName,
                        specialistOnly,
                        PageRequest.of(page, size)
                )
                .map(DentalHospitalResponse::new);
    }

    // 치과 상세 조회
    @Transactional(readOnly = true)
    public DentalHospitalResponse getDentalHospital(Long id) {

        DentalHospital hospital = dentalHospitalRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("치과 정보를 찾을 수 없습니다."));

        return new DentalHospitalResponse(hospital);
    }
}