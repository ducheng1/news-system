import React, {useEffect} from "react";
import SideMenu from "../../components/side-menu/SideMenu";
import TopHeader from "../../components/top-header/TopHeader";
import NProgress from "nprogress";

import "./NewsSandBox.scss";
import "nprogress/nprogress.css";

import {Layout} from "antd";
import NewsRouter from "../../components/news-router/NewsRouter";

const {Content} = Layout;

export default function NewsSandBox() {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    })
    return (
        <div>
            <Layout className="container">
                <SideMenu/>
                <Layout>
                    <TopHeader/>
                    <Content className="mainContent">
                        <NewsRouter/>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}