import React, { Component } from 'react';
import { ToastContainer, toast, Slide, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import BottomStatusbar from './BottomStatusbar';
import Modal from './Modal';

import { css } from 'glamor';

import {
	Editor,
	EditorState,
	RichUtils,
	convertFromRaw,
	convertToRaw,
	DefaultDraftBlockRenderMap
} from 'draft-js';

import Immutable from 'immutable';

import {
	App,
	Flex,
	Block,
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

const SERVER = "/api/document";
const STATUS = "/api/editor";


class EditorPrototype extends Component {

	changeSaveTimeout = null;

	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false,
			status: "online",
			editorState: EditorState.createEmpty(),
			spellCheck: false,
			isDocumentSave: false,
			isOfflineSaved: false,
			hasChange: false,
			isOnlineToastVisible: true,
			isOfflineToastVisible: false
		};
	}

	extendedBlockRenderMap = () => {

		const blockRenderMap = Immutable.Map({
			'paragraph': {
				element: 'p'
			},
			'unstyled': {
				element: 'p'
			}
		});

		return DefaultDraftBlockRenderMap.merge(blockRenderMap);
	}

	sendOnlineToast = () => {
		// navigator.serviceWorker.controller.postMessage("online");
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
		</Block>
	)

	sendOfflineToast = () => {
		// navigator.serviceWorker.controller.postMessage("offline");
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

	checkFakeNetworkStatus = async () => {
		const editor = await axios.get(STATUS)

		this.setState({ status: editor.data.status })

		if (this.state.status === "online" && !this.state.isOnlineToastVisible) {
			this.setState({ isOnlineToastVisible: true, isOfflineToastVisible: false })
			this.sendOnlineToast()
			this.saveDocumentToServerHandler();
		}

		if (this.state.status === "offline" && !this.state.isOfflineToastVisible) {
			this.setState({ spellCheck: false, isOfflineSaved: true, status: "offline", isOnlineToastVisible: false, isOfflineToastVisible: true })
			this.sendOfflineToast()
		}
		console.log("Status: ", editor.data.status);
	}

	checkNetworkStatus = () => {

		// TODO: If online when !hasDocument, then getDocumentFromServerHandler

		if (!navigator.onLine) {
			this.setState({ spellCheck: false, isOfflineSaved: true, status: "offline" })
			this.sendOfflineToast()
		}
		else {
			// TODO: Only if there are offline changes
			// this.saveDocumentToServerHandler();
		}

		window.addEventListener('online', e => {
			this.setState({ status: "online" })
			this.sendOnlineToast()
			this.saveDocumentToServerHandler();
		});

		window.addEventListener('offline', e => {
			this.setState({ spellCheck: false, isOfflineSaved: true, status: "offline" })
			this.sendOfflineToast()
		});
	}

	toggleSpellCheck = (state) => {
		this.setState({ spellCheck: !state })
	}

	toggleModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen })
	}

	onChange = (editorState) => {
		const contentHasChanged = this.state.hasChange || !Immutable.is(this.state.editorState.getCurrentContent(), editorState.getCurrentContent());

		this.setState({ editorState, hasChange: contentHasChanged });

		if (contentHasChanged) {
			if (this.changeSaveTimeout) {
				clearTimeout(this.changeSaveTimeout);
			}

			this.changeSaveTimeout = setTimeout(() => {
				this.changeSaveTimeout = null;
				this.saveDocumentToServerHandler();
			}, 2000);
		}
	}

	toggleInlineStyle = (inlineStyle) => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
	}

	toggleHeaderBlockType = (blockType) => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
	}

	saveAnimationHandler = () => {
		this.setState({ isDocumentSave: true, hasChange: false })

		setTimeout(() => {
			this.setState({ isDocumentSave: false })
		}, 2500);
	}

	saveDocumentToServerHandler = async () => {

		console.log("isOfflineSaved: ", this.state.isOfflineSaved)

		const data = convertToRaw(this.state.editorState.getCurrentContent())

		const latestSave = {
			timestamp: Date.now(),
			document: { ...data }
		}

		if (this.state.status === "online" && this.state.isOfflineSaved) {
			this.setState({ isOfflineSaved: false })

			setTimeout(async () => {

				const onlineEditor = await axios.get(SERVER)
				const offlineEditor = JSON.parse(localStorage.getItem("offlineSavedDocument"))

				// TODO: Compare with data

				const serverTimestamp = onlineEditor.data.timestamp,
					localTimestamp = offlineEditor.timestamp;


				if (serverTimestamp > localTimestamp) {
					console.log("Loading latest document from server and updating local", "SERVER: ",serverTimestamp, "Local: ",localTimestamp)

					const editor = await axios.get(SERVER)

					let editorState = EditorState.createWithContent(convertFromRaw(editor.data.document));
					this.setState({ editorState });

					localStorage.setItem("offlineSavedDocument", JSON.stringify(editor.data.document))
				} else if (serverTimestamp === localTimestamp) {
					console.log("No changes made", "SERVER: ",serverTimestamp, "Local: ",localTimestamp)
				} else {
					console.log("Loading latest document from local and updating server", "SERVER: ",serverTimestamp, "Local: ",localTimestamp)

					await axios.post(SERVER, latestSave)
					toast.warning("Saved offline changes", {
						position: "bottom-right",
						className: css({
							background: '#ebf4ec',
							border: "1px solid #388e3c"
						}),
						bodyClassName: css({
							color: "#388e3c",
							margin: "5px 0px"
						}),
						hideProgressBar: true,
						closeOnClick: true,
						toastId: 1
					});
				}

			}, 5000);

		} else if (this.state.status === "online") {

			const editor = await axios.get(SERVER)

			if (JSON.stringify(editor.data.document) !== JSON.stringify(latestSave.document)) {

				localStorage.setItem("offlineSavedDocument", JSON.stringify(latestSave))
				await axios.post(SERVER, latestSave)
				this.saveAnimationHandler()
				console.log("Saving Online");

			} else {
				console.log("Not Saving Online");
			}

		} else {

			if (!localStorage.getItem("offlineSavedDocument")) {

				localStorage.setItem("offlineSavedDocument", JSON.stringify(latestSave))
				this.saveAnimationHandler()
				console.log("First Time Saving Offline");

			} else {

				if (localStorage.getItem("offlineSavedDocument") !== JSON.stringify(latestSave)) {

					localStorage.setItem("offlineSavedDocument", JSON.stringify(latestSave))
					this.saveAnimationHandler()
					console.log("Saving Offline");

				} else {
					console.log("Not Saving Offline");
				}

			}
		}


	}

	getDocumentFromServerHandler = async () => {

		// TODO: If offline, load from localStorage, or from service worker cache, or else load an empty document or do not show any document?
		// If offline, and there is no localStorage or service worker cache, then do not show document but a warning:
		// <StateMessage
		// 	title="Warning state message"
		// 	message="Something is not going entirely as planned. You should go check it out!"
		// 	connotation="warning"
		// 	visual="warning"
		// />

		const status = await axios.get(STATUS)

		let editorState = this.state.editorState;

		if (status.data.status === "online") {
			console.log("Loading editor state from server")
			const editor = await axios.get(SERVER)
			editorState = EditorState.createWithContent(convertFromRaw(editor.data.document));


			// TODO:: compare local with server and always use latest

		} else if (!localStorage.getItem("offlineSavedDocument")) {
			console.log("Loading new editor from localstorage")
			editorState = EditorState.createEmpty();
		} else {
			console.log("Loading editor state from localstorage")
			const editor = JSON.parse(localStorage.getItem("offlineSavedDocument"))
			editorState = EditorState.createWithContent(convertFromRaw(editor.document));
		}

		this.setState({ editorState });

	}

	componentWillMount = () => {
		this.getDocumentFromServerHandler()
	}

	render() {

		const { status, editorState, spellCheck, isDocumentSave } = this.state;

		return (
			<App>
				<Header
					status={status}
					currentInlineStyle={editorState.getCurrentInlineStyle()}
					currentBlockType={RichUtils.getCurrentBlockType(editorState)}
					toggleInlineStyle={this.toggleInlineStyle}
					spellCheck={spellCheck}
					toggleSpellCheck={this.toggleSpellCheck}
					toggleHeaderBlockType={this.toggleHeaderBlockType}
					save={this.saveDocumentToServerHandler}
					undo={() => this.onChange(EditorState.undo(editorState))}
					redo={() => this.onChange(EditorState.redo(editorState))}
					isDocumentSave={isDocumentSave}
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
							blockRenderMap={this.extendedBlockRenderMap()}
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
		// this.checkNetworkStatus()

		setInterval(() => {
			this.checkFakeNetworkStatus()
		}, 2000);
	}
}

export default EditorPrototype;
