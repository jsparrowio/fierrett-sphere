import { Menu } from "antd";
//useLocation,
import {  useNavigate } from "react-router-dom";
// import { useEffect, useLayoutEffect, useState } from "react";
import {
  HomeOutlined,
  UserOutlined
} from "@ant-design/icons";
// import { useQuery } from "@apollo/client/react";
// import { QUERY_ME } from "../utils/queries";
// import Auth from "../utils/auth";

function NavOptions() {
  // const { loading, refetch } = useQuery(QUERY_ME);
  // const location = useLocation();

  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // const [reload, setReload] = useState<boolean>(true);

  // useEffect(() => {
  //   refetch();
  // }, []);

  // useLayoutEffect(() => {
  //   setReload(true);
  //   refetch();
  //   const loggedIn = Auth.loggedIn();
  //   if (loggedIn === true) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  //   setReload(false);
  // }, [location]);
  const nav = useNavigate();

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={['/']}
      mode="horizontal"
      onClick={({ key }) => {
        nav(key);
      }}
      style={{
        // marginLeft: "0.5em",
        // marginTop: "0.5em",
        // textAlign: "left",
        // background: "black"
      }}
      items={
        // isLoggedIn && loading === false && reload === false ? [
        //   {
        //     label: "Home", key: "/",
        //     style: {
        //       borderRadius: "20px"
        //     },
        //     icon: <HomeOutlined />
        //   },
        // ] :
           [
           {
              label: "Home", key: "/",
              style: {
                borderRadius: "10px"
              },
              icon: <HomeOutlined />
            },
            {
              label: "Login",
              key: "/login",
              style: {

              },
              icon: <UserOutlined />,
            },
          ]

       }
    />
  );
}

export default NavOptions;
