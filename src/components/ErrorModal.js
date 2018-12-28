import React, { Component } from 'react';

import {
	Block,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Text,
	Label,
	Flex,
	GridItem,
	VirtualGrid,
	ContainedImage
} from 'fds/components';

import {
	applyCss
} from 'fds/system';

const styles = applyCss({
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	top: 0,
	zIndex: 10000
});

class ErrorModal extends Component {


	handleModalClose = () => {
		this.props.toggleErrorModal()
	}

	render() {

		return (
			<Block flex="1" {...styles}>
				<Modal size="s" connotation='warning'>
					<ModalHeader title="Something went wrong" />

					<ModalBody>
						<ModalContent flexDirection="column" paddingSize="l">
							<Block>
								<Text>The selected image is a corrupted file. Please select another image...</Text>
							</Block>
						</ModalContent>
					</ModalBody>

					<ModalFooter>
						<Button label="Ok" onClick={() => this.handleModalClose()} type="warning" />
					</ModalFooter>
				</Modal>
			</Block>
		);
	}
}

export default ErrorModal;
