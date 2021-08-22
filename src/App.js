import {Route, Switch} from "react-router-dom";

import Home from "./components/Home";
import Video from "./components/Video";
import Login from "./components/Login";
import Search from "./components/Search";
import Trends from "./components/Trends";
import History from "./components/History";
import Channel from "./components/Channel";
import Activate from "./components/Activate";
import Category from "./components/Category";
import Admin from "./components/admin/Admin";
import Register from "./components/Register";
import Error404 from "./components/error/404";
import AddVideos from "./components/AddVideos";
import ExportData from "./components/ExportData";
import GoogleAuth from "./components/GoogleAuth";
import GetUsername from "./components/GetUsername";
import ChangeProfile from "./components/ChangeProfile";
import Subscriptions from "./components/Subscriptions";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordRequest from "./components/ResetPasswordRequest";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route exact path="/export" component={ExportData}/>
                <Route exact path="/trends" component={Trends}/>
                <Route path='/google-auth' component={GoogleAuth}/>
                <Route exact path='/admin' component={Admin}/>
                <Route exact path='/search' component={Search}/>
                <Route exact path='/username' component={GetUsername}/>
                <Route exact path='/history' component={History}/>
                <Route exact path='/videos/add' component={AddVideos}/>
                <Route path='/channel/:channel_id' component={Channel}/>
                <Route path='/categories/:category_id' component={Category}/>
                <Route path='/videos/:video_id' component={Video}/>
                <Route path='/verify' component={Activate}/>
                <Route path='/password-reset' component={ResetPassword}/>
                <Route exact path='/request-password-reset' component={ResetPasswordRequest}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/subscriptions' component={Subscriptions}/>
                <Route exact path='/profile/change' component={ChangeProfile}/>
                <Route exact path='/' component={Home}/>
                <Route exact path='/404' component={Error404}/>
                <Route path='/' component={Error404}/>
            </Switch>
        </div>
    );

};

export default App;
