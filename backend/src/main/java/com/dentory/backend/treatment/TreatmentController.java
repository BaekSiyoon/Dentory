package com.dentory.backend.treatment;

import com.dentory.backend.treatment.dto.TreatmentCategoryResponse;
import com.dentory.backend.treatment.dto.TreatmentSubjectResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
// 진료과목 조회
public class TreatmentController {

    private final TreatmentService treatmentService;

    // 진료과목 카테고리 조회
    @GetMapping("/api/treatmentCategories")
    public List<TreatmentCategoryResponse> getTreatmentCategories() {
        return treatmentService.getTreatmentCategories();
    }

     // 진료과목 조회
    @GetMapping("/api/treatmentSubjects")
    public List<TreatmentSubjectResponse> getTreatmentSubjects() {
        return treatmentService.getTreatmentSubjects();
    }
}