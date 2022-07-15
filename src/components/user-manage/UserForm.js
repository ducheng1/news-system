import React, {forwardRef, useEffect, useState} from 'react';
import {Form, Select} from "antd";
import Input from "antd/es/input/Input";

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setIsDisabled] = useState(false);

    // console.log(props);

    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled);
    }, [props.isUpdateDisabled]);

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
                message: "密码长度至少为6位",
                min: 6,
                max: 20
            }]}>
                <Input/>
            </Form.Item>
            <Form.Item name={"region"} label={"区域"} rules={isDisabled ? [] : [{
                required: true
            }]}>
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item => <Select.Option value={item.value}
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
                        props.roleList.map(item => <Select.Option value={item.id}
                                                                  key={item.id}>{item.roleName}</Select.Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    );
});

export default UserForm;