import React, {useEffect, useState} from "react";
import {Button, Table, Tag, Modal, Popover, Switch} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5050/rights?_embed=children").then(res => {
            let data = res.data;
            data.forEach(item => {
                // 移除空children节点
                if (item.children.length === 0) {
                    delete item["children"];
                }
            });
            setDataSource(data);
            setLoading(false);
        })
    }, []);

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

    const deleteHandler = (item) => {
        // console.log(item);
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete(`http://localhost:5050/rights/${item.id}`).then(() => {
            });
        } else {
            // console.log(item.rightId);
            let list = dataSource.filter(data => data.id === item.rightId);
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            // console.log(list[0].children);
            setDataSource([...dataSource]);
            axios.delete(`http://localhost:5050/children/${item.id}`).then(() => {
            });
        }
        // window.location.reload();
    }

    const editHandler = (item) => {
        console.log(item);
        item.pagepermission = item.pagepermission === 1 ? 0 : 1;
        setDataSource([...dataSource]);
        if (item.grade === 1) {
            axios.patch(`http://localhost:5050/rights/${item.id}`, {
                pagepermission: item.pagepermission
            }).then(() => {
            });
        } else {
            axios.patch(`http://localhost:5050/children/${item.id}`, {
                pagepermission: item.pagepermission
            }).then(() => {
            });
        }
        window.location.reload();
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: "权限名称",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "权限路径",
            dataIndex: "key",
            key: "key",
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: "操作",
            key: "operation",
            render: (item) => {
                return <div>
                    <Button shape={"circle"} danger icon={<DeleteOutlined/>} style={{marginRight: "10px"}}
                            onClick={() => confirmHandler(item)}/>
                    <Popover content={<Switch checked={item.pagepermission} checkedChildren={"开启"}
                                              unCheckedChildren={"关闭"} onChange={() => editHandler(item)}/>}
                             title="开启页面"
                             trigger={item.pagepermission === undefined ? '' : 'click'}>
                        <Button shape={"circle"} type={"primary"} ghost icon={<EditOutlined/>}
                                disabled={item.pagepermission === undefined}/>
                    </Popover>
                </div>
            }
        }
    ]

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} loading={loading} pagination={{pageSize: 5}}/>
        </div>
    )
}