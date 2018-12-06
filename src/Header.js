import React, { Component } from 'react';

import {
	Drop,
	Masthead,
	MastheadAlignRight,
	Button,
	MastheadContent,
	ButtonWithDrop,
	MastheadTabButtons,
	MenuItem,
	FontoLogo,
	MastheadToolbar,
	MastheadToolbarButtons,
	MastheadToolbars,
	Menu
} from 'fds/components';

class Header extends Component {

	

	handleClick = () =>
		console.log('button clicked');

	renderSimpleDrop = () => (
		<Drop>
			<Menu>
				<MenuItem label="Heading 1" onClick={this.handleClick} />
				<MenuItem label="Heading 2" onClick={this.handleClick} />
				<MenuItem label="Heading 3" onClick={this.handleClick} />
				<MenuItem label="Heading 4" onClick={this.handleClick} />
				<MenuItem label="Heading 5" onClick={this.handleClick} />
				<MenuItem label="Heading 6" onClick={this.handleClick} />
			</Menu>
		</Drop>
	);

	render() {

		const { status, makeBold, makeItalic, makeUnderline } = this.props;

		return (
			<Masthead>
				<MastheadContent>
					<FontoLogo />

					<Button icon="undo" onClick={this.handleClick} />

					<Button icon="repeat" onClick={this.handleClick} />

					<MastheadTabButtons>
						<Button
							isSelected={true}
							label="Start"
						/>

					</MastheadTabButtons>
				</MastheadContent>

				<MastheadToolbars>
					<MastheadToolbar>
						<MastheadToolbarButtons>
							<ButtonWithDrop
								label="Headings"
								onClick={this.handleClick}
								icon="header"
								renderDrop={this.renderSimpleDrop}
							/>
						</MastheadToolbarButtons>

						<MastheadToolbarButtons>
							<Button icon="bold" onClick={makeBold} />
							<Button icon="italic" onClick={makeItalic} />
							<Button icon="underline" onClick={makeUnderline} />
						</MastheadToolbarButtons>
					</MastheadToolbar>
					<MastheadAlignRight>
						<Button label="Spell Checker" icon="magic" isDisabled={status === "online" ? false : true} onClick={this.handleClick} />
					</MastheadAlignRight>
				</MastheadToolbars>
			</Masthead>
		)
	}
}

export default Header;