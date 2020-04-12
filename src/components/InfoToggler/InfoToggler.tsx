import * as React from 'react';
import './InfoToggler.css';

interface IInfoTogglerProps {
  title: string;
  imgLink: string;
  num: number;
  isSelected: boolean;
}

const InfoToggler: React.SFC<IInfoTogglerProps> = props => {
  let renderElements: any;
  if (props.isSelected) {
    // const backgroundColor = '#28d8b5';

    renderElements = (
      <div
        className="info-card"
        id={props.num.toString()}
        style={{
          filter: 'blur(4.5px)'
        }}
      >
        <img className="card-img" src={props.imgLink} />
        <h1 id={props.num.toString()}>{props.title}</h1>
      </div>
    );
  } else {
    renderElements = (
      <div className="info-card" id={props.num.toString()}>
        <img className="card-img" src={props.imgLink} />
        <h1 id={props.num.toString()}>{props.title}</h1>
      </div>
    );
  }
  return renderElements;
};

export default InfoToggler;
