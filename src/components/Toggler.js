import React, { Component } from 'react'

import { Block } from 'fds/components';


class Toggler extends Component {

    handleButtonClick = () => console.log('Button clicked!');

    render() {
        return (

            <Block paddingSize="l">
                <button onClick={this.handleButtonClick}>Online/Offline</button>
            </Block>

        )
    }
}

export default Toggler
