import "antd/dist/antd.css"; // Ant Design 기본 스타일
import "./styles/globalStyles.css"; // 공통 CSS 파일

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter basename="/dentory">
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);

// Performance 측정을 위한 코드
// reportWebVitals(); // 필요시 주석을 해제하여 사용
