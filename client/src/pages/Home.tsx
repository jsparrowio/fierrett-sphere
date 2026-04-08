import { useLayoutEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Layout, theme } from 'antd';
import fhsicon from "../assets/fhsicon.png";
// import { Button, ConfigProvider, Layout } from 'antd';
// import { Card } from "antd"
import Auth from "../utils/auth";
import { useUser } from "../components/User"

const { Content } = Layout;

export const Home = () => {
    // const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const activeUser = useUser();
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    useLayoutEffect(() => {
        const loggedIn = Auth.loggedIn();
        if (loggedIn === true) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]);

    return (
        <>
            {isLoggedIn ?
                <Content style={{ margin: '24px 16px 0', height: "100%" }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: "97%",
                            background: "black",
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <h2 style={{
                            color: "#FFFFFF",
                        }}>
                            {activeUser.first_name ?
                                <>
                                    Welcome, {activeUser.first_name}!
                                </>
                                :
                                <>
                                    Welcome!
                                </>
                            }
                        </h2>
                    </div>
                </Content>
                :
                <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'margin': '3rem 5rem', }}>
                    <div>
                        <div className="landing-container">
                            <img src={fhsicon} style={{ 'height': '225px', 'width': '150px' }} alt="fierrettspherelogo"></img>
                            <h1 className="title">Welcome!</h1>
                            <div className="message-container">
                                Welcome to the Fierrett Sphere, a private set of applications curated for a select group.
                                <br />If you are a member and are attempting to reach a specific application, please check the URL you have entered.
                                <br />If you are having issues accessing The Fierrett Sphere and need assistance, please reach out to the admin team on Discord.
                                <br />If you are not a member, unfortunately The Fierrett Sphere is currently invite only. We apologize for the inconvenience.
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
