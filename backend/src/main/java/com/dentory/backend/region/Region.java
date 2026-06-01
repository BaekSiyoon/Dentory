package com.dentory.backend.region;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
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

    private Boolean active = true;

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