import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import axios from "axios";

import Home from "../../views/home/Home";
import UserList from "../../views/userManage/user-list/UserList";
import RoleList from "../../views/rightManage/role-list/RoleList";
import RightList from "../../views/rightManage/right-list/RightList";
import NoPermission from "../../views/no-permission/NoPermission";
import Unpublished from "../../views/publishManage/unpublished/Unpublished";
import Published from "../../views/publishManage/published/Published";
import Sunset from "../../views/publishManage/sunset/Sunset";
import Audit from "../../views/auditManage/audit/Audit";
import AuditList from "../../views/auditManage/list/AuditList";
import Add from "../../views/newsManage/add/Add";
import Draft from "../../views/newsManage/draft/Draft";
import Category from "../../views/newsManage/category/Category";
import Preview from "../../views/newsManage/preview/Preview";
import Update from "../../views/newsManage/update/Update";
import {Spin} from "antd";
import {connect} from "react-redux";

const LocalRouterMap = {
    // 首页
    "/home": Home,
    // 用户管理
    "/user-manage/list": UserList,
    // 权限管理
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    // 新闻管理
    "/news-manage/add": Add,
    "/news-manage/draft": Draft,
    "/news-manage/category": Category,
    "/news-manage/preview/:id": Preview,
    "/news-manage/update/:id": Update,
    // 审核管理
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    // 发布管理
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

function NewsRouter(props) {
    const [backRouteList, setBackRouteList] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get(`rights`),
            axios.get(`children`)
        ]).then(res => {
            // console.log(res);
            setBackRouteList([...res[0].data, ...res[1].data]);
            // console.log([...res[0].data, ...res[1].data])
        })
    }, []);

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermission || item.routepermisson);
    }

    const {role: {rights}} = JSON.parse(localStorage.getItem("token"));

    const checkUserPermission = (item) => {
        return rights.includes(item.key);
    }

    return (
        <Spin size={"large"} spinning={props.isLoading}>
            <Switch>
                {
                    backRouteList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]}
                                              exact/>;
                            }
                            return null;
                        }
                    )
                }
                <Redirect exact from="/" to="/home"/>
                {
                    backRouteList.length > 0 && <Route path="*" component={NoPermission}/>
                }
            </Switch>
        </Spin>
    );
}

const mapToStateProps = ({LoadingReducer: {isLoading}}) => ({
    isLoading
})

export default connect(mapToStateProps)(NewsRouter);