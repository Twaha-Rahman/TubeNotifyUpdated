import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import AddBody from '../../components/AddBody/AddBody';
import linkGenerator from '../../utilities/linkGenerator';
import eraseAll from '../../utilities/eraseAll';
import Loading from '../../components/Loading/Loading';
import { Redirect } from 'react-router';
import looper from '../../utilities/looper';
import compareAndKeep from '../../utilities/compareAndKeep';
import multipleStoreCommits from '../../utilities/multipleStoreCommits';

class Add extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props

    this.submitter = this.submitter.bind(this);
    this.props.dispatch({
      type: `stepInc`
    });
  }

  public componentDidMount() {
    // const refToButton: any = document.getElementsByClassName('input-button');
    // const refToInputField: any = document.getElementById('input');
    // refToInputField.addEventListener('keyup', (event: any) => {
    //   if (event.keyCode === 13) {
    //     event.preventDefault();
    //     refToButton[0].click();
    //   }
    // });
    // if (this.props.store.stepCounter === 2) {
    //   const refToInputFieldForKeyWord: any = document.getElementsByClassName('input-key-word')[0];
    //   refToInputFieldForKeyWord.addEventListener('keyup', (event: any) => {
    //     if (event.keyCode === 13) {
    //       event.preventDefault();
    //       refToButton[0].click();
    //     }
    //   });
    // }
  }

  public componentWillUnmount() {
    if (this.props.store.stepCounter !== 3) {
      this.props.dispatch({
        type: `clearStep`
      });
      this.props.dispatch({
        type: `hideLoader`
      });
      eraseAll(this, 'add');
    }
  }

  public submitter = () => {
    const inputRef = document.getElementById(`input`) as HTMLInputElement;

    const currentStep = this.props.store.stepCounter;
    const inputData = inputRef.value;

    if (currentStep === 1) {
      if (inputData !== '') {
        const inputLinkParts = inputData.trim().split(`/`);
        if (inputLinkParts.length === 1) {
          inputRef.style.borderColor = `#ff4646`;
          inputRef.style.boxShadow = '0px 0px 40px -18px #d53e3e';

          const refToInputMsg = document.getElementById(`input-msg-container`) as any;
          refToInputMsg.style.display = `flex`;
        } else {
          const ytId = inputLinkParts[inputLinkParts.length - 1];
          let firstLink = '';
          //tslint:disable
          if (inputLinkParts[inputLinkParts.length - 2] === 'channel') {
            firstLink = linkGenerator({ id: ytId, type: `channels`, part: `contentDetails, snippet` });
          } else {
            firstLink = linkGenerator({ forUsername: ytId, type: `channels`, part: `contentDetails, snippet` });
          }

          this.props.dispatch({
            type: `showLoader`
          });
          fetch(firstLink)
            .then(firstLinkResponse => {
              firstLinkResponse.json().then(firstLinkData => {
                console.log(firstLinkData.items[0].snippet.thumbnails.default.url);
                const channelLogoLink = firstLinkData.items[0].snippet.thumbnails.default.url;
                if (firstLinkData.items.length === 0) {
                  this.props.dispatch({
                    type: `showError`
                  });
                } else {
                  const playlistId: string = firstLinkData.items[0].contentDetails.relatedPlaylists.uploads;
                  console.log(firstLinkData);

                  const secondLink = linkGenerator({
                    playlistId,
                    type: `playlistItems`,
                    maxResults: 50,
                    part: `snippet`
                  });
                  fetch(secondLink)
                    .then(secondLinkResponse => {
                      secondLinkResponse.json().then(secondLinkData => {
                        console.log(secondLinkData);

                        // const lookedUpToThisVideoTag =
                        //   secondLinkData.items[secondLinkData.items.length - 1].snippet.resourceId.videoId;

                        const lookedUpToThisVideoTagArray: string[] = [];

                        secondLinkData.items.forEach((element: any) => {
                          lookedUpToThisVideoTagArray.push(element.snippet.resourceId.videoId);
                        });

                        this.props.dispatch({
                          type: 'addAdditionalInfo',
                          action: {
                            channelName: secondLinkData.items[0].snippet.channelTitle,
                            channelTag: secondLinkData.items[0].snippet.channelId,
                            channelLogoLink: channelLogoLink,
                            playlistID: secondLinkData.items[0].snippet.playlistId,
                            // lookedUpToThisVideoTag: lookedUpToThisVideoTag,
                            tagArray: lookedUpToThisVideoTagArray
                          }
                        });
                        const videoInfoArray = secondLinkData.items;
                        const descriptions: string[] = [];
                        const thumbnailLinks: string[] = [];
                        const titles: string[] = [];
                        const videoIds: string[] = [];
                        const videoPublishDates: string[] = [];

                        videoInfoArray.forEach((response: any) => {
                          titles.push(response.snippet.title);
                          descriptions.push(response.snippet.description);
                          thumbnailLinks.push(response.snippet.thumbnails.medium.url);
                          videoIds.push(response.snippet.resourceId.videoId);
                          videoPublishDates.push(response.snippet.publishedAt);
                        });

                        const publishDates: string[] = [];

                        videoPublishDates.forEach(videoPublishDate => {
                          const date = videoPublishDate.substring(0, 10);
                          publishDates.push(date);
                        });

                        this.props.dispatch({
                          type: 'requestLink',
                          link: secondLink,
                          nextPageToken: secondLinkData.nextPageToken
                        });

                        this.props.dispatch({
                          type: 'addVideoIds',
                          videoIds: videoIds
                        });

                        this.props.dispatch({
                          type: 'addVideoPublishDates',
                          dates: publishDates
                        });

                        multipleStoreCommits({
                          refToDispatcher: this.props.dispatch,
                          commitName: `Title`,
                          arrayToCommit: titles
                        });

                        multipleStoreCommits({
                          refToDispatcher: this.props.dispatch,
                          commitName: `Description`,
                          arrayToCommit: descriptions
                        });

                        multipleStoreCommits({
                          refToDispatcher: this.props.dispatch,
                          commitName: `ThumbnailLink`,
                          arrayToCommit: thumbnailLinks
                        });
                        this.props.dispatch({
                          type: `stepInc`
                        });
                      });
                    })
                    .catch(why => {
                      this.props.dispatch({
                        type: `showError`
                      });
                    });
                }
              });
            })
            .catch(reason => {
              this.props.dispatch({
                type: `showError`
              });
            });
        }
      } else {
        inputRef.style.borderColor = `#ff4646`;
        inputRef.style.boxShadow = '0px 0px 40px -18px #d53e3e';
        inputRef.placeholder = `Please fill in this field`;
      }
    }
    if (currentStep === 2) {
      if (inputData === '') {
        inputRef.style.borderColor = `#ff4646`;
        inputRef.style.boxShadow = '0px 0px 40px -18px #d53e3e';
        inputRef.placeholder = `Please fill in this field`;
      } else {
        const subscriptionWords = inputData.split(`,`);
        const trimmedSubscriptionWords: string[] = [];
        subscriptionWords.forEach(part => {
          trimmedSubscriptionWords.push(part.trim());
        });
        const { addTitles, addDescriptions, addThumbnailLinks, addVideoIds, addVideoPublishDates } = this.props.store;
        trimmedSubscriptionWords.forEach(keyword => {
          this.props.dispatch({ keyword, type: 'addKeyword' });
        });

        const indexByTitle = looper(addTitles, trimmedSubscriptionWords);
        const indexByDescription = looper(addDescriptions, trimmedSubscriptionWords);
        const uniqueIndexByTitle = [...new Set(indexByTitle)];
        const uniqueIndexByDescription = [...new Set(indexByDescription)];
        const combinedUniqueIndexes = [...new Set([...uniqueIndexByTitle, ...uniqueIndexByDescription])];
        const keepTheseTitles: string[] = compareAndKeep({
          source: addTitles,
          toCompareWith: combinedUniqueIndexes
        });
        const keepTheseDescriptions: string[] = compareAndKeep({
          source: addDescriptions,
          toCompareWith: combinedUniqueIndexes
        });
        const keepTheseThumbnailLinks: string[] = compareAndKeep({
          source: addThumbnailLinks,
          toCompareWith: combinedUniqueIndexes
        });
        // const keepTheseVideoIds: string[] = compareAndKeep({
        //   source: addVideoIds,
        //   toCompareWith: combinedUniqueIndexes
        // });
        const keepTheseVideoPublishDates: string[] = compareAndKeep({
          source: addVideoPublishDates,
          toCompareWith: combinedUniqueIndexes
        });

        eraseAll(this, 'add');

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
          type: 'addVideoIds',
          videoIds: addVideoIds
        });

        this.props.dispatch({
          type: 'addVideoPublishDates',
          dates: keepTheseVideoPublishDates
        });

        this.props.dispatch({
          type: `stepInc`
        });
      }
    }
  };

  public render() {
    let renderThis;
    if (this.props.store.showLoader) {
      renderThis = <Loading />;
    }
    if (!this.props.store.showLoader) {
      renderThis = (
        <AddBody
          refToThis={this}
          useCase="link"
          mainText="Enter the link :"
          inputFieldText="Type or paste your link here"
        />
      );
    }

    if (this.props.store.stepCounter === 2) {
      renderThis = (
        <AddBody
          refToThis={this}
          useCase="keyword"
          mainText="Enter key-word :"
          inputFieldText="Type your key-word here"
        />
      );
    }

    if (this.props.store.stepCounter === 3) {
      renderThis = <Redirect to="/selector" />;
    }

    if (this.props.store.errorToggler) {
      renderThis = <Redirect to="/error" />;
    }

    return renderThis;
  }
}

export default connect(mapStateToProps)(Add);
