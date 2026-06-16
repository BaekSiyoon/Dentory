package com.dentory.backend.dental.dto;

import com.dentory.backend.dental.DentalHospitalSubject;
import lombok.Getter;

// 병원별 진료과목 응답
@Getter
public class DentalHospitalSubjectResponse {

    private String subjectCode;
    private String subjectName;

    public DentalHospitalSubjectResponse(DentalHospitalSubject subject) {
        this.subjectCode = subject.getSubjectCode();
        this.subjectName = subject.getSubjectName();
    }
}