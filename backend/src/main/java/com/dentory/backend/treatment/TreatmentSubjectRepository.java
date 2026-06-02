package com.dentory.backend.treatment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// 진료과목 조회
public interface TreatmentSubjectRepository extends JpaRepository<TreatmentSubject, Long> {

     // 사용중인 진료과목 조회
    List<TreatmentSubject> findAllByActiveTrueOrderBySortOrderAsc();
    // 진료과목명 중복 확인
    boolean existsByName(String name);
}