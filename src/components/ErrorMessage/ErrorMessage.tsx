import * as React from 'react';
import './ErrorMessage.css';
import Button from '../Button/Button';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import * as Router from 'react-router-dom';
import { ReactComponent as Logo } from '../../media/image/error.svg';

interface IErrorMessageProps {
  refToDispatcher?: any;
}

const ErrorMessage: React.SFC<IErrorMessageProps> = props => {
  return (
    <div className="error">
      <h1>Something went wrong!</h1>
      <Logo width="100%" height="auto" />
      <div className="error-body">
        <h5>
          Please check your internet connection and try again. If the problem persists, then it's either a YouTube's API
          server is down or TubeNotify server is down. In that case, the problem will be resolved after a while.
        </h5>
      </div>
      <Router.Link to="/add">
        <Button buttonIcon={faUndoAlt} buttonMessage="Retry" />
      </Router.Link>
    </div>
  );
};

export default ErrorMessage;
