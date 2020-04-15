import * as React from 'react';
import './DeleteCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import refToDb from '../../utilities/dbOpener';
import dbReader from '../../utilities/dbReader';

interface IDeleteCardProps {
  channelName: string;
  channelLogoLink: string;
  keywords: string[][];
  channelTag: string;
  queryIndex: number;
  dispatchFunction: any;
  forceUpdater: any;
}

const DeleteCard: React.SFC<IDeleteCardProps> = props => {
  const keywordDeletor = async (channelTag: string, queryIndex: number, detailsIndex: number) => {
    try {
      const ref = await refToDb;
      const channelQuery = await dbReader(refToDb, 'query', channelTag);

      const newDetails: any[] = [];
      channelQuery.details.forEach((detailObj: any, index: number) => {
        if (detailsIndex !== index) {
          newDetails.push(detailObj);
        }
      });
      if (newDetails.length === 0) {
        ref.transaction('query', 'readwrite').store.delete(channelTag);
      } else {
        const newChannelQuery = { ...channelQuery, details: newDetails };
        ref.transaction('query', 'readwrite').store.put(newChannelQuery);
      }

      props.forceUpdater();
    } catch (error) {
      props.dispatchFunction({
        type: `showError`
      });
    }
  };

  const keywordsMinus: any = [];
  props.keywords.forEach((keywordArr: string[], index: number) => {
    let concatedKeywords = '';

    keywordArr.forEach(word => {
      concatedKeywords += `${word} & `;
    });

    // concatedKeywords.replace(/.$/, '');

    const polishedConcat = concatedKeywords.slice(0, concatedKeywords.length - 2);

    keywordsMinus.push(
      <span
        className="keyword"
        key={index.toString()}
        onClick={() => {
          keywordDeletor(props.channelTag, props.queryIndex, index);
        }}
      >
        {polishedConcat}
        <FontAwesomeIcon icon={faMinusCircle} />
      </span>
    );
  });
  return (
    <div className="delete-card-container">
      <div className="delete-card-top">
        <img src={props.channelLogoLink} alt="Channel Logo" className="unselectable" />
        <h3>{props.channelName}</h3>
        <span
          onClick={async () => {
            try {
              const ref = await refToDb;
              ref.transaction('query', 'readwrite').store.delete(props.channelTag);
            } catch (error) {
              props.dispatchFunction({
                type: `showError`
              });
            }
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </span>
      </div>
      <div className="delete-card-body">{keywordsMinus}</div>
    </div>
  );
};

export default DeleteCard;
