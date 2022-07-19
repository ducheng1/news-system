import React, {useEffect, useRef, useState} from "react";
import {Avatar, Card, Col, Drawer, List, Row} from "antd";
import {PieChartOutlined, EditOutlined, EllipsisOutlined} from "@ant-design/icons"
import Meta from "antd/es/card/Meta";
import axios from "axios";
import * as ECharts from "echarts";
import _ from "lodash";

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pieInit, setPieInit] = useState(null);
    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem("token"));
    const barRef = useRef();
    const pieRef = useRef();

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(res.data);
            // console.log(_.groupBy(res.data, item => item.category.title));
            renderBar(_.groupBy(res.data, item => item.category.title))
        });

        return () => {
            window.onresize = null;
        }
    }, []);

    const renderBar = (data) => {
        let myChart = ECharts.init(barRef.current);
        let option = {
            title: {
                text: "新闻分类图示"
            },
            legend: {
                data: ["数量"]
            },
            xAxis: {
                data: Object.keys(data),
                axisLabel: {
                    rotate: "45",
                },
            },
            yAxis: {
                minInterval: 1,
            },
            series: {
                name: "数量",
                type: "bar",
                data: Object.values(data).map(item => item.length),
            }
        };
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize();
        }
    }

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&author=${username}`).then(res => {
            // console.log(res.data);
            // console.log(_.groupBy(res.data, item => item.category.title));
            renderPie(_.groupBy(res.data, item => item.category.title))
        });

        return () => {
            window.onresize = null;
        }
    }, []);

    const renderPie = (data) => {
        let myChart;
        if (!pieInit) {
            myChart = ECharts.init(pieRef.current);
            setPieInit(myChart);
        } else {
            myChart = pieInit;
        }

        let list = [];
        for (let i in data) {
            list.push({
                name: i,
                value: data[i].length
            })
        }
        // console.log(list)
        let option = {
            legend: {
                orient: 'vertical',
                right: 10,
                top: "center"
            },
            title: {
                text: username,
                subtext: "个人数据",
            },
            series: [
                {
                    type: 'pie',
                    data: list
                }
            ]
        };
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize();
        }
    }

    useEffect(() => {
        axios.get(`news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            setViewList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            setStarList(res.data);
        })
    }, []);

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List size="small" dataSource={viewList}
                              renderItem={item => <List.Item><a
                                  href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}>
                        </List>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List size="small" dataSource={starList}
                              renderItem={item => <List.Item><a
                                  href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}>
                        </List>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="piechart" onClick={() => {
                                setVisible(true)
                            }}/>,
                            <EditOutlined key="edit"/>,
                            <EllipsisOutlined key="ellipsis"/>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{marginLeft: "1rem"}}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer title="个人新闻数据" visible={visible} onClose={() => {
                setVisible(false);
                setTimeout(() => {
                    renderPie()
                }, 1000);
            }}>
                <div ref={pieRef} style={{width: "100%", height: "200px"}}/>
            </Drawer>
            <div ref={barRef} style={{width: "100%", height: "600px", marginTop: "4rem"}}/>
        </div>
    );
}