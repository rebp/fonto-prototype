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

import { applyCss } from 'fds/system';

const styles = {
	editor: applyCss({
		padding: '4rem',
		width: '60%',
		margin: '0 auto',
		boxShadow: '0px 0px 10px 1px rgba(52, 73, 94, .5)',
		'& .public-DraftEditor-content': {
			minHeight: '100px'
		}
	})
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

	offlineToastRenderer = ({ closeToast }) => (
		<Block spaceHorizontalSize="m">
			<Text colorName="app-background" >Offline</Text>
			<TextLink
				colorName="app-background"
				label="Click here for more info"
				onClick={() => { this.toggleModal(); closeToast(); }} />
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
			toastId: 1
		});
	}


	checkNetworkStatus = () => {

		if (!navigator.onLine) {
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

	toggleInlineStyle = (inlineStyle) => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
	}

	headerBlockType = (blockType) => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
	}

	render() {

		const { status, editorState, spellCheck } = this.state;

		return (
			<App>
				<Header status={status}
					currentInlineStyle={this.state.editorState.getCurrentInlineStyle()}
					currentBlockType={RichUtils.getCurrentBlockType(this.state.editorState)}
					toggleInlineStyle={this.toggleInlineStyle}
					spellCheck={spellCheck}
					toggleSpellCheck={this.toggleSpellCheck}
					headerBlockType={this.headerBlockType}
				/>
				<Flex flex="1" flexDirection="column" paddingSize="l">
					<div {...styles.editor}>
						<Editor
							ref={this.setEditor}
							editorState={editorState}
							onChange={this.onChange}
							spellCheck={spellCheck}
						/>
					</div>
				</Flex>
				<BottomStatusbar status={status} toggleModal={this.toggleModal} />
				<ToastContainer />
				{this.state.isModalOpen && <Modal toggleModal={this.toggleModal} />}
			</App>
		);
	}

	componentDidMount = () => {
		this.checkNetworkStatus()
	}

}

export default EditorPrototype;
