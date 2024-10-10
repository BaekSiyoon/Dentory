import React, { useEffect } from "react";
import "../../styles/globalStyles.css"; // 공통 CSS 파일
import { MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Row, Col, ConfigProvider, Drawer, Button } from "antd";

import apiClient from "../../Common/ApiClient";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { commonEmptyStringState } from "../../Common/RecoilStatus";
import MainContent from "./MainContent";
import useResponsive from "../../Common/useResponsive";
import enUS from "antd/es/locale/en_US";

const MainHome = () => {
  const { Header, Content, Footer } = Layout;
  const { isMobile, isTablet, isDesktop, isLargeScreen } = useResponsive(); // 반응형 상태 가져오기
  const { xxl } = useResponsive();
  // const [text, setText] = useRecoilState(commonEmptyStringState); // atom을 구독
  const [visible, setVisible] = React.useState(false);

  // 메뉴 아이템 배열
  const menuItems = [
    {
      key: "1",
      label: "정보",
      className: "homeMenuItemColor",
    },
    {
      key: "2",
      label: "커뮤니티",
      className: "homeMenuItemColor",
    },
    {
      key: "3",
      label: "마이페이지",
      className: "homeMenuItemColor",
    },
  ];

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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
    <>
      <ConfigProvider
        componentSize={isLargeScreen ? "large" : isMobile ? "small" : "middle"}
      >
        <Layout
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F7F5EE",
          }}
        >
          <Header style={{ padding: "0 20px", backgroundColor: "#F7F5EE" }}>
            <Row
              style={{
                height: "100%",
                display: "flex",
                flexFlow: "nowrap",
                justifyContent: "spaceBetween",
              }}
            >
              {isMobile ? (
                <Row
                  style={{
                    height: "100%",
                    width: "100%",
                    alignContent: "center",
                  }}
                >
                  <Col
                    span={6}
                    style={{
                      paddingTop: "10px",
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/home_logo.png`}
                      alt="Logo"
                      style={{
                        paddingTop: "5px",
                        height: "70px",
                        width: "80px",
                      }}
                    />
                  </Col>
                  <Col
                    span={18}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "10px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="text"
                      icon={<MenuOutlined />}
                      onClick={showDrawer}
                      style={{
                        fontSize: "24px",
                        marginRight: "10px",
                        color: "#fcbf5d",
                      }}
                    />
                  </Col>
                </Row>
              ) : (
                <>
                  <Col
                    span={6}
                    style={{
                      marginLeft: "60px",
                      paddingTop: "10px",
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/home_logo.png`}
                      alt="Logo"
                      style={{
                        paddingTop: "5px",
                        height: "80px",
                        width: "100px",
                      }}
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
                      items={menuItems.map((item) => ({
                        ...item,
                        label: (
                          <span className={item.className}>{item.label}</span>
                        ), // className 적용
                      }))}
                    ></Menu>
                  </Col>
                </>
              )}
            </Row>
          </Header>

          {/* Drawer 추가 */}
          <Drawer
            title="메뉴"
            placement="right"
            onClose={onClose}
            visible={visible}
            headerStyle={{
              backgroundColor: "#F7F5EE",
              borderBottom: "1px solid #d9d9d9", // 헤더 경계선
            }}
            bodyStyle={{
              backgroundColor: "#F7F5EE", // 본체 배경색
              paddingTop: "0",
              borderRight: "0px !important",
            }}
          >
            <Menu
              // mode="vertical"
              defaultSelectedKeys={["1"]}
              className="homeMenuBorderBottomColor"
              items={menuItems.map((item) => ({
                ...item,
                label: <span className={item.className}>{item.label}</span>, // className 적용
              }))}
              style={{
                backgroundColor: "#F7F5EE", // 원하는 배경색 추가
                paddingTop: "10px",
              }}
            ></Menu>
          </Drawer>

          {/* content */}
          <MainContent />
          <Footer style={{ textAlign: "center", backgroundColor: "#F7F5EE" }}>
            {/* <h1>Footer</h1> */}
          </Footer>
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default MainHome;
