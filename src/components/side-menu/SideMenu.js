import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {connect} from "react-redux";

import {Layout, Menu} from "antd";
import style from "./SideMenu.module.scss";
import {
    FormOutlined,
    HomeOutlined,
    UserOutlined,
    InfoCircleOutlined,
    AuditOutlined,
    BarChartOutlined
} from "@ant-design/icons";

const {Sider} = Layout;

function SideMenu(props) {
    const [menu, setMenu] = useState([]);
    const [iconList] = useState({
        "/home": <HomeOutlined/>,
        "/user-manage": <UserOutlined/>,
        "/right-manage": <FormOutlined/>,
        "/news-manage": <InfoCircleOutlined/>,
        "/audit-manage": <AuditOutlined/>,
        "/publish-manage": <BarChartOutlined/>
    })

    const {role: {rights}} = JSON.parse(localStorage.getItem("token"));

    const checkPagePermission = (item) => {
        return item.pagepermission && rights.includes(item.key);
    }

    useEffect(() => {
        axios.get("rights?_embed=children").then(res => {
            // console.log(res.data);
            let data = res.data;
            let new_data = JSON.stringify(data);
            let _new_data = new_data.replace(/"title"/g, '"label"').replace(/"rightId"/g, '"rightid"');
            // console.log(_new_data);
            data = JSON.parse(_new_data);
            data.forEach(item => {
                item.icon = iconList[item.key];
                // 移除空children节点
                if (item.children.length === 0) {
                    delete item["children"];
                }
                // console.log(item.children);
                // 移除无pagepermission权限节点
                if (item.children !== undefined) {
                    for (let i = 0; i < item.children.length; i++) {
                        if (item.children[i].pagepermission === undefined || item.children[i].pagepermission === 0 || checkPagePermission(item.children[i]) === false) {
                            delete item.children[i]
                        }
                    }
                }
            });
            setMenu(data);
        })
        // console.log(111)
    }, []);

    return (
        <Sider className={style.container} width={"15rem"} collapsible collapsed={props.isCollapsed} theme="dark"
               trigger={null}>
            <div className={style.title}>全球新闻发布管理系统</div>
            <Menu theme="dark" defaultSelectedKeys={[props.location.pathname]}
                  defaultOpenKeys={["/" + props.location.pathname.split("/")[1]]}
                  mode="inline" items={menu} onClick={(e) => {
                props.history.push(e.key)
            }}/>
        </Sider>
    )
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}}) => ({
    isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu));