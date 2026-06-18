import React from "react";
import { useRouter } from "next/router";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

const MainMenu = () => {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);

   // 웹일때 닫음 Drawer
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = () => {
      if (mediaQuery.matches) {
        setVisible(false);
      }
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const webMenuItems = [
    { key: "2", label: "치과 정보", path: "/dental" },
    { key: "3", label: "커뮤니티", path: "/community" },
  ];

  const mobileMenuItems = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "치과 정보", path: "/dental" },
    { key: "3", label: "커뮤니티", path: "/community" },
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
    setVisible(false);
  };

  return (
    <>
      <header className="h-20 bg-[#FEF7EB] px-4 md:px-[60px] border-b border-[#eadfd3]">
        <div className="flex h-full items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="
              flex items-center
              appearance-none border-none bg-transparent p-0
              text-[#6B5A50]
              outline-none shadow-none
              cursor-pointer
              hover:text-[#fcbf5d]
              active:text-[#e9a83f]
            "
          >
            <img
              src="/images/homeLogo.png"
              alt="Logo"
              className="h-20 w-20 md:h-24 md:w-24 object-contain"
            />
            <span className="text-[24px] md:text-[28px] font-extrabold leading-none">
              Dentory
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVisible(true)}
            className="
              md:hidden
              appearance-none border-none bg-transparent p-0
              text-[30px] leading-none text-[#6B5A50]
              outline-none shadow-none
              hover:text-[#fcbf5d]
              active:scale-95
            "
          >
            <MenuOutlined />
          </button>

          <nav className="hidden md:flex items-center gap-[72px]">
            {webMenuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleMenuClick(item.path)}
                className="
                  appearance-none border-none bg-transparent p-0
                  text-[18px] font-bold leading-none text-[#6B5A50]
                  outline-none shadow-none
                  hover:text-[#fcbf5d]
                  active:text-[#e9a83f]
                  cursor-pointer
                "
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <Drawer
        closable={false}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        title={
          <div className="flex w-full items-center justify-between">
            <span className="text-base font-bold text-[#6B5A50]">메뉴</span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="
                appearance-none border-none bg-transparent p-0
                text-[20px] leading-none text-[#6B5A50]
                outline-none shadow-none
                hover:text-[#fcbf5d]
                active:text-[#fcbf5d]
                active:scale-95
                cursor-pointer
              "
            >
              <CloseOutlined />
            </button>
          </div>
        }
        styles={{
          header: {
            backgroundColor: "#FFFAF3",
            borderBottom: "1px solid #d9d9d9",
          },
          body: {
            backgroundColor: "#FFFAF3",
            padding: 0,
          },
        }}
      >
        <div className="flex flex-col pt-3">
          {mobileMenuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleMenuClick(item.path)}
              className="
                w-full px-5 py-4 text-left
                text-base font-medium text-gray-700
                hover:bg-amber-100 hover:text-[#fcbf5d]
                active:bg-amber-100 active:text-[#fcbf5d]
                transition-colors
                cursor-pointer
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