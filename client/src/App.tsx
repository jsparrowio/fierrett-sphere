// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import ThemeProvider from 'react-bootstrap/ThemeProvider'
import './App.css'
import { Layout, Menu, Breadcrumb } from 'antd';
import fhsicon from "./assets/fhsicon.png";

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <div className="logo"><img src={fhsicon} style={{ height: "50px", width: "50px", marginRight: "15px", marginLeft: "-30px" }}></img></div>
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ textAlign: 'center' }}>
          <div className="App">
            <div className="landing-container">
              <img src={fhsicon} style={{ 'height': '150px', 'width': '150px' }} alt="fierrettspherelogo"></img>
              <h1 className="title">The Fierrett Sphere</h1>
              <div className="message-container">
                Welcome to the Fierrett Sphere landing page! This site is currently under construction, but should be up soon!
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ background: "black", color: "white", textAlign: 'center', padding: " 0 0 1rem 0", paddingBottom: "1rem" }}>Fierrett Sphere © jsparrowio</Footer>
      </Layout>
    </>
  )
}

export default App
