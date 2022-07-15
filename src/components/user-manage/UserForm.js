import React, {forwardRef, useEffect, useState} from 'react';
import {Form, Select} from "antd";
import Input from "antd/es/input/Input";

const UserForm = forwardRef((props, ref) => {
            // 设置菜单项是否禁用
            const [isDisabled, setIsDisabled] = useState(false);
            const [isUpdate, setIsUpdate] = useState(false);

            const {roleId, region} = JSON.parse(localStorage.getItem("token"));
            const roleObj = {
                "1": "superadmin",
                "2": "admin",
                "3": "editor"
            };

            // console.log(props);
            // 接受子组件参数--是否是更新表单
            useEffect(() => {
                setIsDisabled(props.isUpdateDisabled);
                setIsUpdate(props.isUpdate);
            }, [props.isUpdateDisabled, props.isUpdate]);

            const checkRegionDisabled = (item) => {
                if (props.isUpdate) {
                    if (roleObj[roleId] === "superadmin") {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (roleObj[roleId] === "superadmin") {
                        return false;
                    } else {
                        return item.value !== region;
                    }
                }
            }

            const checkRoleDisabled = (item) => {
                if (props.isUpdate) {
                    if (roleObj[roleId] === "superadmin") {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (roleObj[roleId] === "superadmin") {
                        return false;
                    } else {
                        return roleObj[item.id] !== "editor";
                    }
                }
            }

            return (
                <Form layout={"vertical"} ref={ref}>
                    <Form.Item name={"username"} label={"用户名"} rules={[{
                        required: true,
                        message: "用户名不能为空"
                    }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"password"} label={"密码"} rules={[{
                        required: true,
                        message: "密码不能为空",
                    }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"region"} label={"区域"} rules={isDisabled ? [] : [{
                        required: true
                    }]}>
                        <Select disabled={isDisabled}>
                            {
                                props.regionList.map(item => <Select.Option value={item.value}
                                                                            disabled={checkRegionDisabled(item)}
                                                                            key={item.id}>{item.region}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name={"roleId"} label={"角色"} rules={[{
                        required: true
                    }]}>
                        <Select onChange={(value) => {
                            if (value === 1) {
                                setIsDisabled(true);
                                ref.current.setFieldsValue({
                                    region: ""
                                })
                            } else {
                                setIsDisabled(false);
                            }
                        }}>
                            {
                                props.roleList.map(item => <Select.Option value={item.id} disabled={checkRoleDisabled(item)}
                                                                          key={item.id}>{item.roleName}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            );
        }
    )
;

export default UserForm;