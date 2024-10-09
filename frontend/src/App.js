import "antd/dist/antd.css"; // Ant Design 기본 스타일
import "./styles/globalStyles.css"; // 공통 CSS 파일

import { Route, Routes, Navigate } from "react-router-dom";
import MainHome from "./views/Home/MainHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainHome />} />
      {/* 다른 라우트 설정 */}
    </Routes>
  );
}

export default App;
