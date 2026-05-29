import React from "react";
import { useRouter } from "next/router";
import { MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Row, Col, Drawer, Button, MenuProps, Typography } from "antd";
import useResponsive from "../../common/useResponsive";

const { Text } = Typography;

const MainMenu = () => {
  const router = useRouter();
  const { Header } = Layout;
  const { isMobile, isTablet, isDesktop, isLargeScreen } = useResponsive();
  const [visible, setVisible] = React.useState(false);

  const menuItems = [
    { key: "1", label: "Home", className: "homeMenuItemColor", path: "/" },
    { key: "2", label: "치과 장보", className: "homeMenuItemColor", path: "/dentalInfo" },
    { key: "3", label: "커뮤니티", className: "homeMenuItemColor", path: "/" },
    { key: "4", label: "마이페이지", className: "homeMenuItemColor", path: "/" },
  ];

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const clickedItem = menuItems.find((item) => item.key === e.key);
    if (clickedItem) router.push(clickedItem.path);
  };

  return (
    <>
      <Header style={{ padding: "0 20px", backgroundColor: "#F7F5EE" }}>
        <Row
          style={{
            height: "100%",
            display: "flex",
            flexFlow: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isMobile ? (
            <Row style={{ height: "100%", width: "100%", alignContent: "center" }}>
              <Col
                span={18}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "10px",
                }}
              >
                <img src={`/images/home_logo.png`} alt="Logo" style={{ height: "50px", width: "50px" }} />
                <Text style={{ fontSize: "24px", fontWeight: "bold" }}>Dentory</Text>
              </Col>
              <Col
                span={6}
                style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px", alignItems: "center" }}
              >
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={showDrawer}
                  style={{ fontSize: "24px", color: "#fcbf5d" }}
                />
              </Col>
            </Row>
          ) : (
            <>
              <Col
                span={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginLeft: "60px",
                }}
              >
                <img src={`/images/home_logo.png`} alt="Logo" style={{ height: "50px", width: "50px" }} />
                <Text style={{ fontSize: "28px", fontWeight: "bold" }}>Dentory</Text>
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
                  style={{ backgroundColor: "#F7F5EE" }}
                  onClick={handleMenuClick}
                  items={menuItems.map((item) => ({
                    ...item,
                    label: <span className={item.className}>{item.label}</span>,
                  }))}
                />
              </Col>
            </>
          )}
        </Row>
      </Header>

      <Drawer
        title="메뉴"
        placement="right"
        onClose={onClose}
        open={visible}
        headerStyle={{ backgroundColor: "#F7F5EE", borderBottom: "1px solid #d9d9d9" }}
        bodyStyle={{ backgroundColor: "#F7F5EE", paddingTop: "0" }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          className="homeMenuBorderBottomColor"
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            ...item,
            label: <span className={item.className}>{item.label}</span>,
          }))}
          style={{ backgroundColor: "#F7F5EE", paddingTop: "10px" }}
        />
      </Drawer>
    </>
  );
};

export default MainMenu;
