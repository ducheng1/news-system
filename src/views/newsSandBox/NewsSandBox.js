import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../components/newsSandBox/home/Home";
import UserList from "../../components/newsSandBox/user-manage/userList/UserList";
import RoleList from "../../components/newsSandBox/right-manage/roleList/RoleList";
import RightList from "../../components/newsSandBox/right-manage/rightList/RightList";
import NoPermission from "../../components/newsSandBox/no-permission/NoPermission";
import SideMenu from "../../components/newsSandBox/side-menu/SideMenu";
import TopHeader from "../../components/newsSandBox/top-header/TopHeader";

import "./NewsSandBox.scss"

import {Layout, Menu} from "antd";
const {Content} = Layout;

export default function NewsSandBox() {
    return (
        <div>
            <Layout className="container">
                <SideMenu/>
                <Layout className="site-layout">
                    <TopHeader/>
                    <Content>
                        <Switch>
                            <Route path="/home" component={Home}/>
                            <Route path="/user-manage/list" component={UserList}/>
                            <Route path="/right-manage/role/list" component={RoleList}/>
                            <Route path="/right-manage/right/list" component={RightList}/>
                            <Redirect exact from="/" to="/home"/>
                            <Route path="*" component={NoPermission}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}