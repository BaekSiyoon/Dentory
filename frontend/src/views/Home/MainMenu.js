import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅

import "../../styles/globalStyles.css"; // 공통 CSS 파일
import { MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Row, Col, Drawer, Button } from "antd";

import useResponsive from "../../Common/useResponsive";

const MainMenu = () => {
  const navigate = useNavigate(); // useNavigate 훅
  const { Header } = Layout;
  const { isMobile, isTablet, isDesktop, isLargeScreen } = useResponsive(); // 반응형 상태
  const [visible, setVisible] = React.useState(false);

  // 메뉴 아이템 배열
  const menuItems = [
    {
      key: "1",
      label: "home",
      className: "homeMenuItemColor",
      path: "/", // 이동할 경로
    },
    {
      key: "2",
      label: "정보",
      className: "homeMenuItemColor",
      path: "/dentalInfo", // 이동할 경로
    },
    {
      key: "3",
      label: "커뮤니티",
      className: "homeMenuItemColor",
      path: "/", // 이동할 경로
    },
    {
      key: "4",
      label: "마이페이지",
      className: "homeMenuItemColor",
      path: "/", // 이동할 경로
    },
  ];

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  // 클릭 시 메뉴 이동 (path 찾아서 이동)
  const handleMenuClick = (e) => {
    // console.log(" e.key : " + e.key);
    const clickedItem = menuItems.find((item) => item.key === e.key);
    // console.log("clickedItem ", clickedItem);
    if (clickedItem) {
      navigate(clickedItem.path);
    }
  };
  return (
    <>
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
                  onClick={handleMenuClick}
                  items={menuItems.map((item) => ({
                    ...item,
                    label: <span className={item.className}>{item.label}</span>, // className 적용
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
        open={visible}
        headerStyle={{
          backgroundColor: "#F7F5EE",
          borderBottom: "1px solid #d9d9d9", // 헤더 경계선
        }}
        bodyStyle={{
          backgroundColor: "#F7F5EE",
          paddingTop: "0",
          borderRight: "0px !important",
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          className="homeMenuBorderBottomColor"
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            ...item,
            label: <span className={item.className}>{item.label}</span>, // className 적용
          }))}
          style={{
            backgroundColor: "#F7F5EE",
            paddingTop: "10px",
          }}
        ></Menu>
      </Drawer>
    </>
  );
};

export default MainMenu;
