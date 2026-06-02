package com.dentory.backend.treatment.dto;

import com.dentory.backend.treatment.TreatmentSubject;

// 진료과목 조회 응답
public class TreatmentSubjectResponse {

    private Long id;
    private String name;
    private String englishName;
    private String description;
    private Boolean officialSpecialty;

    // 응답 데이터 생성
    public TreatmentSubjectResponse(TreatmentSubject subject) {
        this.id = subject.getId();
        this.name = subject.getName();
        this.englishName = subject.getEnglishName();
        this.description = subject.getDescription();
        this.officialSpecialty = subject.getOfficialSpecialty();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEnglishName() {
        return englishName;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getOfficialSpecialty() {
        return officialSpecialty;
    }
}