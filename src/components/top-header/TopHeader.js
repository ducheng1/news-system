import React, {useState} from "react";
import {withRouter} from "react-router-dom";
// antd组件
import {
    Avatar,
    Button,
    Dropdown,
    Layout,
    Menu,
    Space,
    message
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

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false);
    const changeCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const users = JSON.parse(localStorage.getItem("token"));

    const menu = (
        <Menu items={[
            {
                key: '',
                label: (
                    <Button type="link" block size="small">{users.role.roleName}</Button>
                ),
            },
            {
                key: 'logout',
                label: (
                    <Button type="link" block danger size="small" onClick={() => {
                        localStorage.removeItem("token");
                        // console.log(props);
                        message.success({
                            content: "退出成功"
                        });
                        setTimeout(() => {
                            props.history.replace("/login");
                        }, 2000);
                    }}>退出</Button>
                ),
            },
        ]}/>
    )
    return (
        <Header style={{background: "#ffffff", padding: "0 30px",}} className={style.container}
                data-collapsed={collapsed}>
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
                    <Space>欢迎<span style={{color: "cadetblue"}}>{users.username}</span>回来<DownOutlined/></Space>
                </Dropdown>
            </div>
        </Header>
    )
}

export default withRouter(TopHeader);