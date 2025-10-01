// import { Card } from "antd"
import fhsicon from "../assets/fhsicon.png";

export const Home = () => {
    return (
        <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'margin': '3rem 5rem', }}>
            <div>
                <div className="landing-container">
                    <img src={fhsicon} style={{ 'height': '150px', 'width': '150px' }} alt="fierrettspherelogo"></img>
                    <h1 className="title">The Fierrett Sphere</h1>
                    <div className="message-container">
                        Welcome to the Fierrett Sphere landing page! This site is currently under construction, but should be up soon!
                    </div>
                </div>
            </div>
        </div>
    )
}