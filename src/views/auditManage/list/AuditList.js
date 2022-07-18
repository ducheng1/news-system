import React, {useEffect, useState} from 'react';
import {Button, notification, Table, Tag} from "antd";
import axios from "axios";

function AuditList(props) {
    const [dataSource, setDataSource] = useState([]);

    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        // 获取分类对象
        let categoryObj = {};
        axios.get("categories").then(res => {
            // console.log(res.data);
            categoryObj = res.data;
        })
        axios.get(`news?author=${username}&auditState_ne=0&publishState_lte=1`).then(res => {
            let data = res.data;
            // console.log(data);
            data.forEach(item => {
                // console.log(categoryObj[item.categoryId]);
                item.categoryId = categoryObj[item.categoryId - 1].title;
            });
            setDataSource(data);
        })
    }, [username]);

    const columns = [
        {
            title: "新闻标题",
            dataIndex: "title",
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: "作者",
            dataIndex: "author"
        },
        {
            title: "分类",
            dataIndex: "categoryId",
        },
        {
            title: "审核状态",
            dataIndex: "auditState",
            render: (auditState) => {
                const colorList = ["", "orange", "green", "red"];
                const auditList = ["未审核", "审核中", "已通过", "未通过"];
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button onClick={() => revertHandler(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 &&
                        <Button type={"primary"} danger onClick={() => publishHandler(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 &&
                        <Button type={"primary"} onClick={() => updateHandler(item)}>更新</Button>
                    }
                </div>

            }
        }
    ]

    const revertHandler = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: "通知",
                description: "审核申请已撤销，请到草稿箱查看"
            })
        });
    }

    const updateHandler = (item) => {
        props.history.push(`/news-manage/update/${item.id}`);
    }

    const publishHandler = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.patch(`/news/${item.id}`, {
            publishState: 2
        }).then(res => {
            props.history.push(`/publish-manage/published`);
            notification.info({
                message: "通知",
                description: "已发布，请到发布页面查看"
            })
        });
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}
                   rowKey={(item) => item.id}/>
        </div>
    );
}

export default AuditList;