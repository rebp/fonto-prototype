import React, { Component } from 'react';

import {
	Drop,
	DropButton,
	Masthead,
	MastheadAlignRight,
	Button,
	MastheadContent,
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

	renderButton = ({ isDropOpened, toggleDrop }) => (
		<Button
			onClick={toggleDrop}
			label="Headings"
			icon="header"
			iconAfter={isDropOpened ? 'angle-up' : 'angle-down'}
			isSelected={isDropOpened || this.props.currentBlockType.startsWith("header-")}
		/>
	);

	renderDrop = () => (
		<Drop>
			<Menu>
				<MenuItem label="Heading 1" isSelected={this.props.currentBlockType === "header-one"} onClick={() => this.props.toggleHeaderBlockType("header-one")} />
				<MenuItem label="Heading 2" isSelected={this.props.currentBlockType === "header-two"} onClick={() => this.props.toggleHeaderBlockType("header-two")} />
				<MenuItem label="Heading 3" isSelected={this.props.currentBlockType === "header-three"} onClick={() => this.props.toggleHeaderBlockType("header-three")} />
				<MenuItem label="Heading 4" isSelected={this.props.currentBlockType === "header-four"} onClick={() => this.props.toggleHeaderBlockType("header-four")} />
				<MenuItem label="Heading 5" isSelected={this.props.currentBlockType === "header-five"} onClick={() => this.props.toggleHeaderBlockType("header-five")} />
			</Menu>
		</Drop>
	);

	render() {
		const { status, spellCheck, toggleSpellCheck, toggleInlineStyle, save, undo, redo, isDocumentSave } = this.props;

		return (
			<Masthead>
				<MastheadContent>
					<FontoLogo />

					<Button icon="undo" onClick={() => undo()} />

					<Button icon="repeat" onClick={() => redo()} />

					<Button
						icon={!isDocumentSave ? "save" : "check"}
						// isDisabled={status === "offline" ? true : false}
						onClick={() => save()}
					/>

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
							<DropButton
								label="Headings"
								icon="header"
								renderDrop={this.renderDrop}
								renderButton={this.renderButton}
							/>
						</MastheadToolbarButtons>

						<MastheadToolbarButtons>
							<Button icon="bold" isSelected={this.props.currentInlineStyle.has("BOLD")} onClick={() => toggleInlineStyle("BOLD")} />
							<Button icon="italic" isSelected={this.props.currentInlineStyle.has("ITALIC")} onClick={() => toggleInlineStyle("ITALIC")} />
							<Button icon="underline" isSelected={this.props.currentInlineStyle.has("UNDERLINE")} onClick={() => toggleInlineStyle("UNDERLINE")} />
						</MastheadToolbarButtons>

					</MastheadToolbar>
					<MastheadAlignRight>
						<Button
							label="Spell Check"
							icon="magic"
							tooltipContent={status === "offline" ? "This function won't work while being offline" : null}
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
