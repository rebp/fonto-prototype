import React, { Component } from "react";
import { ToastContainer, toast, Slide, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { writeData, readDataById } from "./../idb";

import Header from "./Header";
import BottomStatusbar from "./BottomStatusbar";
import ImageModal from "./ImageModal";
import ErrorModal from "./ErrorModal";

import { css } from "glamor";

import Editor from "draft-js-plugins-editor";
import createImagePlugin from "draft-js-image-plugin";
import "draft-js-image-plugin/lib/plugin.css";

import {
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  DefaultDraftBlockRenderMap,
  AtomicBlockUtils
} from "draft-js";

import Immutable from "immutable";

import { App, Flex, Block, Text } from "fds/components";

import { applyCss } from "fds/system";
import axios from "axios";

const styles = {
  editor: applyCss({
    padding: "4rem",
    width: "60%",
    margin: "0 auto",
    boxShadow: "0px 0px 10px 1px rgba(52, 73, 94, .5)",
    "& .public-DraftEditor-content": {
      minHeight: "100px"
    }
  })
};

const SlideInOut = cssTransition({
  enter: "slideDown",
  exit: "slideUp",
  duration: 5000
});

const imagePlugin = createImagePlugin();

// const SERVER = "/api/document";
// const STATUS = "/api/editor";

const SERVER = "http://api-rebp.nl/api/document";
const STATUS = "http://api-rebp.nl/api/editor";

class EditorPrototype extends Component {
  changeSaveTimeout = null;

  constructor(props) {
    super(props);

    this.state = {
      isImageModalOpen: false,
      isErrorModalOpen: false,
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
      paragraph: {
        element: "p"
      },
      unstyled: {
        element: "p"
      }
    });

    return DefaultDraftBlockRenderMap.merge(blockRenderMap);
  };

  savedOfflineToastRenderer = () => (
    <Block spaceHorizontalSize="m">
      <Text colorName="state-message-success-color" align="center">
        Saved offline changes
      </Text>
    </Block>
  );

  sendSavedOfflineToast = () => {
    toast.warning(this.savedOfflineToastRenderer, {
      className: css({
        background: "#ebf4ec",
        border: "1px solid #388e3c",
        position: "fixed",
        width: "200px",
        padding: "15px",
        top: "15px",
        left: "20px",
        minHeight: "60px"
      }),
      bodyClassName: css({
        color: "#388e3c",
        margin: "5px 0px"
      }),
      hideProgressBar: true,
      closeOnClick: true,
      transition: SlideInOut,
      toastId: 1
    });
  };

  onlineToastRenderer = () => (
    <Block spaceHorizontalSize="m">
      <Text colorName="state-message-info-color" align="center">
        Online
      </Text>
    </Block>
  );

  sendOnlineToast = () => {
    // navigator.serviceWorker.controller.postMessage("online");
    toast.info(this.onlineToastRenderer, {
      className: css({
        background: "#e8f1fb",
        border: "1px solid #1976d2",
        position: "fixed",
        width: "200px",
        padding: "15px",
        top: "15px",
        left: "20px",
        minHeight: "60px"
      }),
      bodyClassName: css({
        color: "#1976d2",
        margin: "5px 0px"
      }),
      hideProgressBar: true,
      transition: SlideInOut,
      toastId: 1
    });
  };

  offlineToastRenderer = () => (
    <Block spaceHorizontalSize="m">
      <Text colorName="icon-s-error-color" align="center">
        Offline
      </Text>
    </Block>
  );

  sendOfflineToast = () => {
    // navigator.serviceWorker.controller.postMessage("offline");
    toast.error(this.offlineToastRenderer, {
      className: css({
        background: "#fbeaea",
        border: "1px solid #d32f2f",
        position: "fixed",
        width: "200px",
        padding: "15px",
        top: "15px",
        left: "20px",
        minHeight: "60px"
      }),
      bodyClassName: css({
        color: "#d32f2f",
        margin: "5px 0px"
      }),
      hideProgressBar: true,
      transition: SlideInOut,
      toastId: 1
    });
  };

  checkFakeNetworkStatus = async () => {
    const editor = await axios.get(STATUS);

    this.setState({ status: editor.data.status });

    if (this.state.status === "online" && !this.state.isOnlineToastVisible) {
      this.setState({
        isOnlineToastVisible: true,
        isOfflineToastVisible: false
      });
      this.sendOnlineToast();
      this.saveDocumentToServerHandler();
    }

    if (this.state.status === "offline" && !this.state.isOfflineToastVisible) {
      this.setState({
        spellCheck: false,
        isOfflineSaved: true,
        status: "offline",
        isOnlineToastVisible: false,
        isOfflineToastVisible: true
      });
      this.sendOfflineToast();
    }
    console.log("Status: ", editor.data.status);
  };

  checkNetworkStatus = () => {
    // TODO: If online when !hasDocument, then getDocumentFromServerHandler

    if (!navigator.onLine) {
      this.setState({
        spellCheck: false,
        isOfflineSaved: true,
        status: "offline"
      });
      this.sendOfflineToast();
    }

    window.addEventListener("online", e => {
      this.setState({ status: "online" });
      this.sendOnlineToast();
      this.saveDocumentToServerHandler();
    });

    window.addEventListener("offline", e => {
      this.setState({
        spellCheck: false,
        isOfflineSaved: true,
        status: "offline"
      });
      this.sendOfflineToast();
    });
  };

  toggleSpellCheck = state => {
    this.setState({ spellCheck: !state });
  };

  toggleImageModal = () => {
    this.setState({ isImageModalOpen: !this.state.isImageModalOpen });
  };

  toggleErrorModal = () => {
    this.setState({ isErrorModalOpen: !this.state.isErrorModalOpen });
  };

  onChange = editorState => {
    const contentHasChanged =
      this.state.hasChange ||
      !Immutable.is(
        this.state.editorState.getCurrentContent(),
        editorState.getCurrentContent()
      );

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
  };

  toggleInlineStyle = inlineStyle => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  toggleHeaderBlockType = blockType => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  addImage = url => {
    const contentState = this.state.editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      " "
    );

    let editorState = EditorState.forceSelection(
      newEditorState,
      newEditorState.getCurrentContent().getSelectionAfter()
    );

    this.setState({ editorState });
    setTimeout(() => {
      this.saveDocumentToServerHandler();
      this.saveAnimationHandler();
    }, 2000);
  };

  saveAnimationHandler = () => {
    this.setState({ isDocumentSave: true, hasChange: false });

    setTimeout(() => {
      this.setState({ isDocumentSave: false });
    }, 2500);
  };

  saveDocumentToServerHandler = async () => {
    console.log("isOfflineSaved: ", this.state.isOfflineSaved);

    const { data: onlineEditor } = await axios.get(SERVER);
    const { data: offlineEditor } = await readDataById(
      "fonto",
      "offlineSavedDocument"
    );

    const serverTimestamp = onlineEditor.timestamp,
      localTimestamp = offlineEditor.timestamp,
      currenteState = convertToRaw(this.state.editorState.getCurrentContent()),
      latestSave = {
        timestamp: Date.now(),
        document: { ...currenteState }
      };

      writeData("fonto", { id: "offlineSavedDocument", data: latestSave });

    let editorState = this.state.editorState;

    if (this.state.status === "online" && this.state.isOfflineSaved) {
      this.setState({ isOfflineSaved: false });

      setTimeout(async () => {
        if (serverTimestamp > localTimestamp) {
          console.log(
            "Loading latest document from server. ",
            "[ SERVER: ",
            serverTimestamp,
            "LOCAL: ",
            localTimestamp,
            "]"
          );
          editorState = EditorState.createWithContent(
            convertFromRaw(onlineEditor.document)
          );
        } else if (serverTimestamp === localTimestamp) {
          console.log(
            "No changes made",
            "[ SERVER: ",
            serverTimestamp,
            "LOCAL: ",
            localTimestamp,
            "]"
          );
          editorState = EditorState.createWithContent(
            convertFromRaw(onlineEditor.document)
          );
        } else {
          console.log(
            "Loading latest document from local. ",
            "[ SERVER: ",
            serverTimestamp,
            "LOCAL: ",
            localTimestamp,
            "]"
          );

          editorState = EditorState.createWithContent(
            convertFromRaw(offlineEditor.document)
          );
          await axios.post(SERVER, offlineEditor);

          this.sendSavedOfflineToast();
        }
      }, 6000);
    } else if (this.state.status === "online") {
      if (onlineEditor.document !== latestSave.document) {
        await axios.post(SERVER, latestSave);
        writeData("fonto", { id: "offlineSavedDocument", data: latestSave });
        this.saveAnimationHandler();
        console.log("Saving Online and Local");
      } else {
        console.log("Not Saving Online");
      }
    } else {
      if (!offlineEditor) {
        writeData("fonto", { id: "offlineSavedDocument", data: latestSave });
        this.saveAnimationHandler();
        console.log("First Time Saving Offline");
      } else {
        if (offlineEditor.document !== latestSave.document) {
          writeData("fonto", { id: "offlineSavedDocument", data: latestSave });
          this.saveAnimationHandler();
          console.log("Saving Offline");
        } else {
          console.log("Not Saving Offline");
        }
      }
    }

    this.setState({ editorState });
  };

  getDocumentFromServerHandler = async () => {
    const status = await axios.get(STATUS)

    const { data: onlineEditor } = await axios.get(SERVER);
    const { data: offlineEditor } = await readDataById(
      "fonto",
      "offlineSavedDocument"
    );

      const serverTimestamp = onlineEditor.timestamp,
      localTimestamp = offlineEditor.timestamp;

    let editorState = this.state.editorState;

    if (status.data.status === "online") {
      editorState = EditorState.createWithContent(
        convertFromRaw(onlineEditor.document)
      );

      if (serverTimestamp > localTimestamp) {
        console.log(
          "Loading latest document from server. ",
          "[ SERVER: ",
          serverTimestamp,
          "LOCAL: ",
          localTimestamp,
          "]"
        );
        editorState = EditorState.createWithContent(
          convertFromRaw(onlineEditor.document)
        );
      } else if (serverTimestamp === localTimestamp) {
        console.log(
          "No changes made",
          "[ SERVER: ",
          serverTimestamp,
          "LOCAL: ",
          localTimestamp,
          "]"
        );
        editorState = EditorState.createWithContent(
          convertFromRaw(onlineEditor.document)
        );
      } else {
        console.log(
          "Loading latest document from local. ",
          "[ SERVER: ",
          serverTimestamp,
          "LOCAL: ",
          localTimestamp,
          "]"
        );
        editorState = EditorState.createWithContent(
          convertFromRaw(offlineEditor.document)
        );
      }
    } else if (!offlineEditor) {
      console.log("Loading new editor from indexedDB");
      editorState = EditorState.createEmpty();
    } else {
      console.log("Loading editor state from indexedDB");
      editorState = EditorState.createWithContent(
        convertFromRaw(offlineEditor.document)
      );
    }

    this.setState({ editorState });
  };

  componentWillMount = async () => {
    this.getDocumentFromServerHandler();
    const { data: offlineEditor } = await readDataById(
      "fonto",
      "offlineSavedDocument"
    );
    console.log(offlineEditor);
  };

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
          toggleImageModal={this.toggleImageModal}
          save={this.saveDocumentToServerHandler}
          undo={() => this.onChange(EditorState.undo(editorState))}
          redo={() => this.onChange(EditorState.redo(editorState))}
          isDocumentSave={isDocumentSave}
          addImage={this.addImage}
        />
        <Flex
          flex="1"
          flexDirection="column"
          paddingSize="l"
          isScrollContainer={true}
        >
          <div {...styles.editor}>
            <Editor
              ref={element => {
                this.editor = element;
              }}
              editorState={editorState}
              onChange={this.onChange}
              spellCheck={spellCheck}
              blockRenderMap={this.extendedBlockRenderMap()}
              plugins={[imagePlugin]}
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
            minHeight: "0px",
            zIndex: "1"
          })}
          closeButton={false}
          transition={Slide}
        />
        {this.state.isImageModalOpen && (
          <ImageModal
            toggleImageModal={this.toggleImageModal}
            toggleErrorModal={this.toggleErrorModal}
            addImage={this.addImage}
          />
        )}
        {this.state.isErrorModalOpen && (
          <ErrorModal toggleErrorModal={this.toggleErrorModal} />
        )}
      </App>
    );
  }

  componentDidMount = () => {
    // this.checkNetworkStatus()

    setInterval(() => {
      this.checkFakeNetworkStatus();
    }, 2000);
  };
}

export default EditorPrototype;
