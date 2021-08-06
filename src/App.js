import {Route, Switch} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Activate from "./components/Activate";
import Register from "./components/Register";
import ChangeProfile from "./components/ChangeProfile";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordRequest from "./components/ResetPasswordRequest";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route path='/verify' component={Activate}/>
                <Route path='/password-reset' component={ResetPassword}/>
                <Route exact path='/request-password-reset' component={ResetPasswordRequest}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/profile/change' component={ChangeProfile}/>
                <Route path='/' component={Home}/>
            </Switch>
        </div>
    );

};

export default App;
