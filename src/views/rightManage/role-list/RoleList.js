import React, {useEffect, useState} from "react";
import {Button, Table, Modal, Tree} from "antd";
import axios from "axios";
import {DeleteOutlined, ExclamationCircleOutlined, MenuOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [rightList, setRightList] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        axios.delete(`http://localhost:5050/roles/${item.id}`);
        // window.location.reload();
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
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName"
        },
        {
            title: "操作",
            key: "operation",
            render: (item) => {
                return <div>
                    <Button shape={"circle"} danger icon={<DeleteOutlined/>} style={{marginRight: "10px"}}
                            onClick={() => confirmHandler(item)}/>
                    <Button shape={"circle"} type={"primary"} ghost icon={<MenuOutlined/>}
                            onClick={() => {
                                setIsModalVisible(true);
                                setCurrentRights(item.rights)
                                setCurrentId(item.id)
                            }}/>
                </div>
            }
        }
    ];
    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost:5050/roles").then(res => {
            // console.log(res.data);
            let data = res.data;
            setDataSource(data);
            setIsLoading(false);
        })
    }, []);

    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost:5050/rights?_embed=children").then(res => {
            // console.log(res.data);
            let data = res.data;
            setRightList(data);
            setIsLoading(false);
        })
    }, []);

    const handleOk = () => {
        // console.log(currentRights);
        setIsModalVisible(false);
        // console.log(currentId);
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights,
                }
            }
            return item;
        }));
        axios.patch(`http://localhost:5050/roles/${currentId}`, {
            rights: currentRights
        }).then(() => {
        });
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const onCheck = (checked) => {
        // console.log(checked);
        setCurrentRights(checked.checked);
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} loading={isLoading}/>
            <Modal title={"权限分配"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree treeData={rightList} checkable checkedKeys={currentRights} loading={isLoading}
                      onCheck={onCheck} checkStrictly showLine={{showLeafIcon: false}}/>
            </Modal>
        </div>
    )
}