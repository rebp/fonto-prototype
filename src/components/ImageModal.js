import React, { Component } from 'react';

import {
	Block,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
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


const imagesLisItems = [
	{
		id: 0,
		label: "Christmas",
		url: "/images/x-mas.jpg",
		errorTest: false
	},
	{
		id: 1,
		label: "Dinner",
		url: "/images/dinner.jpg",
		errorTest: false
	},
	{
		id: 2,
		label: "Fireworks",
		url: "/images/fireworks.jpg",
		errorTest: true
	},
	{
		id: 3,
		label: "Snow",
		url: "/images/snow.jpg",
		errorTest: false
	},
]

class ImageModal extends Component {

	state = { 
		selectedItemId: null, 
		url: null,
		errorTest: null
	}

	handleItemClick = item => this.setState({ 
		selectedItemId: item.id, 
		url: item.url,
		errorTest: item.errorTest
	});

	handleModalClose = () => {
		this.props.toggleImageModal()
	}

	handleModalInsert = () => {
		if (this.state.errorTest) {
			this.props.toggleImageModal()
			this.props.toggleErrorModal()
		} else {
			this.props.addImage(this.state.url)
			this.props.toggleImageModal()
		}
	}

	renderItem = ({ item, onClick }) => (
		<GridItem
			key={item.id}
			isSelected={item.id === this.state.selectedItemId}
			onClick={onClick}
			size="l"
		>
			<Flex alignItems="center" flexDirection="column">
				<Block>
					<ContainedImage src={item.url} />
				</Block>
				<Label>{item.label}</Label>
			</Flex>
		</GridItem>	
	);

	render() {

		return (
			<Block flex="1" {...styles}>
				<Modal size="s" isFullHeight>
					<ModalHeader title="Insert image" />

					<ModalBody>
						<ModalContent flexDirection="column" paddingSize="l">
							<Block isScrollContainer={true}>
								<VirtualGrid
									estimatedRowHeight={68}
									items={imagesLisItems}
									onItemClick={this.handleItemClick}
									renderItem={this.renderItem}
									spaceSize="s"
								/>
							</Block>
						</ModalContent>
					</ModalBody>

					<ModalFooter>
						<Button label="Close" onClick={() => this.handleModalClose() } type="primary" />
						<Button label="Insert" onClick={() => this.handleModalInsert() } type="primary" />
					</ModalFooter>
				</Modal>
			</Block>
		);
	}
}

export default ImageModal;
