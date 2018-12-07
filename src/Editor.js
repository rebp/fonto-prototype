import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import BottomStatusbar from './BottomStatusbar';
import Modal from './Modal';

import { Editor, EditorState, RichUtils } from 'draft-js';

import {
	App,
	Flex,
	Block,
	TextLink,
	Text
} from 'fds/components';

const styles = {
	editor: {
		height: '800px',
		width: '60%',
		margin: '0 auto',
		boxShadow: '0px 0px 10px 1px rgba(52, 73, 94, .5)'
	}
};

class EditorPrototype extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false,
			status: "online",
			editorState: EditorState.createEmpty(),
			spellCheck: false
		};
	}

	sendOnlineToast = () => {
		navigator.serviceWorker.controller.postMessage("online");
		this.setState({ status: "online" })
		toast.info("Online", {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			toastId: 1
		});
	}

	offlineToastRenderer = () => (
		<Block spaceHorizontalSize="m">
			<Text colorName="app-background" >Offline</Text>
			<TextLink
				colorName="app-background"
				label="Click here for more info"
				onClick={() => this.toggleModal()} />
		</Block>
	)

	sendOfflineToast = () => {
		navigator.serviceWorker.controller.postMessage("offline");
		this.setState({ status: "offline" })
		toast.error(this.offlineToastRenderer, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: true,
			closeOnClick: true,
			toastId: 2
		});
	}


	checkNetworkStatus = () => {

		if (navigator.onLine) {
			this.sendOnlineToast()
		} else {
			this.sendOfflineToast()
			this.setState({ spellCheck: false })
		}

		window.addEventListener('online', e => {
			this.sendOnlineToast()
		});

		window.addEventListener('offline', e => {
			this.sendOfflineToast()
			this.setState({ spellCheck: false })
		});
	}

	toggleSpellCheck = (state) => {
		this.setState({ spellCheck: !state })
	}

	toggleModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen })
	}

	onChange = (editorState) => this.setState({ editorState });

	makeBold = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"))
	}

	makeItalic = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"))
	}

	makeUnderline = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"))
	}

	headerOneBlockType = () => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, "header-one"))
	}

	headerTwoBlockType = () => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, "header-two"))
	}

	headerThreeBlockType = () => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, "header-three"))
	}

	headerFourBlockType = () => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, "header-four"))
	}

	headerFiveBlockType = () => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, "header-five"))
	}


	render() {

		const { status, editorState, spellCheck } = this.state;

		return (
			<App>
				<Header status={status}
					makeBold={this.makeBold}
					makeItalic={this.makeItalic}
					makeUnderline={this.makeUnderline}
					spellCheck={spellCheck}
					toggleSpellCheck={this.toggleSpellCheck}
					headerOneBlockType={this.headerOneBlockType}
					headerTwoeBlockType={this.headerTwoeBlockType}
					headerThreeBlockType={this.headerThreeBlockType}
					headerFourBlockType={this.headerFourBlockType}
					headerFiveBlockType={this.headerFiveBlockType}
				/>
				<Flex flex="1" flexDirection="column" paddingSize="l">
					<div style={styles.editor} onClick={this.focusEditor}>
						<Editor
							ref={this.setEditor}
							editorState={editorState}
							onChange={this.onChange}
							spellCheck={spellCheck}
						/>
					</div>
				</Flex>
				<BottomStatusbar status={status} />
				<ToastContainer />
				{this.state.isModalOpen && <Modal togglemodal={this.toggleModal} />}
			</App>
		);
	}

	componentDidMount = () => {
		this.checkNetworkStatus()
	}

}

export default EditorPrototype;
