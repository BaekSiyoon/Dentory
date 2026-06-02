package com.dentory.backend.dental.dto;

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

    // 응답 데이터 생성
    public DentalHospitalResponse(DentalHospital dentalHospital) {
        this.id = dentalHospital.getId();
        this.name = dentalHospital.getName();
        this.address = dentalHospital.getAddress();
        this.phone = dentalHospital.getPhone();
        this.latitude = dentalHospital.getLatitude();
        this.longitude = dentalHospital.getLongitude();
        this.specialist = dentalHospital.getSpecialist();
        this.openNow = dentalHospital.getOpenNow();
    }

    // 거리 포함 응답 데이터 생성
    public DentalHospitalResponse(
            DentalHospital dentalHospital,
            Double distance
    ) {
        this.id = dentalHospital.getId();
        this.name = dentalHospital.getName();
        this.address = dentalHospital.getAddress();
        this.phone = dentalHospital.getPhone();
        this.latitude = dentalHospital.getLatitude();
        this.longitude = dentalHospital.getLongitude();
        this.specialist = dentalHospital.getSpecialist();
        this.openNow = dentalHospital.getOpenNow();
        this.distance = distance;
    }
}