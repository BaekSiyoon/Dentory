package com.dentory.backend.dental;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
// 병원별 진료과목 데이터 저장
public class DentalHospitalSubjectImportService {

    private final DentalHospitalRepository dentalHospitalRepository;
    private final DentalHospitalSubjectRepository dentalHospitalSubjectRepository;

    // 공공데이터 API 인증키
    @Value("${openapi.service-key}")
    private String serviceKey;

    // 의료기관별상세정보서비스 API에서 병원별 진료과목 저장
    @Transactional
    public void importDentalHospitalSubjects() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        List<DentalHospital> dentalHospitals =
                dentalHospitalRepository.findAllByActiveTrueAndEncryptedYkihoIsNotNull();

        for (DentalHospital dentalHospital : dentalHospitals) {
            String responseBody = callSubjectApi(dentalHospital.getEncryptedYkiho());

            // 응답 확인
            if (!responseBody.trim().startsWith("{")) {
                System.out.println("병원명 = " + dentalHospital.getName());
                continue;
            }

            JsonNode root = objectMapper.readTree(responseBody);

            JsonNode body = root.path("response").path("body");
            JsonNode items = body.path("items").path("item");

            if (items.isMissingNode() || items.isNull()) {
                System.out.println("진료과목 없음. 병원명 = " + dentalHospital.getName());
                continue;
            }

            if (items.isArray()) {
                for (JsonNode item : items) {
                    saveSubjectItem(dentalHospital, item);
                }
            } else {
                saveSubjectItem(dentalHospital, items);
            }
        }
    }

    // 의료기관별상세정보서비스 진료과목정보 API 호출
    private String callSubjectApi(String encryptedYkiho) throws Exception {
        StringBuilder urlBuilder = new StringBuilder(
                "https://apis.data.go.kr/B551182/MadmDtlInfoService2.8/getDgsbjtInfo2.8"
        );

        urlBuilder.append("?serviceKey=")
                .append(serviceKey);

        // ykiho는 병원정보서비스에서 받은 값을 그대로 전달
        urlBuilder.append("&ykiho=")
                .append(encryptedYkiho);

        urlBuilder.append("&_type=json");

        System.out.println("진료과목 API 요청 URL = " + urlBuilder);

        URL url = new URL(urlBuilder.toString());

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");

        BufferedReader br;

        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            br = new BufferedReader(
                    new InputStreamReader(
                            conn.getInputStream(),
                            StandardCharsets.UTF_8
                    )
            );
        } else {
            br = new BufferedReader(
                    new InputStreamReader(
                            conn.getErrorStream(),
                            StandardCharsets.UTF_8
                    )
            );
        }

        StringBuilder sb = new StringBuilder();

        String line;

        while ((line = br.readLine()) != null) {
            sb.append(line);
        }

        br.close();
        conn.disconnect();

        return sb.toString();
    }

    // API 응답 1건 저장
    private void saveSubjectItem(
            DentalHospital dentalHospital,
            JsonNode item
    ) {
        String subjectCode = item.path("dgsbjtCd").asText();
        String subjectName = item.path("dgsbjtCdNm").asText();

        if (subjectCode == null || subjectCode.isBlank()) {
            return;
        }

        if (subjectName == null || subjectName.isBlank()) {
            return;
        }

        // 같은 병원에 같은 진료과목이 중복 저장되지 않도록 방지
        boolean exists = dentalHospitalSubjectRepository
                .existsByDentalHospitalIdAndSubjectCode(
                        dentalHospital.getId(),
                        subjectCode
                );

        if (exists) {
            return;
        }

        DentalHospitalSubject dentalHospitalSubject = new DentalHospitalSubject();

        dentalHospitalSubject.setDentalHospital(dentalHospital);
        dentalHospitalSubject.setSubjectCode(subjectCode);
        dentalHospitalSubject.setSubjectName(subjectName);

        dentalHospitalSubjectRepository.save(dentalHospitalSubject);
    }
}