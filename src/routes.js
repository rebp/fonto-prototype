import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Editor from './Editor';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route path="/offline-online-toggler" exact component={Editor} />
                <Route path="/" exact component={Editor} />
            </Switch>
        )
    }
}

export default Routes;