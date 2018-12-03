import React, { Component } from 'react';

import {
	App,
	Drop,
	Flex,
	Masthead,
	MastheadAlignRight,
	Button,
	MastheadContent,
	ButtonWithDrop,
	MenuItemWithDrop,
	MastheadTabButtons,
	MenuItem,
	FontoLogo,
	MastheadToolbar,
	MastheadToolbarButtons,
	MastheadToolbars,
	Menu
} from 'fds/components';

class Header extends Component {
	state = { activeTab: 'start' };

	handleClick = () =>
		console.log('button clicked, generally you would setState to switch tabs or run an action');

	renderSimpleDrop = () => (
		<Drop>
			<Menu>
				<MenuItem label="Menu item" onClick={this.handleClick} />

				<MenuItem label="Menu item" onClick={this.handleClick} />
			</Menu>
		</Drop>
	);

	handleRenderComplexDrop = () => (
		<Drop>
			<Menu>
				<MenuItem label="Menu item" onClick={this.handleClick} />

				<MenuItemWithDrop
					icon="car"
					label="Menu item w/ drop"
					renderDrop={this.renderSimpleDrop}
				/>

				<MenuItemWithDrop
					keyBindingLabel=""
					label="Clickable menu item w/ drop"
					onClick={this.handleClick}
					renderDrop={this.renderSimpleDrop}
				/>

				<MenuItemWithDrop
					isSelected
					keyBindingLabel="⌘ + F"
					label="4 Clickable menu item w/ drop"
					onClick={this.handleClick}
					renderDrop={this.renderSimpleDrop}
				/>
			</Menu>
		</Drop>
	);

	render() {
		const { activeTab } = this.state;

		return (
			<App>
				<Masthead>
					<MastheadContent>
						<FontoLogo />

						<Button icon="undo" onClick={this.handleClick} />

						<Button icon="repeat" onClick={this.handleClick} />

						<MastheadTabButtons>
							<Button
								isSelected={activeTab === 'start'}
								label="Start"
								onClick={() => this.setState({ activeTab: 'start' })}
							/>

							<Button
								isSelected={activeTab === 'structure'}
								label="Structure"
								onClick={() => this.setState({ activeTab: 'structure' })}
							/>

							<Button
								isSelected={activeTab === 'tools'}
								label="Tools"
								onClick={() => this.setState({ activeTab: 'tools' })}
							/>
						</MastheadTabButtons>
					</MastheadContent>

					<MastheadToolbars>
						<MastheadToolbar>
							<MastheadToolbarButtons>
								<Button label="Toolbar button" onClick={this.handleClick} />

								<ButtonWithDrop
									label="Drop button"
									renderDrop={this.handleRenderComplexDrop}
								/>

								<ButtonWithDrop
									label="Split drop button"
									onClick={this.handleClick}
									renderDrop={this.renderSimpleDrop}
								/>
							</MastheadToolbarButtons>
						</MastheadToolbar>

						<MastheadAlignRight>
							<Button label="Right aligned button" />
						</MastheadAlignRight>
					</MastheadToolbars>
				</Masthead>
				<Flex flex="1" flexDirection="column">Page body content</Flex>
			</App>
		);
	}
}

export default Header;
