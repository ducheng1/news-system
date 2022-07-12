import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../components/newsSandBox/home/Home";
import UserList from "../../components/newsSandBox/user-manage/userList/UserList";
import RoleList from "../../components/newsSandBox/right-manage/roleList/RoleList";
import RightList from "../../components/newsSandBox/right-manage/rightList/RightList";
import NoPermission from "../../components/newsSandBox/no-permission/NoPermission";

export default function NewsSandBox() {
    return (
        <div>
            newssandbox
            <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/user-manage/list" component={UserList}/>
                <Route path="/right-manage/role/list" component={RoleList}/>
                <Route path="/right-manage/right/list" component={RightList}/>
                <Redirect exact from="/" to="/home"/>
                <Route path="*" component={NoPermission}/>
            </Switch>
        </div>
    )
}