import React, { Component } from 'react';

import {
	Block,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Text
} from 'fds/components';



class OfflineModal extends Component {


	handleButtonClick = () => console.log('Button clicked.');

	render() {
		return (
			<Block applyCss={{ transform: 'translate3D(0, 0, 0)' }} flex="1">
				<Modal size="m" isFullHeight>
					<ModalHeader title="Test modal" />

					<ModalBody>
						<ModalContent flexDirection="column" paddingSize="l">
							<Text>
								Donec sollicitudin molestie malesuada. Sed porttitor lectus nibh. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Proin eget tortor risus. Nulla porttitor accumsan tincidunt. Proin eget tortor risus. Vivamus suscipit tortor eget felis porttitor volutpat.
							</Text>

						</ModalContent>
					</ModalBody>

					<ModalFooter>
						<Button label="Cancel" onClick={this.handleButtonClick} />
						<Button label="Ok" onClick={this.handleButtonClick} type="primary" />
					</ModalFooter>
				</Modal>
			</Block>
		);
	}
}

export default OfflineModal;
