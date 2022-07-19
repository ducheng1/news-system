import React from 'react';
import NewsPublish from "../../../components/news-publish/NewsPublish";
import usePublish from "../../../components/news-publish/usePublish";
import {Button} from "antd";

function Published(props) {
    const {dataSource, sunsetHandler} = usePublish(2);

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={
                (id) => <Button type={"primary"} danger onClick={() => sunsetHandler(id)}>下线</Button>
            }/>
        </div>
    );
}

export default Published;