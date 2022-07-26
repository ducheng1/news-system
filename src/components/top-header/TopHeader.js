import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
// antd组件
import {Avatar, Button, Dropdown, Layout, Menu, message, Space} from "antd";
// antd图标
import {DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from "@ant-design/icons";
// css
import style from "./TopHeader.module.scss";

const {Header} = Layout;

function TopHeader(props) {
    const changeCollapsed = () => {
        // console.log(props);
        props.changeCollapsed();
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
                        window.location.reload();
                    }}>退出</Button>
                ),
            },
        ]}/>
    )
    return (
        <Header style={{background: "#ffffff", padding: "0 30px",}} className={style.container}
                data-collapsed={props.isCollapsed}>
            <div className={style.leftContainer}>
                {
                    props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> :
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

const mapStateToProps = ({CollapsedReducer: {isCollapsed}}) => ({
    isCollapsed
})

const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader));