// import { Card } from "antd"
import fhsicon from "../assets/fhsicon.png";

export const Home = () => {
    return (
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
    )
}