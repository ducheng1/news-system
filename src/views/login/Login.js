import React from "react";
import style from './Login.module.scss'
import {Button, Form, Input, message} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import axios from "axios";

export default function Login(props) {
    const onFinish = (values) => {
        // console.log(values);
        axios.get(`users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            // console.log(res.data);
            if (res.data.length === 0) {
                message.error({
                    content: "用户名或密码错误"
                })
            } else {
                localStorage.setItem("token", JSON.stringify(res.data[0]));
                message.success({
                    content: "登录成功"
                })
                setTimeout(() => {
                    props.history.push("/")
                }, 2000)
            }
        })
    }

    return (
        <div className={style.container}>
            <Form name={"login"} className={style.loginForm} onFinish={onFinish}>
                <div className={style.title}>全球新闻发布管理系统</div>
                <Form.Item name={"username"} rules={[{
                    required: true,
                    message: "请输入用户名"
                }]}>
                    <div className={style.loginFormItem}>
                        <span>用户名：</span>
                        <Input prefix={<UserOutlined/>} className={style.input}/>
                    </div>
                </Form.Item>
                <Form.Item name={"password"} rules={[{
                    required: true,
                    message: "密码不得为空"
                }]}>
                    <div className={style.loginFormItem}>
                        <span>密码：</span>
                        <Input prefix={<LockOutlined/>} className={style.input}/>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button htmlType={"submit"} type={"primary"} block style={{
                        marginTop: "1rem",
                        height: "2.2rem"
                    }}>登录</Button>
                </Form.Item>
            </Form>
        </div>
    )
}