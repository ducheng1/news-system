import React, {useEffect, useState} from 'react';
import {Button, Modal, notification, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";

const {confirm} = Modal;

function Draft(props) {
    const [dataSource, setDataSource] = useState([]);

    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        // 获取分类对象
        let categoryObj = {};
        axios.get("categories").then(res => {
            // console.log(res.data);
            categoryObj = res.data;
        })
        axios.get(`news?author=${username}&auditState=0`).then(res => {
            let data = res.data;
            // console.log(data);
            data.forEach(item => {
                // console.log(item);
                if (typeof item.categoryId === "number")
                    item.categoryId = categoryObj[item.categoryId - 1].title;
            });
            setDataSource(data);
        })
    }, []);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            render: (id) => {
                return <b>{id}</b>
            }
        },
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
                    <Button shape={"circle"} danger icon={<DeleteOutlined/>} style={{marginRight: "10px"}}
                            onClick={() => confirmHandler(item)} disabled={item.default}/>
                    <Button shape={"circle"} type={"primary"} ghost icon={<EditOutlined/>} disabled={item.default}
                            style={{marginRight: "10px"}} onClick={() => updateHandler(item)}/>
                    <Button shape={"circle"} type={"primary"} ghost icon={<UploadOutlined/>} disabled={item.default}
                            onClick={() => publishHandler(item)}/>
                </div>

            }
        }
    ]

    const deleteHandler = (item) => {
        console.log(item);
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/news/${item.id}`).then(res => {
        });
    }

    const confirmHandler = (item) => {
        confirm({
            title: "确定要删除吗？",
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deleteHandler(item);
                // console.log("ok");
            },
            onCancel() {
                // console.log("Cancel");
            }
        });
    }

    const updateHandler = (item) => {
        props.history.push(`/news-manage/update/${item.id}`);
    }

    const publishHandler = (item) => {
        axios.patch(`/news/${item.id}`, {
            auditState: 1
        }).then(res => {
            notification.success({
                message: "通知",
                description: "已提交至审核列表"
            });
            props.history.push("/audit-manage/list");
        })
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}
                   rowKey={(item) => item.id}/>
        </div>
    );
}

export default Draft;