import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/globalStyles.css"; // 공통 CSS 파일
import { Row, Col, Carousel, Card, Button } from "antd";
import apiClient from "../../Common/ApiClient";

const MainContent = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // GET 요청을 보냄
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/test"); // /test 경로로 GET 요청
        // console.log("API 호출 성공:", response.data);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const dentalBtnClick = () => {
    navigate("/dentalInfo");
  };

  return (
    <div style={{ padding: "40px", flex: 1, position: "relative" }}>
      {/* 고정된 텍스트 영역 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
          zIndex: 1,
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        <p>텍스트 영역</p>
        <Button
          type="default"
          size="middle"
          variant="solid"
          id="dentalBtn"
          // onClick={dentalBtnClick}
        >
          찾기
        </Button>
      </div>
      <Carousel autoplay>
        {/* 첫 번째 슬라이드 */}
        <div>
          <Row>
            <Col span={24}>
              <Card
                hoverable
                style={{
                  color: "#fff",
                  textAlign: "center",
                  background: "#FCBF5D",
                  height: "400px",
                }}
                cover={
                  <img
                    alt="example1"
                    src={`${process.env.PUBLIC_URL}/images/backgroundImg1.jpg`}
                  />
                }
              >
                <h3>이미지 1</h3>
              </Card>
            </Col>
          </Row>
        </div>
        {/* 두 번째 슬라이드 */}
        <div>
          <Row>
            <Col span={24}>
              <Card
                hoverable
                style={{
                  color: "#fff",
                  textAlign: "center",
                  background: "#FCBF5D",
                  height: "400px",
                }}
                cover={
                  <img
                    alt="example2"
                    src={`${process.env.PUBLIC_URL}/images/backgroundImg2.jpg`}
                  />
                }
              >
                <h3>이미지 2</h3>
              </Card>
            </Col>
          </Row>
        </div>
        {/* 세 번째 슬라이드  */}
        <div>
          <Row>
            <Col span={24}>
              <Card
                hoverable
                style={{
                  color: "#fff",
                  textAlign: "center",
                  background: "#FCBF5D",
                  height: "400px",
                }}
                cover={
                  <img
                    alt="example3"
                    src={`${process.env.PUBLIC_URL}/images/backgroundImg3.jpg`}
                  />
                }
              >
                <h3>이미지 3</h3>
              </Card>
            </Col>
          </Row>
        </div>
        {/* 네 번째 슬라이드  */}
        <div>
          <Row>
            <Col span={24}>
              <Card
                hoverable
                style={{
                  color: "#fff",
                  textAlign: "center",
                  background: "#FCBF5D",
                  height: "400px",
                }}
                cover={
                  <img
                    alt="example4"
                    src={`${process.env.PUBLIC_URL}/images/backgroundImg4.jpg`}
                  />
                }
              >
                <h3>이미지 4</h3>
              </Card>
            </Col>
          </Row>
        </div>
      </Carousel>
    </div>
  );
};

export default MainContent;
