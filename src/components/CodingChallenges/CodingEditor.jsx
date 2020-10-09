import React, { useState, useEffect } from 'react';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
// import 'codemirror/mode/javascript/javascript';
// import { Controlled as ControlledEditor } from 'react-codemirror2';
import CodingEditorTests from './CodingEditorTests';

export default function CodingEditor(props) {

  const [currentSrc, setCurrentSrc] = useState(``);
  const [currentPass, setCurrentPass] = useState(false);

  console.log('codingEditor Props', props);

  const { value, onChange } = props;

  function handleChange(editor, data, value) {
    onChange(value);
  }

  const srcDoc = `
    <html>
      <style>
      * {
        color: white;
        padding: 0.3rem;
        margin: 0;
        box-sizing: border-box;
        font-family: -apple-system,BlinkMacSystemFont, "Segoe UI",Roboto,"Helvetica Neue", Arial,sans-serif,"Apple Color Emoji", "Segoe UI Emoji","Segoe UI Symbol";
      }
      </style>
      <body>
        
      </body>
      <script>

        function whatName(name) {
          return name;
        }

        const whatup = whatName('bob');

        document.querySelector('.hello').textContent = whatup;

      </script>
    </html>
  `;



  function runJS(JS) {
    console.log('JS', JS)

    setCurrentPass(true);

    setTimeout(() => {
      setCurrentPass(false);
    }, 3000);

  }


  const testsData = props.currentTests.map((item, index) => {
    return <CodingEditorTests
      key={index}
      id={index}
      description={item.description}
      input={item.input}
      output={item.output}
      num={index + 1}
    />
  })


  return (
    <div className="coding-space-wrapper">
      <div className='coding-editor-container'>
        <div className="coding-editor-title">Code Editor</div>
        <div className="coding-editor-editor">
          { /*<ControlledEditor
            className='controlled-editor'
            onBeforeChange={handleChange}
            value={value}
            options={{
              lineWrapping: true,
              lint: true,
              mode: 'javascript',
              lineNumbers: true,
              theme: 'material'
            }} */}

        </div>
        <div className="coding-editor-run-container">
          <div className="editor-run-btn" onClick={() => runJS(value)}>Run Code</div>
        </div>
      </div>
      <div className="coding-editor-runner">
        <div className="coding-runner-tests">
          <div className="runner-tests-title">
            Coding Challenge Tests
          </div>
          <div className="runner-tests-tests">
            {testsData}
          </div>
          {currentPass && (
            <div className='current-pass'>
              3 tests run: <span className='tests-passing'>0 passing</span>;
              <span className='tests-failing'> 3 failing</span>
            </div>
          )}
        </div>
        <iframe
          title='output'
          frameborder="0"
          sandbox='allow-scripts'
          width='100%'
          height='50%'
          srcDoc={currentSrc}
        >
        </iframe>
      </div>
    </div>
  )


}