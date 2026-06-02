package com.dentory.backend.region;

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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
// 행정안전부 표준지역코드 API를 이용해 전국 시군구 데이터 저장
public class RegionImportService {

    private final RegionRepository regionRepository;

    // 공공데이터 API 인증키
    @Value("${openapi.service-key}")
    private String serviceKey;

    // 전국 시군구 데이터를 마지막 페이지까지 조회 후 저장
    @Transactional
    public void importAllRegions() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();

        // 현재 페이지 번호
        int pageNo = 1;

        // 한 번에 가져올 데이터 수
        int numOfRows = 1000;

        // 전체 데이터 수
        int totalCount = 0;

        // 마지막 페이지까지 반복 호출
        do {

            // 공공데이터 API 호출
            String responseBody = callRegionApi(pageNo, numOfRows);

            JsonNode root = objectMapper.readTree(responseBody);

            // 응답 구조
            // StanReginCd[0] -> head
            // StanReginCd[1] -> row

            JsonNode head =
                    root.path("StanReginCd")
                            .get(0)
                            .path("head");

            JsonNode rows =
                    root.path("StanReginCd")
                            .get(1)
                            .path("row");

            // 전체 데이터 건수
            totalCount =
                    head.get(0)
                            .path("totalCount")
                            .asInt();

            System.out.println("pageNo = " + pageNo);
            System.out.println("row size = " + rows.size());
            System.out.println("totalCount = " + totalCount);

            // 지역 데이터 저장
            for (JsonNode item : rows) {
                saveRegionItem(item);
            }

            pageNo++;

        } while ((pageNo - 1) * numOfRows < totalCount);
    }

    // 공공데이터 API 호출
    private String callRegionApi(
            int pageNo,
            int numOfRows
    ) throws Exception {

        StringBuilder urlBuilder =
                new StringBuilder(
                        "http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList"
                );

        urlBuilder.append("?")
                .append(
                        URLEncoder.encode(
                                "ServiceKey",
                                StandardCharsets.UTF_8
                        )
                )
                .append("=")
                .append(serviceKey);

        urlBuilder.append("&")
                .append(
                        URLEncoder.encode(
                                "pageNo",
                                StandardCharsets.UTF_8
                        )
                )
                .append("=")
                .append(
                        URLEncoder.encode(
                                String.valueOf(pageNo),
                                StandardCharsets.UTF_8
                        )
                );

        urlBuilder.append("&")
                .append(
                        URLEncoder.encode(
                                "numOfRows",
                                StandardCharsets.UTF_8
                        )
                )
                .append("=")
                .append(
                        URLEncoder.encode(
                                String.valueOf(numOfRows),
                                StandardCharsets.UTF_8
                        )
                );

        urlBuilder.append("&")
                .append(
                        URLEncoder.encode(
                                "type",
                                StandardCharsets.UTF_8
                        )
                )
                .append("=")
                .append(
                        URLEncoder.encode(
                                "json",
                                StandardCharsets.UTF_8
                        )
                );

        URL url = new URL(urlBuilder.toString());

        HttpURLConnection conn =
                (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty(
                "Content-type",
                "application/json"
        );

        BufferedReader br;

        if (conn.getResponseCode() >= 200
                && conn.getResponseCode() <= 300) {

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

    // 공공데이터 1건 처리
    private void saveRegionItem(JsonNode item) {

        String regionCode =
                item.path("region_cd").asText();

        String sidoCode =
                item.path("sido_cd").asText();

        String sigunguCode =
                item.path("sgg_cd").asText();

        String umdCode =
                item.path("umd_cd").asText();

        String riCode =
                item.path("ri_cd").asText();

        String fullName =
                item.path("locatadd_nm").asText();

        // 시도 데이터 제외
        if ("000".equals(sigunguCode)) {
            return;
        }

        // 읍면동 데이터 제외
        if (!"000".equals(umdCode)) {
            return;
        }

        // 리 데이터 제외
        if (!"00".equals(riCode)) {
            return;
        }

        String[] names = fullName.split(" ");

        String sidoName =
                names.length > 0 ? names[0] : "";

        String sigunguName =
                names.length > 1 ? names[1] : "";

        // 셀렉트 박스용 지역명 생성        
        String displayName =
                sidoName
                        .replace("특별시", "")
                        .replace("광역시", "")
                        .replace("특별자치시", "")
                        .replace("특별자치도", "")
                        .replace("도", "")
                        + " "
                        + sigunguName;

        saveIfNotExists(
                regionCode,
                sidoCode,
                sigunguCode,
                sidoName,
                sigunguName,
                displayName
        );
    }

    // 이미 존재하는 지역은 저장하지 않음
    private void saveIfNotExists(
            String regionCode,
            String sidoCode,
            String sigunguCode,
            String sidoName,
            String sigunguName,
            String displayName
    ) {

        if (
                regionRepository.existsByRegionCode(
                        regionCode
                )
        ) {
            return;
        }

        Region region =
                new Region(
                        regionCode,
                        sidoCode,
                        sigunguCode,
                        sidoName,
                        sigunguName,
                        displayName
                );

        regionRepository.save(region);
    }
}