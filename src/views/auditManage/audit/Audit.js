import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, notification, Table, Tag} from "antd";

function Audit(props) {
    const [dataSource, setDataSource] = useState(null);
    const {roleId, region, username} = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        let categoryObj = {};
        axios.get("categories").then(res => {
            // console.log(res.data);
            categoryObj = res.data;
        })
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            // console.log(res.data);
            const list = res.data;
            list.forEach(item => {
                // console.log(categoryObj[item.categoryId]);
                item.categoryId = categoryObj[item.categoryId - 1].title;
            });
            setDataSource(roleObj[roleId] === "superadmin" ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ]);
        });
    }, [roleId, username, region]);

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
            title: "操作",
            render: (item) => {
                return <div>
                    <Button type={"primary"} style={{marginRight: "10px"}}
                            onClick={() => acceptHandler(item)}>通过</Button>
                    <Button type={"primary"} danger onClick={() => rejectHandler(item)}>拒绝</Button>
                </div>
            }
        },
    ]

    const acceptHandler = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.patch(`/news/${item.id}`, {
            auditState: 2,
            publishState: 1,
        }).then(res => {
            notification.success({
                message: "通过",
                description: "审核已通过"
            })
        })
    }

    const rejectHandler = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.patch(`/news/${item.id}`, {
            auditState: 3,
            publishState: 0,
        }).then(res => {
            notification.error({
                message: "拒绝",
                description: "审核已拒绝"
            })
        })
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}
                   rowKey={(item) => item.id}/>
        </div>
    );
}

export default Audit;