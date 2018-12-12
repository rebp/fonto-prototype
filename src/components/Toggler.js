import React, { Component } from 'react'

import { Block } from 'fds/components';

import axios from 'axios';
const SERVER = window.location.protocol +"//"+ window.location.hostname + ":3005/editor";


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
