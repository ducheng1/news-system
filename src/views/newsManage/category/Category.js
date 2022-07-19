import React, {useEffect, useRef, useState} from "react";
import {Button, Input, Modal, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, ExclamationCircleOutlined, EditOutlined} from "@ant-design/icons";

const {confirm} = Modal;

function Category(props) {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [defaultObj, setDefaultObj] = useState(null);
    const [defaultValue, setDefaultValue] = useState(null);
    const value = useRef();

    useEffect(() => {
        axios.get(`/categories`).then(res => {
            setDataSource(res.data);
        });
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
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/categories/${item.id}`);
        // window.location.reload();
    }

    const editHandler = (item) => {
        setIsModalVisible(true);
        setDefaultObj(item)
        setDefaultValue(item.title);
    }

    const okHandler = (item) => {
        // console.log(value.current.input.value);
        console.log(defaultObj)
        const title = value.current.input.value;
        setDataSource(dataSource.map(item => {
            if (item.id === defaultObj.id) {
                return {
                    id: item.id,
                    title: title,
                    value: title
                }
            }
            return item;
        }));
        axios.patch(`/categories/${defaultObj.id}`, {
            title: title,
            value: title,
        }).then();
        setIsModalVisible(false);
    }

    const cancelHandler = () => {
        setIsModalVisible(false);
        setDefaultValue(null);
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
            title: "栏目名称",
            dataIndex: "title",
        },
        {
            title: "操作",
            key: "operation",
            render: (item) => {
                return <div>
                    <Button shape={"circle"} danger icon={<DeleteOutlined/>}
                            onClick={() => confirmHandler(item)} style={{marginRight: "10px"}}/>
                    <Button shape={"circle"} icon={<EditOutlined/>} onClick={() => editHandler(item)} ghost
                            type={"primary"}/>
                </div>
            }
        }
    ]

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize: 5}}/>
            <Modal title="编辑栏目" visible={isModalVisible} onOk={() => okHandler(defaultValue)}
                   onCancel={() => cancelHandler()}>
                <Input defaultValue={defaultValue} ref={value}/>
            </Modal>
        </div>
    )
}

export default Category;