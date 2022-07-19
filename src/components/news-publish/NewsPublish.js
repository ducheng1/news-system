import React from 'react';
import {Button, Table} from "antd";

function NewsPublish(props) {
    const dataSource = props.dataSource;

    const columns = [
        {
            title: "新闻标题",
            dataIndex: "title",
            key: "title",
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: "作者",
            dataIndex: "author",
            key: "author"
        },
        {
            title: "新闻分类",
            dataIndex: "category",
            key: "category",
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: "操作",
            key: "operation",
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>
            }
        }
    ]

    const acceptHandler = () => {

    }

    const rejectHandler = () => {

    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize: 5}}/>
        </div>
    );
}

export default NewsPublish;