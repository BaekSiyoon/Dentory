package com.dentory.backend.dental;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 병원별 진료과목 정보
@Entity
@Getter
@Setter
public class DentalHospitalSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 병원의 진료과목인지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dental_hospital_id")
    private DentalHospital dentalHospital;

    // 진료과목 코드
    private String subjectCode;

    // 진료과목명
    private String subjectName;
}