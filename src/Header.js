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

	handleClick = () => {
		//
	}

	renderDrop = () => (
		<Drop>
			<Menu>
				<MenuItem label="Heading 1" onClick={() => this.props.headerOneBlockType("header-one")} />
				<MenuItem label="Heading 2" onClick={() => this.props.headerTwoBlockType("header-two")} />
				<MenuItem label="Heading 3" onClick={() => this.props.headerThreeBlockType("header-three")} />
				<MenuItem label="Heading 4" onClick={() => this.props.headerFourBlockType("header-four")} />
				<MenuItem label="Heading 5" onClick={() => this.props.headerFiveBlockType("header-five")} />
			</Menu>
		</Drop>
	);

	render() {

		const { status, spellCheck, toggleSpellCheck, makeBold, makeItalic, makeUnderline } = this.props;

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
								icon="header"
								renderDrop={this.renderDrop}
							/>
						</MastheadToolbarButtons>

						<MastheadToolbarButtons>
							<Button icon="bold" onClick={makeBold} />
							<Button icon="italic" onClick={makeItalic} />
							<Button icon="underline" onClick={makeUnderline} />
						</MastheadToolbarButtons>
					</MastheadToolbar>
					<MastheadAlignRight>
						<Button
							label="Spell Check"
							icon="magic"
							isSelected={spellCheck}
							onClick={() => toggleSpellCheck(spellCheck)}
							isDisabled={status === "online" ? false : true}
						/>
					</MastheadAlignRight>
				</MastheadToolbars>
			</Masthead>
		)
	}
}

export default Header;