import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../home/Home";
import UserList from "../userManage/user-list/UserList";
import RoleList from "../rightManage/role-list/RoleList";
import RightList from "../rightManage/right-list/RightList";
import NoPermission from "../no-permission/NoPermission";
import SideMenu from "../../components/side-menu/SideMenu";
import TopHeader from "../../components/top-header/TopHeader";
import Unpublished from "../publishManage/unpublished/Unpublished";
import Published from "../publishManage/published/Published";
import Sunset from "../publishManage/sunset/Sunset";
import Audit from "../auditManage/audit/Audit";
import AuditList from "../auditManage/list/AuditList";
import Add from "../newsManage/add/Add";
import Draft from "../newsManage/draft/Draft";
import Category from "../newsManage/category/Category";

import "./NewsSandBox.scss"

import {Layout} from "antd";

const {Content} = Layout;

export default function NewsSandBox() {
    return (
        <div>
            <Layout className="container">
                <SideMenu/>
                <Layout>
                    <TopHeader/>
                    <Content className="mainContent">
                        <Switch>
                            {/*首页*/}
                            <Route path="/home" component={Home}/>
                            {/*用户管理*/}
                            <Route path="/user-manage/list" component={UserList}/>
                            {/*权限管理*/}
                            <Route path="/right-manage/role/list" component={RoleList}/>
                            <Route path="/right-manage/right/list" component={RightList}/>
                            {/*新闻管理*/}
                            <Route path="/news-manage/add" component={Add}/>
                            <Route path="/news-manage/draft" component={Draft}/>
                            <Route path="/news-manage/category" component={Category}/>
                            {/*审核管理*/}
                            <Route path="/audit-manage/audit" component={Audit}/>
                            <Route path="/audit-manage/list" component={AuditList}/>
                            {/*发布管理*/}
                            <Route path="/publish-manage/unpublished" component={Unpublished}/>
                            <Route path="/publish-manage/published" component={Published}/>
                            <Route path="/publish-manage/sunset" component={Sunset}/>
                            <Redirect exact from="/" to="/home"/>
                            <Route path="*" component={NoPermission}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}