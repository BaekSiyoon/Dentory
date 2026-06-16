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

@Service
@RequiredArgsConstructor
// 치과 데이터 저장
public class DentalHospitalImportService {

    private final DentalHospitalRepository dentalHospitalRepository;

    // 공공데이터 API 인증키
    @Value("${openapi.service-key}")
    private String serviceKey;

    // 병원정보서비스 API에서 치과의원 데이터 저장
    @Transactional
    public void importDentalHospitals() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        int pageNo = 1;
        int numOfRows = 100;
        int totalCount = 0;

        do {
            String responseBody = callHospitalApi(pageNo, numOfRows);

            if (!responseBody.trim().startsWith("{")) {
                throw new IllegalStateException("JSON 응답이 아닙니다: " + responseBody);
            }

            JsonNode root = objectMapper.readTree(responseBody);

            JsonNode body = root.path("response").path("body");
            JsonNode items = body.path("items").path("item");

            totalCount = body.path("totalCount").asInt();

            if (items.isMissingNode() || items.isNull()) {
                return;
            }

            if (items.isArray()) {
                for (JsonNode item : items) {
                    saveDentalHospitalItem(item);
                }
            } else {
                saveDentalHospitalItem(items);
            }

            pageNo++;

        } while ((pageNo - 1) * numOfRows < totalCount);
    }

    // 병원정보서비스 API 호출
    private String callHospitalApi(int pageNo, int numOfRows) throws Exception {
        StringBuilder urlBuilder = new StringBuilder(
                "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList"
        );

        urlBuilder.append("?serviceKey=")
                .append(serviceKey);

        urlBuilder.append("&pageNo=")
                .append(pageNo);

        urlBuilder.append("&numOfRows=")
                .append(numOfRows);

        urlBuilder.append("&clCd=51"); // 치과의원

        urlBuilder.append("&_type=json");

        System.out.println("병원 API 요청 URL = " + urlBuilder);

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
    private void saveDentalHospitalItem(JsonNode item) {
        // ykiho는 심평원 상세 API 조회에 사용할 수 있는 암호화된 요양기호
        String encryptedYkiho = item.path("ykiho").asText();

        String hospitalCode = encryptedYkiho;
        String name = item.path("yadmNm").asText();
        String address = item.path("addr").asText();
        String phone = item.path("telno").asText();

        Double longitude = getDoubleValue(item, "XPos");
        Double latitude = getDoubleValue(item, "YPos");

        if (encryptedYkiho == null || encryptedYkiho.isBlank()) {
            return;
        }

        // 병원코드 중복 저장 방지
        if (dentalHospitalRepository.existsByHospitalCode(hospitalCode)) {
            return;
        }

        DentalHospital dentalHospital = new DentalHospital();

        dentalHospital.setHospitalCode(hospitalCode);
        dentalHospital.setEncryptedYkiho(encryptedYkiho); // 상세 API 호출용 식별값 저장
        dentalHospital.setName(name);
        dentalHospital.setAddress(address);
        dentalHospital.setPhone(phone);
        dentalHospital.setLatitude(latitude);
        dentalHospital.setLongitude(longitude);
        dentalHospital.setSpecialist(false);
        dentalHospital.setOpenNow(false);
        dentalHospital.setActive(true);

        dentalHospitalRepository.save(dentalHospital);
    }

    // 좌표 값 변환
    private Double getDoubleValue(JsonNode item, String fieldName) {
        String value = item.path(fieldName).asText();

        if (value == null || value.isBlank()) {
            return null;
        }

        return Double.parseDouble(value);
    }
}