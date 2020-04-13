import * as React from 'react';
import './TogglingCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ITogglingCardProps {
  title: string;
  items: string[];
  channelLogoLink: string;
  deletor: any;
  videoThumbnailLinks: string[];
  togglingFunction: any;
  videoLinks: string[];
  videoUploadTimes: string[];
  subscriptionPart: number;
  forceUpdater: any;
}

const TogglingCard: React.SFC<ITogglingCardProps> = props => {
  const itemsJSX: any = [];
  props.items.forEach((data: string, index: number) => {
    itemsJSX.push(
      <div className="collapsible-card-items" key={index}>
        <div
          className="item"
          onClick={(e: any) => {
            let hoverDivRef: any;
            if (e.target.tagName === 'DIV') {
              if (e.target.parentNode.classList[0] === 'item') {
                hoverDivRef = e.target.parentNode.parentNode.childNodes[1];
              } else {
                hoverDivRef = e.target.parentNode.childNodes[1];
              }
            }
            if (e.target.tagName === 'H3' || e.target.tagName === 'SPAN') {
              hoverDivRef = e.target.parentNode.parentNode.parentNode.childNodes[1];
            }
            if (e.target.tagName === 'IMG') {
              hoverDivRef = e.target.parentNode.parentNode.childNodes[1];
            }

            hoverDivRef.parentNode.childNodes[0].style.filter = 'blur(10.5px)';
            hoverDivRef.style.display = 'flex';
            window.open(props.videoLinks[index], '_blank');
          }}
        >
          <img src={props.videoThumbnailLinks[index]} />

          <div className="collapsible-card-item-info-container">
            <h3>{data}</h3>

            <span>{props.videoUploadTimes[index]}</span>
          </div>
        </div>
        <div className="hover-div">
          <h1>Have you watched the video?</h1>
          <div className="hover-div-buton-container">
            <button
              onClick={() => {
                props.deletor(props.videoLinks[index], props.videoThumbnailLinks[index], props.subscriptionPart);
              }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              onClick={(e: any) => {
                const selectedNode = e.target;

                props.forceUpdater();
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      </div>
    );
  });
  return (
    <div className="collapsible-card">
      <div className="collapsible-card-title" onClick={props.togglingFunction}>
        <img src={props.channelLogoLink} className="unselectable" />

        <h5>{props.title}</h5>
        <FontAwesomeIcon className="drop-icon" icon={faChevronDown} />
      </div>
      <div className="collapsible-card-item-container">{itemsJSX}</div>
    </div>
  );
};

export default TogglingCard;
