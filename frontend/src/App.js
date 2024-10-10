import "antd/dist/antd.css"; // Ant Design 기본 스타일
import "./styles/globalStyles.css"; // 공통 CSS 파일
import { Layout } from "antd";

import { Route, Routes } from "react-router-dom";

import MainMenu from "./views/Home/MainMenu";
import MainContent from "./views/Home/MainContent";
import MainFooter from "./views/Home/MainFooter";
import DentalInfo from "./views/Dental/DentalInfo";

function App() {
  const { Content } = Layout;
  return (
    <>
      <MainMenu />
      <Content
        style={{
          padding: "30px",
        }}
      >
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/dentalInfo" element={<DentalInfo />} />
        </Routes>
      </Content>
      <MainFooter />
    </>
  );
}

export default App;
