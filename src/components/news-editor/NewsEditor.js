import React, {useState} from 'react';
import {Editor} from "react-draft-wysiwyg";
import {convertToRaw} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function NewsEditor(props) {
    const [editorState, setEditorState] = useState("");

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    );
}

export default NewsEditor;