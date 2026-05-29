package com.dentory.backend.dental;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dentals")
@RequiredArgsConstructor

public class DentalHospitalController {
      private final DentalHospitalService dentalHospitalService;

    @GetMapping
    public List<DentalHospital> getDentalHospitals() {
        return dentalHospitalService.getDentalHospitals();
    }
}
