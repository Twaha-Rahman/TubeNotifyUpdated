import * as React from 'react';
import './AddBody.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';

interface IAddBodyProps {
  refToThis: any;
  useCase: string;
  mainText: string;
  inputFieldText: string;
}

const AddBody: React.SFC<IAddBodyProps> = props => {
  let instruction: any;
  let inputTextId: string = '';
  if (props.useCase === 'link') {
    instruction = (
      <div className="instruction-container">
        <h5>Ways to get the link:</h5>
        {/* <video src="tutorial.mp4" /> */}
        <p className="mini-title">Method 1</p>
        <p>
          <span className="point-number">1.</span> Go to YouTube and enter the homepage of the channel that you want to
          subscribe
        </p>
        <p>
          <span className="point-number">2.</span> Copy the link of that page and paste it in here
        </p>
        <p className="mini-title">Method 2</p>
        <p>
          <span className="point-number">1.</span> Open the YouTube app and search for the channel you want to subscribe
          to
        </p>
        <p>
          <span className="point-number">2.</span> Enter channel and click the share icon
        </p>
        <p>
          <span className="point-number">3.</span> Select TubeNotify on the share panel
        </p>
      </div>
    );
  } else {
    inputTextId = 'input-key-word';
    instruction = (
      <div className="instruction-container">
        <div>
          <h5>What is a "keyword"?</h5>
          <p>
            By the word "keyword" we mean a word that we will use to check if the video has your specified content. A
            "keyword" can be a letter or a word or a sentence or even an emoji. In short, a keyword is the word which is
            used to check for a match.
          </p>
        </div>
        <div>
          <h5>Example:</h5>
          <p>
            If you want to get notification for Android videos from a specific channel, you'll have to use keywords
            related to it such as <span>android</span>, <span>android update</span> etc.{' '}
            <em>Keywords aren't case sensitive.</em>
            That means the keywords <span>apple</span> and <span>Apple</span> and <span>ApPlE</span> are the same.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="wrapper">
      <h1>{props.mainText}</h1>
      <input
        id="input"
        className={inputTextId}
        type="text"
        placeholder={props.inputFieldText}
        onKeyUp={(event: any) => {
          const btnRef: any = document.getElementById('click-this');
          if (event.keyCode === 13) {
            event.preventDefault();
            btnRef.click();
          }
        }}
      />

      <div id="input-msg-container">
        <span id="input-msg">The link you have entered is not valid!</span>
      </div>

      <br />
      {instruction}
      <div id="click-this" onClick={props.refToThis.submitter}>
        <Button buttonIcon={faArrowRight} buttonMessage="Next" />
      </div>
    </div>
  );
};

export default AddBody;
