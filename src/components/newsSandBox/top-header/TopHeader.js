import React, {useState} from "react";
// antd组件
import {
    Avatar,
    Button,
    Dropdown,
    Layout,
    Menu,
    Space
} from "antd";
// antd图标
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    UserOutlined
} from "@ant-design/icons";
// css
import style from "./TopHeader.module.scss";

const {Header} = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed);
    }
    const menu = (
        <Menu items={[
            {
                key: '',
                label: (
                    <Button target="_blank" type="link" block size="small">111</Button>
                ),
            },
            {
                key: 'logout',
                label: (
                    <Button target="_blank" type="link" block danger size="small">退出</Button>
                ),
            },
        ]}/>
    )
    return (
        <Header style={{background: "#ffffff", padding: "0 30px",}} className={style.container}>
            <div className={style.leftContainer}>
                {
                    collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> :
                        <MenuFoldOutlined onClick={changeCollapsed}/>
                }
                <span>首页</span>
            </div>
            <div className={style.rightContainer}>
                <Avatar className={style.avatar} icon={<UserOutlined/>}/>
                <Dropdown overlay={menu}>
                    <Space>欢迎admin回来<DownOutlined/></Space>
                </Dropdown>
            </div>
        </Header>
    )
}