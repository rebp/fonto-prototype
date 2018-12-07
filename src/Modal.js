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
	UnorderedList,
	UnorderedListItem
} from 'fds/components';

import { 
	applyCss, 
	marginBottom 
} from 'fds/system';

const styles = applyCss({
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	top: 0,
	zIndex: 2
});



class OfflineModal extends Component {


	handleButtonClick = () => this.props.togglemodal();

	render() {

		return (
			<Block applyCss={{ transform: 'translate3D(0, 0, 0)' }} flex="1" {...styles}>
				<Modal size="s" isFullHeight>
					<ModalHeader title="Offline infromation" />

					<ModalBody>
						<ModalContent flexDirection="column" paddingSize="l">
							<Text marginBottom="m" >The following features won't work while being offline</Text>
							<UnorderedList>
								<UnorderedListItem>
									<Label isBold={true}>Spell Checker</Label>
								</UnorderedListItem>
							</UnorderedList>

						</ModalContent>
					</ModalBody>

					<ModalFooter>
						<Button label="Close" onClick={this.handleButtonClick} type="primary" />
					</ModalFooter>
				</Modal>
			</Block>
		);
	}
}

export default OfflineModal;
