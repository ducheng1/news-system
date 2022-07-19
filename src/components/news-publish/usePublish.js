import {useEffect, useState} from "react";
import axios from "axios";
import {notification} from "antd";

function usePublish(type) {
    const {username} = JSON.parse(localStorage.getItem("token"));
    const [dataSource, setDataSource] = useState(null);

    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username, type]);

    const publishHandler = (id) => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            notification.success({
                message: "成功",
                description: "您可以到【发布管理/已发布】中查看"
            })
        })
    }

    const sunsetHandler = (id) => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(res => {
            notification.success({
                message: "成功",
                description: "您可以到【发布管理/已下线】中查看"
            })
        })
    }

    const deleteHandler = (id) => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: "通知",
                description: "新闻已被删除"
            })
        })
    }

    return {
        dataSource,
        publishHandler,
        sunsetHandler,
        deleteHandler
    }
}

export default usePublish;