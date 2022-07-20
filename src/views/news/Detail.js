import React, {useEffect, useState} from 'react';
import {Descriptions, PageHeader, message} from "antd";
import axios from "axios";
import moment from "moment";
import {HeartTwoTone} from '@ant-design/icons';

function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null);
    const [hasStared, setHasStared] = useState(false);

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1,
            });
            // console.log(res.data);
            axios.patch(`/news/${props.match.params.id}`, {
                view: res.data.view + 1
            }).then();
        })

    }, [props.match.params.id]);

    const starHandler = () => {
        if (hasStared) {
            message.error("你已经点过赞了");
            return;
        }

        setHasStared(true);
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        });

        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        }).then();
    }

    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        className="site-page-header"
                        onBack={() => props.history.goBack()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.category.title}
                            <HeartTwoTone style={{marginLeft: "10px"}} twoToneColor="#eb2f96"
                                          onClick={() => starHandler()}/>
                        </div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">
                                {newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span
                                style={{color: "green"}}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span
                                style={{color: "green"}}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量"><span style={{color: "green"}}>0</span></Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{padding: "0 24px"}}>
                    </div>
                </div>
            }
        </div>
    );
}

export default Detail;