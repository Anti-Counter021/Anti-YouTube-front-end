import {Route, Switch} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
            </Switch>
        </div>
    );

};

export default App;
