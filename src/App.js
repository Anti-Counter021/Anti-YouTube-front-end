import {Route, Switch} from "react-router-dom";

import Home from "./components/Home";
import Video from "./components/Video";
import Login from "./components/Login";
import Search from "./components/Search";
import History from "./components/History";
import Channel from "./components/Channel";
import Activate from "./components/Activate";
import Category from "./components/Category";
import Admin from "./components/admin/Admin";
import Register from "./components/Register";
import AddVideos from "./components/AddVideos";
import GetUsername from "./components/GetUsername";
import ChangeProfile from "./components/ChangeProfile";
import Subscriptions from "./components/Subscriptions";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import CategoryAdmin from "./components/admin/CategoryAdmin";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route exact path='/admin/categories' component={CategoryAdmin}/>
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
                <Route path='/' component={Home}/>
            </Switch>
        </div>
    );

};

export default App;
