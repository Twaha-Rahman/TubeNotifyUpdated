import * as React from 'react';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IButtonProps {
  expadedButton?: boolean;
  buttonMessage: string;
  buttonIcon: any;
  clickHandler?: any;
}

const Button: React.SFC<IButtonProps> = props => {
  if (props.expadedButton) {
    return (
      <button className="expanded-button">
        {props.buttonMessage}
        <span className="btn-logo">
          <FontAwesomeIcon icon={props.buttonIcon} />
        </span>
      </button>
    );
  }

  if (props.clickHandler) {
    return (
      <button onClick={props.clickHandler}>
        {props.buttonMessage}
        <span className="btn-logo">
          <FontAwesomeIcon icon={props.buttonIcon} />
        </span>
      </button>
    );
  }

  return (
    <button className="input-button">
      {props.buttonMessage}
      <span className="btn-logo">
        <FontAwesomeIcon icon={props.buttonIcon} />
      </span>
    </button>
  );
};

export default Button;
