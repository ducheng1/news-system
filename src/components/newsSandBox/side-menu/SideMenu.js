import React from "react";

import {Layout, Menu} from "antd";
import style from "../side-menu/SideMenu.module.scss";
import {FormOutlined, HomeOutlined, UserOutlined} from "@ant-design/icons";

const {Sider} = Layout;

export default function SideMenu() {
    let collapsed = false;

    function getItem(label, key, icon, children, type) {
        return {
            key, icon, children, label, type,
        };
    }

    const items = [
        getItem("首页", "index", <HomeOutlined/>),
        getItem("用户管理", "user-manage", <UserOutlined/>, [
            getItem("用户列表", "user-list")
        ]),
        getItem("权限管理", "right-manage", <FormOutlined/>, [
            getItem("角色列表", "role-list"),
            getItem("权限列表", "right-list")
        ]),
    ]

    return (
        <Sider className={style.container} width={"15rem"} collapsible collapsed={collapsed} theme="dark"
               trigger={null}>
            <div className={style.title}>全球新闻发布管理系统</div>
            <Menu theme="dark" defaultSelectedKeys={['index']} defaultOpenKeys={['user-manage', 'right-manage']}
                  items={items}/>
        </Sider>
    )
}