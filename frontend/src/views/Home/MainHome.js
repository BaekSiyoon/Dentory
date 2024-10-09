import React, { useEffect } from "react";
import "../../styles/globalStyles.css"; // 공통 CSS 파일
import { Layout, Menu, Row, Col } from "antd";
import apiClient from "../../Common/ApiClient";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { commonEmptyStringState } from "../../Common/RecoilStatus";
import MainContent from "./MainContent";

const MainHome = () => {
  const { Header, Content, Footer } = Layout;
  // const [text, setText] = useRecoilState(commonEmptyStringState); // atom을 구독

  useEffect(() => {
    // GET 요청을 보냄
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/test"); // /test 경로로 GET 요청
        console.log("API 호출 성공:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F7F5EE",
      }}
    >
      <Header style={{ padding: "0 20px", backgroundColor: "#F7F5EE" }}>
        <Row align="middle" style={{ height: "100%", alignContent: "center" }}>
          <Col
            span={6}
            // offset={10}
            style={{ marginLeft: "60px", paddingTop: "10px" }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/home_logo.png`}
              alt="Logo"
              style={{ paddingTop: "5px", height: "80px", width: "100px" }}
            />
          </Col>
          <Col
            span={10}
            flex="auto"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["1"]}
              className="homeMenuBorderBottomColor"
              style={{
                backgroundColor: "#F7F5EE",
              }}
            >
              <Menu.Item
                key="1"
                className="homeMenuItemColor"
                style={{
                  margin: "0 20px",
                  color: "black !important",
                }}
              >
                정보
              </Menu.Item>
              <Menu.Item
                key="2"
                className="homeMenuItemColor"
                style={{
                  margin: "0 20px",
                  color: "black !important",
                }}
              >
                커뮤니티
              </Menu.Item>
              <Menu.Item
                key="3"
                className="homeMenuItemColor"
                style={{
                  margin: "0 20px",
                  color: "black !important",
                }}
              >
                마이페이지
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
      {/* content */}
      <MainContent />
      <Footer style={{ textAlign: "center", backgroundColor: "#F7F5EE" }}>
        {/* <h1>Footer</h1> */}
      </Footer>
    </Layout>
  );
};

export default MainHome;
