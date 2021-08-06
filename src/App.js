import {Route, Switch} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Activate from "./components/Activate";
import Register from "./components/Register";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route path='/verify' component={Activate}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route path='/' component={Home}/>
            </Switch>
        </div>
    );

};

export default App;
