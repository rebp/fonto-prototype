import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import BottomStatusbar from './BottomStatusbar';
// import Modal from './Modal';

import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';

import {
	App,
	Flex
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
			status: "online",
			editorState: EditorState.createEmpty(),
			spellCheck: false
		};
	}

	checkNetworkStatus = () => {
		window.addEventListener('online', e => {
			navigator.serviceWorker.controller.postMessage("online");
			this.setState({ status: e.type })
			toast.info("Online", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true
			});
		});

		window.addEventListener('offline', e => {
			navigator.serviceWorker.controller.postMessage("offline");
			this.setState({ status: e.type })
			toast.error("Offline", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true
			});
		});
	}

	onChange = (editorState) => this.setState({ editorState });

	focusEditor = () => {
		if (this.editor) {
			this.editor.focus();
		}
	};

	makeBold = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"))
	}

	makeItalic = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"))
	}

	makeUnderline = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"))
	}


	render() {
		
		const { status, editorState, spellCheck } = this.state;

		return (
			<App>
				<Header status={status} makeBold={this.makeBold} makeItalic={this.makeItalic} makeUnderline={this.makeUnderline}/>
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
				{/* <Modal/> */}
				<ToastContainer />
			</App>
		);
	}

	componentDidMount = () => {
		this.checkNetworkStatus()
		this.focusEditor();
	}

}

export default EditorPrototype;
