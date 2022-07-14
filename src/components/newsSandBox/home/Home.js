import React from "react";
import {Button} from "antd";
import axios from "axios";

export default function Home() {
    const ajax = () => {
        axios.get("http://localhost:5050/users").then(res => {
            console.log(res.data)
        })
    }

    return (
        <div>
            home
            <Button type="primary" onClick={ajax}>111</Button>
        </div>
    )
}