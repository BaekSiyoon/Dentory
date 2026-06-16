package com.dentory.backend.dental;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


// 병원별 진료과목 Repository
public interface DentalHospitalSubjectRepository
        extends JpaRepository<DentalHospitalSubject, Long> {

    // 병원별 진료과목 조회
    List<DentalHospitalSubject> findByDentalHospitalId(Long dentalHospitalId);

    // 중복 저장 방지
    boolean existsByDentalHospitalIdAndSubjectCode(
            Long dentalHospitalId,
            String subjectCode
    );
}