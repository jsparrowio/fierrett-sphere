import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  HomeOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import Auth from "../utils/auth";

function NavOptions() {
  const location = useLocation();
  const nav = useNavigate();
  const isLoggedIn = Auth.loggedIn();
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    let intervalId: number | null = null;
    let retryId: number | null = null;

    const checkServer = async () => {
      try {
        const res = await fetch("/api/server-status", { cache: "no-store" });
        const data = await res.json();
        if (active) setServerOnline(Boolean(data?.online));
        console.log(`TFS server status: ${data?.online ? 'Online' : 'Offline'}`); 
      } catch {
        if (active) setServerOnline(false);
        console.log(`TFS server status: Offline`); 
      }
    };

    checkServer();
    retryId = window.setTimeout(checkServer, 5000); // quick retry
    intervalId = window.setInterval(checkServer, 30000); // normal poll

    return () => {
      active = false;
      if (intervalId) window.clearInterval(intervalId);
      if (retryId) window.clearTimeout(retryId);
    };
  }, []);

  const items: MenuProps["items"] = [
    {
      label: "Home",
      key: "/",
      style: { borderRadius: "10px" },
      icon: <HomeOutlined />,
    },
  ];

  if (!isLoggedIn) {
    // items.push({
    //   label: "Login",
    //   key: "/login",
    //   style: { borderRadius: "10px" },
    //   icon: <UserOutlined />,
    // });
  }

  const statusColor =
    serverOnline === null ? "#999" : serverOnline ? "#52c41a" : "#ff4d4f";

  const statusText =
    serverOnline === null
      ? "Checking..."
      : serverOnline
        ? "Online"
        : "Offline";

  const StatusIcon =
    serverOnline === null
      ? null
      : serverOnline
        ? CheckCircleFilled
        : CloseCircleFilled;

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "0.75rem" }}>
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        mode="horizontal"
        overflowedIndicator={null}
        onClick={({ key }) => nav(key)}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />

      <a href="https://status.fierrettsphere.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <div className="status-box">
          <span style={{ fontSize: "0.85rem" }}><b>Fierrett Sphere Core Server:</b> {statusText}</span>
          <span>&nbsp;</span>
          {StatusIcon && <StatusIcon style={{ color: statusColor, fontSize: 16 }} />}
        </div>
      </a>
    </div>
  );
}

export default NavOptions;
