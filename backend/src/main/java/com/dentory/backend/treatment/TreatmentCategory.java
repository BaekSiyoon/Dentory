package com.dentory.backend.treatment;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
// 진료과목 카테고리
public class TreatmentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer sortOrder;
    private Boolean active = true; // 사용 여부

    // 카테고리에 포함된 진료과목
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TreatmentSubject> subjects = new ArrayList<>();

    protected TreatmentCategory() {
    }

    // 카테고리 생성
    public TreatmentCategory(String name, Integer sortOrder) {
        this.name = name;
        this.sortOrder = sortOrder;
    }

    // 진료과목 추가 및 카테고리 연결
    public void addSubject(TreatmentSubject subject) {
        subjects.add(subject);
        subject.setCategory(this);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public List<TreatmentSubject> getSubjects() {
        return subjects;
    }
}