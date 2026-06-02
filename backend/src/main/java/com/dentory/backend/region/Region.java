package com.dentory.backend.region;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
// 전국 시군구 지역 정보
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String regionCode;
    private String sidoCode;
    private String sigunguCode;

    private String sidoName;
    private String sigunguName;
    private String displayName;

    // 사용 여부를 관리하기 위한 상태
    private Boolean active = true;

     // 지역 데이터 최초 저장 시 사용
    public Region(
            String regionCode,
            String sidoCode,
            String sigunguCode,
            String sidoName,
            String sigunguName,
            String displayName
    ) {
        this.regionCode = regionCode;
        this.sidoCode = sidoCode;
        this.sigunguCode = sigunguCode;
        this.sidoName = sidoName;
        this.sigunguName = sigunguName;
        this.displayName = displayName;
        this.active = true;
    }
}