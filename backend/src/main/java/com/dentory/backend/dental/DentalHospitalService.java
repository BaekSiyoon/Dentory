package com.dentory.backend.dental;

import com.dentory.backend.dental.dto.DentalHospitalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

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
}