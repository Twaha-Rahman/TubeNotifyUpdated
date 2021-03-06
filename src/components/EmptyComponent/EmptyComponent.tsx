import * as React from 'react';
import './EmptyComponent.css';

interface IEmptyComponentProps {
  text?: string;
  svgComponent: any;
}

const EmptyComponent: React.SFC<IEmptyComponentProps> = props => {
  return (
    <div className="empty-container">
      <div className="img-container">
        <props.svgComponent className="empty-svg" />
      </div>
      <p className="empty-text">{props.text}</p>
    </div>
  );
};

export default EmptyComponent;
