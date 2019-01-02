import React, { Component } from 'react'

import { Block } from 'fds/components';

import axios from 'axios';

// const SERVER = "/api/editor";
const SERVER = "http://api-rebp.nl/api/editor";

class Toggler extends Component {

    handleOnlineButtonClick = async () => {
        await axios.post(SERVER, { status: "online" });
    }
    handleOfflineButtonClick = async () => {
        await axios.post(SERVER, { status: "offline" });
    }

    render() {
        return (

            <Block paddingSize="l">
                <button onClick={this.handleOnlineButtonClick}>Online</button>
                <button onClick={this.handleOfflineButtonClick}>Offline</button>
            </Block>

        )
    }
}

export default Toggler
