import React, {useState} from "react";
import {Layout} from "antd";

const {Header} = Layout;

export default function TopHeader() {
    const [collapsed] = useState(false);
    return (
        <div>
            <Header className="site-layout-background">
                topheader
            </Header>
        </div>
    )
}