import * as React from 'react';
import './Loading.css';

const Loading: React.SFC = props => {
  return (
    <div className="loader-container">
      <div className="lds-ellipsis">
        <div />
        <div className="dotOne" />
        <div className="dotTwo" />
        <div />
      </div>
    </div>
  );
};

export default Loading;
