package com.dentory.backend.treatment;

import jakarta.persistence.*;

@Entity
// 진료과목 정보
public class TreatmentSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String englishName;

    @Column(length = 500)
    private String description;

    private Boolean officialSpecialty; // 전문과목 여부
    private Integer sortOrder;
    private Boolean active = true; // 사용 여부

    // 소속 카테고리
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private TreatmentCategory category;

    protected TreatmentSubject() {
    }

    // 진료과목 생성
    public TreatmentSubject(String name, String englishName, String description, Boolean officialSpecialty, Integer sortOrder) {
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.officialSpecialty = officialSpecialty;
        this.sortOrder = sortOrder;
    }

    // 카테고리 연결
    public void setCategory(TreatmentCategory category) {
        this.category = category;
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

    public Integer getSortOrder() {
        return sortOrder;
    }

    public Boolean getActive() {
        return active;
    }
}