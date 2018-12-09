import React, { Component } from 'react';
import { ToastContainer, toast, Slide, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import BottomStatusbar from './BottomStatusbar';
import Modal from './Modal';

import { css } from 'glamor';

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

import {
	App,
	Flex,
	Block,
	TextLink,
	Text
} from 'fds/components';

import { applyCss } from 'fds/system';
import axios from 'axios';


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

const SERVER = 'http://localhost:3005/document';

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
			className: css({
				background: '#e8f1fb',
				border: "1px solid #1976d2"
			}),
			bodyClassName: css({
				color: "#1976d2",
				margin: "5px 0px"
			}),
			hideProgressBar: true,
			closeOnClick: true,
			toastId: 1
		});
	}

	offlineToastRenderer = ({ closeToast }) => (
		<Block spaceHorizontalSize="m">
			<Text colorName="icon-s-error-color">Offline</Text>
			<TextLink
				label="Click here for more info"
				onClick={() => { this.toggleModal(); closeToast(); }} />
		</Block>
	)

	sendOfflineToast = () => {
		navigator.serviceWorker.controller.postMessage("offline");
		this.setState({ status: "offline" })
		toast.error(this.offlineToastRenderer, {
			position: "bottom-right",
			className: css({
				background: '#fbeaea',
				border: "1px solid #d32f2f"
			}),
			bodyClassName: css({
				color: "#d32f2f",
				margin: "5px 0px"
			}),
			hideProgressBar: true,
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

	saveToServerHandler = () => {
		let data = convertToRaw(this.state.editorState.getCurrentContent())
		axios.post(SERVER, data)
	}

	getFromServerHandler = async () => {

		const document = await axios.get(SERVER)

		if (Object.keys(document.data).length === 0) {
			this.onChange(EditorState.createEmpty())
		} else {
			this.onChange(EditorState.createWithContent(convertFromRaw(document.data)))
		}

	}

	componentWillMount = () => {
		this.getFromServerHandler()
	}


	render() {

		const { status, editorState, spellCheck } = this.state;

		return (
			<App>
				<Header status={status}
					currentInlineStyle={editorState.getCurrentInlineStyle()}
					currentBlockType={RichUtils.getCurrentBlockType(this.state.editorState)}
					toggleInlineStyle={this.toggleInlineStyle}
					spellCheck={spellCheck}
					toggleSpellCheck={this.toggleSpellCheck}
					headerBlockType={this.headerBlockType}
					save={this.saveToServerHandler}
				/>
				<Flex
					flex="1"
					flexDirection="column"
					paddingSize="l"
					isScrollContainer={true}
				>
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
				<ToastContainer
					className={css({
						position: "fixed",
						width: "200px",
						padding: "4px",
						bottom: "40px",
						right: "10px",
						minHeight: "0px"
					})}
					closeButton={false}
					autoClose={5000}
					transition={Slide}
				/>
				{this.state.isModalOpen && <Modal toggleModal={this.toggleModal} />}
			</App>
		);
	}

	componentDidMount = () => {
		this.checkNetworkStatus()
	}

}

export default EditorPrototype;
