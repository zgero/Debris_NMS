import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Icon, Layout, Menu } from 'antd';
import { createBrowserHistory } from 'history';
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Streams from "./Streams";
import Key from "./Key";

import "./App.css"


const { Header, Sider, Content, Footer } = Layout;

class App extends Component {

    fullTitle = "Debris Production";

    shortTitle = "Debris";

    state = {
        collapsed: false,
        title: this.fullTitle,
        pathname: "/"
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            title: this.state.collapsed ? this.fullTitle : this.shortTitle,
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps, nextContext);
    }

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider
                        width={256}
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}>

                        <div className="logo"><h1>{this.state.title}</h1></div>

                        <Menu theme="dark" mode="inline"
                            defaultSelectedKeys={[createBrowserHistory().location.pathname]}
                        >
                            <Menu.Item key="/admin/">
                                <Link to="/admin/">
                                    <Icon type="dashboard" />
                                    <span>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/streams">
                                <Link to="/admin/streams">
                                    <Icon type="video-camera" />
                                    <span>Streams</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/profile">
                                <Link to="/admin/profile">
                                    <Icon type="profile" />
                                    <span>Profile</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/key">
                                <Link to="/admin/key">
                                    <Icon type="key" />
                                    <span>Keygen</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Header>
                        <Content style={{
                            margin: '24px 16px', minHeight: 280,
                        }}>
                            <Route exact path="/admin" component={Dashboard} />
                            <Route path="/admin/streams" component={Streams} />
                            <Route path="/admin/profile" component={Profile} />
                            <Route path="/admin/key" component={Key} />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Debris Production Inc. ⓒ 2021-2022 Created by <a href="https://debrisprod.com/" rel="noopener noreferrer" target="_blank">Debris Production</a>.
                        </Footer>
                    </Layout>
                </Layout>


            </Router>
        );
    }

}

export default App;
