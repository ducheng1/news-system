import React from "react";

import "./SideMenu.scss";

import {Layout} from "antd";
const {Sider} = Layout;

export default function SideMenu(){
    return(
        <div>
            <Sider trigger={null} collapsible>
                sidemenu
            </Sider>
        </div>
    )
}