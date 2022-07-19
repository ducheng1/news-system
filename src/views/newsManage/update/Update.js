import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, Input, message, notification, PageHeader, Select, Steps} from "antd";

import style from "./Update.module.scss";
import axios from "axios";
import NewsEditor from "../../../components/news-editor/NewsEditor";

function Update(props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [options, setOptions] = useState(null);
    const [formInfo, setFormInfo] = useState(null);
    const [content, setContent] = useState("");
    const firstStep = useRef(null);

    useEffect(() => {
        let categoryObj = {};
        axios.get("categories").then(res => {
            // console.log(res.data);
            categoryObj = res.data;
        })
        // console.log(categoryObj);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            // setNewsInfo(res.data);
            let {title, categoryId, content} = res.data;
            firstStep.current.setFieldsValue({
                title,
                categoryId: categoryObj[categoryId - 1],
            });
            setContent(content);
        });
    }, [props.match.params.id]);

    const nextHandler = () => {
        if (currentStep === 0) {
            firstStep.current.validateFields().then(res => {
                // console.log(res);
                console.log(res.categoryId);
                let categoryId = res.categoryId;
                if (typeof categoryId === "string") {
                    axios.get(`/categories?title=${categoryId}`).then(e => {
                        categoryId = e.data[0].id;
                        // console.log(e.data[0].id);
                        // console.log(categoryId);
                        // console.log(typeof res.id)
                    });
                } else {
                    categoryId = res.categoryId.id;
                }
                // console.log(categoryId);
                setFormInfo({title: res.title, categoryId: categoryId});
                setCurrentStep(currentStep + 1);
                // console.log(formInfo);
            }).catch(err => {
                console.log(err);
            });
        } else if (currentStep === 1) {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空");
                return;
            }
            setContent(content)
            // console.log(content);
            setCurrentStep(currentStep + 1);
        }
    }

    const prevHandler = () => {
        setCurrentStep(currentStep - 1);
    }

    const layout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20}
    }

    useEffect(() => {
        axios.get("categories").then(res => {
            // console.log(res.data);
            setOptions(res.data);
        })
    }, []);

    // 事件处理--保存草稿
    const saveHandler = () => {
        // console.log("存到草稿");
        console.log(formInfo, content);
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": 0,
        }).then(res => {
            notification.info({
                message: "通知",
                description: "内容已存到草稿，正在跳转"
            })
            props.history.push("/news-manage/draft");
        })
    }

    // 事件处理--提交审核
    const auditHandler = () => {
        // console.log("提交审核");
        // console.log(formInfo, content);
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": 1,
        }).then(res => {
            notification.info({
                message: "通知",
                description: "内容已提交审核，正在跳转"
            })
            props.history.push("/audit-manage/list");
        })
    }

    return (
        <div>
            <PageHeader title={"更新新闻"} subTitle="新闻更新" onBack={() => props.history.goBack()}/>
            <Steps current={currentStep} style={{padding: "0 24px", marginTop: "1rem"}}>
                <Steps.Step title={"基本信息"} description={"新闻标题，新闻分类"}/>
                <Steps.Step title={"新闻内容"} description={"新闻主体内容"}/>
                <Steps.Step title={"新闻提交"} description={"保存草稿或者提交审核"}/>
            </Steps>
            <div className={style.formGroup}>
                <div className={currentStep === 0 ? style.firstStep : style.hidden}>
                    <Form layout={layout} ref={firstStep}>
                        <Form.Item label={"新闻标题"} name={"title"} rules={[{
                            required: true,
                            message: "新闻标题不能为空"
                        }]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={"新闻分类"} name={"categoryId"} rules={[{
                            required: true,
                            message: "请选择新闻分类"
                        }]}>
                            <Select options={options}/>
                        </Form.Item>
                    </Form>
                </div>
                <div className={currentStep === 1 ? style.secondStep : style.hidden}>
                    <NewsEditor getContent={(content) => setContent(content)} content={content}/>
                </div>
                <div className={currentStep === 2 ? style.thirdStep : style.hidden}>

                </div>
            </div>
            {/*按钮组*/}
            <div className={style.btnGroup}>
                {
                    currentStep < 2 &&
                    <Button type={"primary"} onClick={nextHandler} style={{marginRight: "0.5rem"}}>下一步</Button>
                }
                {
                    currentStep === 2 && <span>
                        <Button type={"primary"} style={{marginRight: "0.5rem"}} onClick={saveHandler}>保存草稿</Button>
                        <Button danger type={"primary"} style={{marginRight: "0.5rem"}}
                                onClick={auditHandler}>提交审核</Button>
                    </span>
                }
                {
                    currentStep > 0 && <Button onClick={prevHandler}>上一步</Button>
                }
            </div>
        </div>
    );
}

export default Update;