import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, Switch, Table} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";

const {confirm} = Modal;

export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const addForm = useRef(null);
    const updateForm = useRef(null);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
    const [currentUpdate, setCurrentUpdate] = useState(null);

    const {username, roleId, region} = JSON.parse(localStorage.getItem("token"));

    const columns = [
        {
            title: "区域",
            dataIndex: "region",
            key: "region",
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: ""
                }
            ],
            onFilter: (value, item) => item.region === value,
            render: (region) => {
                return <b>{region === "" ? '全球' : region}</b>
            }
        },
        {
            title: "角色名称",
            dataIndex: "role",
            key: "roleId",
            filters: [
                ...roleList.map(item => ({
                    text: item.roleName,
                    value: item.roleName
                }))
            ],
            onFilter: (value, item) => item.role.roleName === value,
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: "username",
            key: "username"
        },
        {
            title: "密码",
            dataIndex: "password",
            key: "password",
        },
        {
            title: "用户状态",
            dataIndex: "roleState",
            render: (checked, item) => {
                return <Switch checked={checked} disabled={item.default} onChange={() => stateChangeHandler(item)}/>
            }
        },
        {
            title: "操作",
            key: "operation",
            render: (item) => {
                return <div>
                    <Button shape={"circle"} danger icon={<DeleteOutlined/>} style={{marginRight: "10px"}}
                            onClick={() => confirmHandler(item)} disabled={item.default}/>
                    <Button shape={"circle"} type={"primary"} ghost icon={<EditOutlined/>} disabled={item.default}
                            onClick={() => updateHandler(item)}/>
                </div>
            }
        }
    ];

    const stateChangeHandler = (item) => {
        // console.log(item);
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);
        axios.patch(`users/${item.id}`, {
            roleState: item.roleState,
        })
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

    const deleteHandler = (item) => {
        // console.log(item);
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`users/${item.id}`);
    }

    const updateHandler = (item) => {
        setTimeout(() => {
            if (item.roleId === 1) {
                setIsUpdateDisabled(true);
            } else {
                setIsUpdateDisabled(false);
            }
            updateForm.current.setFieldsValue(item);
            setCurrentUpdate(item);
        }, 0);
        setIsUpdateVisible(true);
    }

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get("users?_expand=role").then(res => {
            const data = res.data;
            setDataSource(roleObj[roleId] === "superadmin" ? data : [
                ...data.filter(item => item.username === username),
                ...data.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ])
        })
    }, [region, roleId, username]);

    useEffect(() => {
        axios.get("roles").then(res => {
            const data = res.data;
            setRoleList(data);
        })
    }, []);

    useEffect(() => {
        axios.get("regions").then(res => {
            const data = res.data;
            setRegionList(data);
        })
    }, []);

    const addFormOk = () => {
        // console.log(addForm);
        addForm.current.validateFields().then(e => {
            // console.log(res);
            setIsAddVisible(false);
            addForm.current.resetFields();
            axios.post(`users`, {
                ...e,
                "roleState": true,
                "default": false
            }).then(res => {
                // console.log(res.data);
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === e.roleId)[0]
                }]);
            })
        }).catch(err => {
            console.log(err);
        })
        // setIsAddVisible(false);
    }

    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {
            setIsUpdateVisible(false);
            setDataSource(dataSource.map(item => {
                if (item.id === currentUpdate.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item;
            }));
            axios.patch(`users/${currentUpdate.id}`, value).then(() => {

            });
        })
    }

    return (
        <div>
            <Button type={"primary"} onClick={() => {
                setIsAddVisible(true)
            }
            }>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}
                   rowKey={(item) => item.id}/>
            <Modal visible={isAddVisible} title={"添加用户"} okText={"确定"} cancelText={"取消"} onCancel={() => {
                setIsAddVisible(false);
            }} onOk={() => addFormOk()}>
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} isUpdate={false}/>
            </Modal>
            <Modal visible={isUpdateVisible} title={"更新用户"} okText={"更新"} cancelText={"取消"} onCancel={() => {
                setIsUpdateVisible(false);
                setIsUpdateDisabled(!isUpdateDisabled);
            }} onOk={() => updateFormOk()}>
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdate={true}
                          isUpdateDisabled={isUpdateDisabled}/>
            </Modal>
        </div>
    )
}