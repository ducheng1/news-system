import React from 'react';
import NewsPublish from "../../../components/news-publish/NewsPublish";
import usePublish from "../../../components/news-publish/usePublish";
import {Button} from "antd";

function Unpublished(props) {
    const {dataSource, publishHandler} = usePublish(1);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={
                (id) => <Button type={"primary"} onClick={() => publishHandler(id)}>发布</Button>
            }/>
        </div>
    );
}

export default Unpublished;