package com.dentory.backend.treatment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

// 진료과목 카테고리 조회
public interface TreatmentCategoryRepository extends JpaRepository<TreatmentCategory, Long> {

    // 사용중인 카테고리 목록 조회
    List<TreatmentCategory> findAllByActiveTrueOrderBySortOrderAsc();

    // 카테고리명 중복 확인
    boolean existsByName(String name);
}