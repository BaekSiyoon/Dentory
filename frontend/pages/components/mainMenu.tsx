import React from "react";
import { useRouter } from "next/router";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import useResponsive from "../../common/useResponsive";

const MainMenu = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [visible, setVisible] = React.useState(false);

  const menuItems = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "치과 정보", path: "/dentalInfo" },
    { key: "3", label: "커뮤니티", path: "/" },
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
    setVisible(false);
  };

  return (
    <>
      <header className="h-[70px] bg-[#FFFAF3] px-[60px] border-b border-[#eadfd3]">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-8">
            <img
              src="/images/home_logo.png"
              alt="Logo"
              className="h-[96px] w-[96px] object-contain"
            />

            <span className="text-[30px] font-extrabold leading-none text-[#6B5A50]">
              Dentory
            </span>
          </div>

          {isMobile ? (
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="
                appearance-none border-none bg-transparent p-0
                text-[30px] leading-none text-[#6B5A50]
                outline-none shadow-none
                hover:text-[#fcbf5d]
                active:scale-95
              "
            >
              <MenuOutlined />
            </button>
          ) : (
            <nav className="flex items-center gap-[72px] ">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleMenuClick(item.path)}
                  className="
                    appearance-none border-none bg-transparent p-0
                    text-[20px] font-bold leading-none text-[#6B5A50]
                    outline-none shadow-none
                    hover:text-[#fcbf5d]
                    active:text-[#e9a83f]
                  "
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <Drawer
        title="메뉴"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        headerStyle={{
          backgroundColor: "#FFFAF3",
          borderBottom: "1px solid #d9d9d9",
        }}
        bodyStyle={{
          backgroundColor: "#FFFAF3",
          padding: 0,
        }}
      >
        <div className="flex flex-col pt-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className="
                w-full px-5 py-4 text-left
                text-base font-medium text-gray-700
                hover:bg-amber-100 hover:text-amber-700
                active:bg-amber-200
                transition-colors
              "
            >
              {item.label}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default MainMenu;