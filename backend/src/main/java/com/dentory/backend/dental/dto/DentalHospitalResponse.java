package com.dentory.backend.dental.dto;

import java.util.List;
import com.dentory.backend.dental.DentalHospital;
import lombok.Getter;

// 치과 정보 조회 응답
@Getter
public class DentalHospitalResponse {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Boolean specialist;
    private Boolean openNow;
    private Double distance; // 현재 위치 기준 거리

    // 병원별 진료과목
    private List<DentalHospitalSubjectResponse> subjects;

    // 기존 응답 데이터 생성
    public DentalHospitalResponse(DentalHospital dentalHospital) {
        setDentalHospitalFields(dentalHospital);
    }

    // 기존 거리 포함 응답 데이터 생성
    public DentalHospitalResponse(
            DentalHospital dentalHospital,
            Double distance
    ) {
        setDentalHospitalFields(dentalHospital);
        this.distance = distance;
    }

    // 진료과목 포함 응답 데이터 생성
    public DentalHospitalResponse(
            DentalHospital dentalHospital,
            List<DentalHospitalSubjectResponse> subjects
    ) {
        setDentalHospitalFields(dentalHospital);
        this.subjects = subjects;
    }

    // 거리, 진료과목 포함 응답 데이터 생성
    public DentalHospitalResponse(
            DentalHospital dentalHospital,
            Double distance,
            List<DentalHospitalSubjectResponse> subjects
    ) {
        setDentalHospitalFields(dentalHospital);
        this.distance = distance;
        this.subjects = subjects;
    }

    // 공통 치과 정보
    private void setDentalHospitalFields(DentalHospital dentalHospital) {
        this.id = dentalHospital.getId();
        this.name = dentalHospital.getName();
        this.address = dentalHospital.getAddress();
        this.phone = dentalHospital.getPhone();
        this.latitude = dentalHospital.getLatitude();
        this.longitude = dentalHospital.getLongitude();
        this.specialist = dentalHospital.getSpecialist();
        this.openNow = dentalHospital.getOpenNow();
    }
}