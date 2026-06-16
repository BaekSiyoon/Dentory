package com.dentory.backend.dental;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

// 치과 정보
@Entity
@Getter
@Setter
public class DentalHospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hospitalCode;

    // 심평원 상세 API 조회에 사용할 암호화된 요양기호
    private String encryptedYkiho;

    private String name;
    private String address;
    private String phone;

    private Double latitude; // 위도
    private Double longitude; // 경도

    private Boolean specialist = false; // 전문의 여부
    private Boolean openNow = false; // 진료중 여부
    private Boolean active = true; // 사용 여부
}