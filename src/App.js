import {Route, Switch} from "react-router-dom";

import Register from "./components/Register";

const App = () => {

    return (
        <div className="App">
            <Switch>
                <Route exact path='/register' component={Register}/>
            </Switch>
        </div>
    );

};

export default App;
