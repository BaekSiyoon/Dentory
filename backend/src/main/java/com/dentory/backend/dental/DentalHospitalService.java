package com.dentory.backend.dental;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DentalHospitalService {

    private final DentalHospitalRepository dentalHospitalRepository;

    public List<DentalHospital> getDentalHospitals() {
        return dentalHospitalRepository.findAll();
    }
}