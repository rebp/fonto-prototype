import React, { Component } from 'react';

import {
	Button,
	Popover,
	PopoverAnchor,
	PopoverBody,
	PopoverFooter,
	PopoverHeader,
	Text,
	Statusbar,
	StatusbarAlignRight,
	UnorderedList,
	UnorderedListItem,
	Label
} from 'fds/components';

class BottomStatusbar extends Component {

	renderAnchor = ({ onRef, togglePopover }) => (
		<Button
			onClick={togglePopover}
			onRef={onRef}
			label={this.props.status === "offline" ? "Offline" : "Online"}
			icon={this.props.status === "offline" ? "exclamation" : null}
			type={this.props.status === "offline" ? "warning" : "primary"}
			isDisabled={this.props.status === "online" ? true : false}
		/>
	);

	renderPopover = ({ togglePopover }) => (
		<Popover>
			{/* <PopoverHeader title="WARNING" /> */}

			<PopoverBody>
				<Text marginBottom="m" >The following features won't work while being offline</Text>
				<UnorderedList>
					<UnorderedListItem>
						<Label isBold={true}>Spell Checker</Label>
					</UnorderedListItem>
				</UnorderedList>
			</PopoverBody>

			<PopoverFooter>
				{/* <Button type="primary" label="More info" onClick={this.props.toggleModal} /> */}
				<Button type="primary" label="Close" onClick={togglePopover} />
			</PopoverFooter>
		</Popover>
	);

	render() {
		return (
			<Statusbar>
				<StatusbarAlignRight>
					<PopoverAnchor renderAnchor={this.renderAnchor} renderPopover={this.renderPopover} />
				</StatusbarAlignRight>
			</Statusbar>
		)
	}

}

export default BottomStatusbar;
