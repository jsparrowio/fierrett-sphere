import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";

//Button
import { ConfigProvider, Layout } from 'antd';
// import Auth from "./utils/auth";

// useLayoutEffect, 
import { useEffect, useState } from "react";

// useLocation, useNavigate
import { Outlet,  } from "react-router-dom";
import NavOptions from "./components/Menu";
// import { User } from "./components/User"
// import { LogoutOutlined } from "@ant-design/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css'
import fhsicon from "./assets/fhsicon.png";
import Sider from "antd/es/layout/Sider";

const { Header, Content, Footer } = Layout;

const httpLink = new HttpLink({
  uri: "/graphql",
});

const authLink = new SetContextLink((_, headers) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const checkYear = () => {
  const currentYear = new Date().getFullYear();
  if (currentYear === 2025) {
    return "";
  } else {
    return `- ${currentYear}`
  }
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  // const navigate = useNavigate();
  // const location = useLocation();
  const [domLoad, setDomLoad] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setDomLoad(false);
    if (window.innerWidth <= 768) {
      setMobile(true);
    }
    setDomLoad(true);
    const handleResize = () => setMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // useLayoutEffect(() => {
  //   const loggedIn = Auth.loggedIn();
  //   if (loggedIn === true) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, [location]);

  // const logout = () => {
  //   Auth.logout();
  //   setIsLoggedIn(false);
  //   navigate("/login");
  // };

  return (
    <ApolloProvider client={client}>
      {domLoad &&
        <ConfigProvider
          theme={{
            components: {
              Layout: {
              },
              Card: {

              },
              Button: {

              },
            },
            token: {
            }
          }}
        >
          <Layout className="layout" style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
              <div className="logo"><img src={fhsicon} style={{ height: "50px", width: "50px", marginRight: "15px", marginLeft: "-30px" }}></img></div>
              <NavOptions />
            </Header>
            <Layout>
              {mobile ?
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={!collapsed ? { background: "black", padding: "1rem" } : { background: "black" }} theme="dark" breakpoint="md" collapsedWidth={0} zeroWidthTriggerStyle={{ }}>

                  {/* {isLoggedIn && !collapsed &&
                    <>
                      <User />
                      <Button
                        key="logout"
                        variant="solid"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => logout()}
                      >
                        <LogoutOutlined /> Logout
                      </Button>
                    </>
                  } */}

                </Sider>
                :
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: "black" }} theme="dark">

                  {/* {isLoggedIn && !collapsed &&
                    <>
                      <User />
                      <Button
                        key="logout"
                        variant="solid"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => logout()}
                      >
                        <LogoutOutlined /> Logout
                      </Button>
                    </>
                  }
                  {isLoggedIn && collapsed &&
                    <>
                      <User />
                      <Button
                        key="logout"
                        variant="solid"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => logout()}
                      >
                        <LogoutOutlined />
                      </Button>
                    </>
                  } */}

                </Sider>
              }
              <Content style={{ textAlign: 'center' }} className="App">
                <Outlet />
              </Content>
            </Layout>
            <Footer style={{ background: "black", color: "white", textAlign: 'center', padding: " 0 0 1rem 0", paddingBottom: "1rem" }}>Fierrett Sphere © jsparrowio 2025 {checkYear()} </Footer>
          </Layout>
        </ConfigProvider>
      }
    </ApolloProvider>
  )
}

export default App
