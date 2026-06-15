package com.dentory.backend.treatment.dto;
import java.util.List;
import com.dentory.backend.treatment.TreatmentCategory;

// 진료과목 카테고리 조회 응답
public class TreatmentCategoryResponse {

    private Long id;
    private String name;
    private List<TreatmentSubjectResponse> subjects;

    // 응답 데이터 생성
    public TreatmentCategoryResponse(TreatmentCategory category) {
        this.id = category.getId();
        this.name = category.getName();
         // 사용중인 진료과목만 포함
        this.subjects = category.getSubjects()
                .stream()
                .filter(subject -> Boolean.TRUE.equals(subject.getActive()))
                .map(TreatmentSubjectResponse::new)
                .toList();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<TreatmentSubjectResponse> getSubjects() {
        return subjects;
    }
}