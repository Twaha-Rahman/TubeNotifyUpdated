import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './Selector.css';
import Button from '../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import InfoToggler from '../../components/InfoToggler/InfoToggler';
import eraseAll from '../../utilities/eraseAll';
import { Redirect } from 'react-router';
import multipleStoreCommits from '../../utilities/multipleStoreCommits';
import looper from '../../utilities/looper';
import compareAndKeep from '../../utilities/compareAndKeep';
import refToDb from '../../utilities/dbOpener';
import dbReader from '../../utilities/dbReader';
import dbWriter from '../../utilities/dbWriter';
import isArraysEqual from '../../utilities/isArraysEqual';

import Loading from '../../components/Loading/Loading';
//tslint:disable
class Selector extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props
    this.helper = this.helper.bind(this);
    this.dbWriteHelper = this.dbWriteHelper.bind(this);
    this.dbReadHelper = this.dbReadHelper.bind(this);
  }
  public componentWillUnmount() {
    this.props.dispatch({
      type: `clearStep`
    });
    this.props.dispatch({
      type: `hideLoader`
    });
    this.props.dispatch({
      type: 'eraseCurrentlySelected'
    });
    eraseAll(this, 'selector');
  }

  public helper(e: any) {
    let num = Number(e.target.id);

    if (e.target.tagName === 'IMG') {
      num = Number(e.target.parentNode.id);
    }

    if (e.target.tagName === 'svg') {
      num = Number(e.target.parentNode.parentNode.previousSibling.id);
    }

    if (e.target.tagName === 'path') {
      num = Number(e.target.parentNode.parentNode.parentNode.previousSibling.id);
    }

    if (e.target.tagName === 'DIV' && isNaN(num)) {
      num = Number(e.target.previousSibling.id);
    }

    if (e.target.tagName === 'H1') {
      if (e.target.id === '') {
        num = Number(e.target.parentNode.previousSibling.id);
      }
    }

    const numberOfCards = this.props.store.addTitles.length;
    const selectedCount = numberOfCards - num;

    this.props.dispatch({
      type: `currentlySelected`,
      number: selectedCount
    });
  }

  public async dbReadHelper(dbRef: any, objStore: string, channelTag: string) {
    try {
      const db = await dbRef;

      const tx = db.transaction(objStore, 'readwrite');
      let data = await tx.store.get(channelTag);

      return data;
    } catch (error) {
      this.props.dispatch({
        type: `showError`
      });
    }
  }

  public async dbWriteHelper(dbRef: any, objStore: string, obj: any) {
    try {
      const ref = await dbRef;
      await dbWriter(ref, objStore, obj);
    } catch (error) {
      this.props.dispatch({
        type: `showError`
      });
    }
  }

  public render() {
    const { addTitles, addThumbnailLinks, currentlySelected } = this.props.store;
    const unselected: number = addTitles.length - currentlySelected - 1;
    const renderThis = addTitles.map((val: string, index: number) => {
      if (unselected > index || unselected === index) {
        return (
          <div
            key={index}
            onClick={e => {
              this.helper(e);
            }}
            className="info-toggler-wrapper"
          >
            <InfoToggler isSelected={false} num={index} title={val} imgLink={addThumbnailLinks[index]} />
          </div>
        );
      }
      return (
        <div
          key={index}
          onClick={e => {
            this.helper(e);
          }}
          className="info-toggler-wrapper"
        >
          <InfoToggler isSelected={true} num={index} title={val} imgLink={addThumbnailLinks[index]} />
          <div id="hover-selected">
            <h1>
              <FontAwesomeIcon icon={faCheck} />
              Selected
            </h1>
          </div>
        </div>
      );
    });

    const render = (
      <div className="selector-container">
        <h1 className="selector-title">Select the video you have watched recently :</h1>

        {renderThis}
        <div className="selector-btn-container">
          <span
            className="selector-next-btn"
            onClick={() => {
              this.props.dispatch({
                type: `stepInc`
              });
            }}
          >
            <Button expadedButton={true} buttonMessage="Next" buttonIcon={faArrowRight} />
          </span>
          <span
            className="selector-load-more-btn"
            onClick={async () => {
              const newLink: string = `${this.props.store.requestLink.link}pageToken=${
                this.props.store.requestLink.nextPageToken
              }`;

              try {
                const unparsedData = await fetch(newLink);
                const secondLinkData = await unparsedData.json();

                const descriptions: string[] = [];
                const thumbnailLinks: string[] = [];
                const titles: string[] = [];
                const videoIds: string[] = [];
                const videoUploadTime: string[] = [];

                const videoInfoArray = secondLinkData.items;
                videoInfoArray.forEach((response: any) => {
                  titles.push(response.snippet.title);
                  descriptions.push(response.snippet.description);
                  thumbnailLinks.push(response.snippet.thumbnails.medium.url);
                  videoIds.push(response.snippet.resourceId.videoId);
                  // response.snippet.publishedAt.forEach((videoPublishDate: string) => {
                  //   const date = videoPublishDate.substring(0, 10);
                  //   videoUploadTime.push(date);
                  // });
                  const date = response.snippet.publishedAt.substring(0, 10);
                  videoUploadTime.push(date);
                });

                ///////////
                const keywords = this.props.store.addKeyword;
                const matchedTitlesIndex = looper(titles, keywords);
                const matchedDescriptionsIndex = looper(descriptions, keywords);
                const uniqueMatchedTitlesIndex = [...new Set(matchedTitlesIndex)];
                const uniqueMatchedDescriptionsIndex = [...new Set(matchedDescriptionsIndex)];
                const combinedUniqueIndexes = [
                  ...new Set([...uniqueMatchedTitlesIndex, ...uniqueMatchedDescriptionsIndex])
                ];

                const keepTheseTitles: string[] = compareAndKeep({
                  source: titles,
                  toCompareWith: combinedUniqueIndexes
                });
                const keepTheseDescriptions: string[] = compareAndKeep({
                  source: descriptions,
                  toCompareWith: combinedUniqueIndexes
                });
                const keepTheseThumbnailLinks: string[] = compareAndKeep({
                  source: thumbnailLinks,
                  toCompareWith: combinedUniqueIndexes
                });
                /////////////////////////////////////////////////////////
                const keepTheseVideoIds: string[] = compareAndKeep({
                  source: videoIds,
                  toCompareWith: combinedUniqueIndexes
                });
                /////////////////////////////////////////////////////////
                const keepTheseVideoUploadTime: string[] = compareAndKeep({
                  source: videoUploadTime,
                  toCompareWith: combinedUniqueIndexes
                });

                this.props.dispatch({
                  type: 'eraseCurrentlySelected'
                });

                multipleStoreCommits({
                  refToDispatcher: this.props.dispatch,
                  commitName: `Title`,
                  arrayToCommit: keepTheseTitles
                });

                multipleStoreCommits({
                  refToDispatcher: this.props.dispatch,
                  commitName: `Description`,
                  arrayToCommit: keepTheseDescriptions
                });

                multipleStoreCommits({
                  refToDispatcher: this.props.dispatch,
                  commitName: `ThumbnailLink`,
                  arrayToCommit: keepTheseThumbnailLinks
                });

                this.props.dispatch({
                  type: 'requestLink',
                  link: this.props.store.requestLink.link,
                  nextPageToken: secondLinkData.nextPageToken
                });
                ///////////////////////////////////////////////
                this.props.dispatch({
                  type: 'addVideoIds',
                  videoIds: keepTheseVideoIds
                });
                //////////////////////////////////////////////////
                this.props.dispatch({
                  type: 'addVideoPublishDates',
                  dates: keepTheseVideoUploadTime
                });
              } catch (error) {
                this.props.dispatch({
                  type: `showError`
                });
              }
            }}
          >
            <Button expadedButton={true} buttonMessage="Load More" buttonIcon={faAngleDoubleDown} />
          </span>
        </div>
      </div>
    );

    if (this.props.store.stepCounter === 4) {
      this.props.dispatch({
        type: `stepInc`
      });
      return <Loading />;
    }

    if (this.props.store.stepCounter === 5) {
      // process the data here and go to the next page by rendering the following line-
      // titles, descriptions, thumbnailLinks, keywords, channelName, channelLogoLink, channelTag, playlistID, lookedUpToThisVideoTag

      const videoLinks: string[] = [];

      const currentlySelectedVideos = this.props.store.addVideoIds.slice(this.props.store.currentlySelected * -1);

      currentlySelectedVideos.forEach((videoId: string) => {
        const link: string = `https://www.youtube.com/watch?v=${videoId}`;
        videoLinks.push(link);
      });

      const oldSubscription: any = this.dbReadHelper(
        refToDb,
        'subscription',
        this.props.store.addAdditionalInfo.channelTag
      );
      const oldQuery: any = this.dbReadHelper(refToDb, 'query', this.props.store.addAdditionalInfo.channelTag);

      oldSubscription
        .then((data: any) => {
          if (data) {
            const subscriptionToWrite = {
              channelName: this.props.store.addAdditionalInfo.channelName,
              channelTag: this.props.store.addAdditionalInfo.channelTag,
              channelLogoLink: this.props.store.addAdditionalInfo.channelLogoLink,
              unseenVideoTitles: [
                ...data.unseenVideoTitles,
                this.props.store.addTitles.slice(this.props.store.currentlySelected * -1)
              ],
              videoThumbnailLinks: [
                ...data.videoThumbnailLinks,
                this.props.store.addThumbnailLinks.slice(this.props.store.currentlySelected * -1)
              ],
              videoLinks: [...data.videoLinks, videoLinks],
              videoUploadTime: [
                ...data.videoUploadTime,
                this.props.store.addVideoPublishDates.slice(this.props.store.currentlySelected * -1)
              ]
            };
            this.dbWriteHelper(refToDb, 'subscription', subscriptionToWrite);
          } else {
            const subscriptionToWrite = {
              channelName: this.props.store.addAdditionalInfo.channelName,
              channelTag: this.props.store.addAdditionalInfo.channelTag,
              channelLogoLink: this.props.store.addAdditionalInfo.channelLogoLink,
              unseenVideoTitles: [this.props.store.addTitles.slice(this.props.store.currentlySelected * -1)],
              videoThumbnailLinks: [this.props.store.addThumbnailLinks.slice(this.props.store.currentlySelected * -1)],
              videoLinks: [videoLinks],
              videoUploadTime: [this.props.store.addVideoPublishDates.slice(this.props.store.currentlySelected * -1)]
            };
            this.dbWriteHelper(refToDb, 'subscription', subscriptionToWrite);
          }
        })
        .catch(() => {
          this.props.dispatch({
            type: `showError`
          });
        });

      oldQuery
        .then((data: any) => {
          if (data) {
            const queryToWrite = {
              channelName: this.props.store.addAdditionalInfo.channelName,
              channelLogoLink: this.props.store.addAdditionalInfo.channelLogoLink,
              channelTag: this.props.store.addAdditionalInfo.channelTag,
              playlistId: this.props.store.addAdditionalInfo.playlistID,
              details: [
                ...data.details,
                {
                  lookedUpToThisVideoTag: this.props.store.addAdditionalInfo.lookedUpToThisVideoTag,
                  keyWords: this.props.store.addKeyword
                }
              ]
            };
            const oldKeyWords: string[] = [];
            data.details.forEach((info: any) => {
              oldKeyWords.push(info.keyWords);
            });

            const newKeyWords = this.props.store.addKeyword;

            oldKeyWords.forEach((val: any) => {
              if (!isArraysEqual(newKeyWords, val)) {
                this.dbWriteHelper(refToDb, 'query', queryToWrite);
              }
            });
          } else {
            const queryToWrite = {
              channelName: this.props.store.addAdditionalInfo.channelName,
              channelLogoLink: this.props.store.addAdditionalInfo.channelLogoLink,
              channelTag: this.props.store.addAdditionalInfo.channelTag,
              playlistId: this.props.store.addAdditionalInfo.playlistID,
              details: [
                {
                  lookedUpToThisVideoTag: this.props.store.addAdditionalInfo.lookedUpToThisVideoTag,
                  keyWords: this.props.store.addKeyword
                }
              ]
            };

            this.dbWriteHelper(refToDb, 'query', queryToWrite);
          }
        })
        .catch(() => {
          this.props.dispatch({
            type: `showError`
          });
        });

      const oldThumbnailLinksToKeep: any = dbReader(refToDb, 'cache-keep', 1)
        .then(res => {
          let newThumbnailLinksToKeep: string[] = [];
          if (res) {
            newThumbnailLinksToKeep = [
              ...res.data,
              ...this.props.store.addThumbnailLinks.slice(this.props.store.currentlySelected * -1)
            ];
          } else {
            newThumbnailLinksToKeep = this.props.store.addThumbnailLinks.slice(this.props.store.currentlySelected * -1);
          }

          this.dbWriteHelper(refToDb, 'cache-keep', {
            id: 1,
            data: newThumbnailLinksToKeep
          });
        })
        .catch(err => {
          console.log(err);

          this.props.dispatch({
            type: `showError`
          });
        });

      if (this.props.store.hasSubscription) {
        return <Redirect to="/final" />;
      }

      return <Redirect to="/ask" />;
    }

    return render;
  }
}

export default connect(mapStateToProps)(Selector);
