import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import Auth from "../utils/auth";

function NavOptions() {
  const location = useLocation();
  const nav = useNavigate();

  const isLoggedIn = Auth.loggedIn();

  const items: MenuProps["items"] = [
    {
      label: "Home",
      key: "/",
      style: { borderRadius: "10px" },
      icon: <HomeOutlined />,
    },
  ];

  if (!isLoggedIn) {
    items.push({
      label: "Login",
      key: "/login",
      style: { borderRadius: "10px" },
      icon: <UserOutlined />,
    });
  }

  return (
    <Menu
      theme="dark"
      selectedKeys={[location.pathname]}
      mode="horizontal"
      overflowedIndicator={null}
      onClick={({ key }) => nav(key)}
      items={items}
    />
  );
}

export default NavOptions;
