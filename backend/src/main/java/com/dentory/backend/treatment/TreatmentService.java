package com.dentory.backend.treatment;
import java.util.List;

import com.dentory.backend.treatment.dto.TreatmentCategoryResponse;
import com.dentory.backend.treatment.dto.TreatmentSubjectResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
// 진료과목 조회
public class TreatmentService {

    private final TreatmentCategoryRepository treatmentCategoryRepository;
    private final TreatmentSubjectRepository treatmentSubjectRepository;

    public TreatmentService(
            TreatmentCategoryRepository treatmentCategoryRepository,
            TreatmentSubjectRepository treatmentSubjectRepository
    ) {
        this.treatmentCategoryRepository = treatmentCategoryRepository;
        this.treatmentSubjectRepository = treatmentSubjectRepository;
    }

    // 사용중인 진료과목 카테고리 조회
    @Transactional(readOnly = true)
    public List<TreatmentCategoryResponse> getTreatmentCategories() {
        return treatmentCategoryRepository.findAllByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(TreatmentCategoryResponse::new)
                .toList();
    }

    // 사용중인 진료과목 조회
    @Transactional(readOnly = true)
    public List<TreatmentSubjectResponse> getTreatmentSubjects() {
        return treatmentSubjectRepository.findAllByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(TreatmentSubjectResponse::new)
                .toList();
    }
}