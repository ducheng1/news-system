import React from 'react';
import NewsPublish from "../../../components/news-publish/NewsPublish";
import usePublish from "../../../components/news-publish/usePublish";
import {Button} from "antd";

function Sunset(props) {
    const {dataSource, deleteHandler} = usePublish(3);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={
                (id) => <Button type={"primary"} danger onClick={() => deleteHandler(id)}>删除</Button>
            }/>
        </div>
    );
}

export default Sunset;