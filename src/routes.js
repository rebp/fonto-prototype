import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Editor from './components/Editor';
import Toggler from './components/Toggler';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route path="/offline-online-toggler" exact component={Toggler} />
                <Route path="/" exact component={Editor} />
            </Switch>
        )
    }
}

export default Routes;