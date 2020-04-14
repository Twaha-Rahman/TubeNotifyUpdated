import * as React from 'react';
import './main.css';
import { connect } from 'react-redux';
import mapStateToProps from './utilities/mapStateToProp';
import refToDb from './utilities/dbOpener';
import dbReader from './utilities/dbReader';
import dbWriter from './utilities/dbWriter';
import TogglingCard from './components/TogglingCard/TogglingCard';
import uniqueIndex from './utilities/uniqueIndex';
import subscriptionFilter from './utilities/subscriptionFilter';
import removeIndexesFromArray from './utilities/removeIndexesFromArray';
import EmptyComponent from './components/EmptyComponent/EmptyComponent';
import { Redirect } from 'react-router';
import { ReactComponent as Logo } from './media/image/empty.svg';
import requestIdleCallbackPolyfill from './polyfills/requestIdleCallback/requestIdleCallbackPolyfill';
import cancelIdleCallback from './polyfills/requestIdleCallback/cancelIdleCallback';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import linkGenerator from './utilities/linkGenerator';
import looper from './utilities/looper';
import compareAndKeep from './utilities/compareAndKeep';

class App extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props
    this.videoDeleter = this.videoDeleter.bind(this);
    this.reloadSubscriptions = this.reloadSubscriptions.bind(this);

    let myWindow: any = window;
    if ('requestIdleCallback' in window) {
      myWindow.requestIdleCallback(() => {
        // Do all feature detection here...
      });
      console.log('Supported!');
    } else {
      console.log('Unsupported!');
      myWindow.requestIdleCallback = myWindow.requestIdleCallback || requestIdleCallbackPolyfill;

      myWindow.cancelIdleCallback = myWindow.cancelIdleCallback || cancelIdleCallback;
    }

    myWindow.requestIdleCallback(() => {
      if ('serviceWorker' in navigator) {
        //sw supported
        navigator.serviceWorker.ready.then((registration: any) => {
          let serviceWorker;
          if (registration.installing) {
            serviceWorker = registration.installing;
          } else if (registration.waiting) {
            serviceWorker = registration.waiting;
          } else if (registration.active) {
            serviceWorker = registration.active;
          }

          if (serviceWorker) {
            if (serviceWorker.state === 'activated') {
              // If push subscription wasnt done yet have to do here

              registration.pushManager.getSubscription().then((pushSubscription: any) => {
                if (pushSubscription) {
                  this.props.dispatch({
                    type: 'hasSubscription'
                  });
                }
              });
            }
          }
        });
      } else {
        //sw not supported!!!
      }
    });

    refToDb
      .then(ref => {
        dbReader(ref, 'subscription').then(data => {
          if (data) {
            this.props.dispatch({
              type: 'addSubscriptions',
              subscriptions: data
            });
          } else {
            this.props.dispatch({
              type: `showError`
            });
          }
        });
      })
      .catch(() => {
        this.props.dispatch({
          type: `showError`
        });
      });
  }

  public componentWillMount() {
    this.props.dispatch({
      type: 'eraseKeywords'
    });
    this.props.dispatch({
      type: 'eraseAdditionalInfo'
    });
  }

  public componentWillUnmount() {
    this.props.dispatch({
      type: 'eraseSubscriptions'
    });
  }

  public async reloadSubscriptions() {

    try {
      
    } catch (error) {
      
    }

    const reloadSvg:(SVGElement | any) = document.querySelector('#reload-subscriptions')?.childNodes[0];

    reloadSvg.classList.add('rotate');
    

    const allQueries = await dbReader(refToDb, 'query');

    const newSubscriptionForMultipleChannels: any = [];
    

    for (const query of allQueries) {
      const { playlistId, details } = query;

      const newSubscriptions: string[][][] = [];

      const link = linkGenerator({
        playlistId,
        type: `playlistItems`,
        maxResults: 50,
        part: `snippet`
      });
      const unparsedData = await fetch(link);
      const data = await unparsedData.json();

      console.log(data);
      const newLookedUpToThisVideoTag: string = data.items[0].snippet.resourceId.videoId;
      const newDetailsArr: any[] = [];

      details.forEach((detailObj: any) => {
        const { lookedUpToThisVideoTag, keyWords } = detailObj;

        newDetailsArr.push({ lookedUpToThisVideoTag: newLookedUpToThisVideoTag, keyWords });

        let keepChecking = true;
        const titlesToProcess: string[] = [];
        const descriptionsToProcess: string[] = [];
        const videoPublishDatesToProcess: string[] = [];
        const thumbnailLinksToProcess: string[] = [];
        const videosIdsToProcess: string[] = [];
        data.items.forEach((item: any) => {
          if (item.snippet.resourceId.videoId === lookedUpToThisVideoTag) {
            keepChecking = false;
          }
          if (keepChecking) {
            titlesToProcess.push(item.snippet.title);
            descriptionsToProcess.push(item.snippet.description);

            const date = item.snippet.publishedAt.substring(0, 10);
            videoPublishDatesToProcess.push(date);

            console.log(date);
            

            thumbnailLinksToProcess.push(item.snippet.thumbnails.medium.url);
            videosIdsToProcess.push(item.snippet.resourceId.videoId);
          }
        });

        const indexByTitle = looper(titlesToProcess, keyWords);

        const indexByDescription = looper(descriptionsToProcess, keyWords);

        const combinedUniqueIndexes = [...new Set([...indexByTitle, ...indexByDescription])];

        const keepTheseTitles: string[] = compareAndKeep({
          source: titlesToProcess,
          toCompareWith: combinedUniqueIndexes
        });

        const keepTheseThumbnailLinks: string[] = compareAndKeep({
          source: thumbnailLinksToProcess,
          toCompareWith: combinedUniqueIndexes
        });

        const keepTheseVideoIds: string[] = compareAndKeep({
          source: videosIdsToProcess,
          toCompareWith: combinedUniqueIndexes
        });

        const videoLinks: string[] = [];

        keepTheseVideoIds.forEach((videoId: string) => {
          const link: string = `https://www.youtube.com/watch?v=${videoId}`;
          videoLinks.push(link);
        });

        const keepTheseVideoPublishDates: string[] = compareAndKeep({
          source: videoPublishDatesToProcess,
          toCompareWith: combinedUniqueIndexes
        });

        newSubscriptions.push([keepTheseTitles, videoLinks, keepTheseVideoPublishDates, keepTheseThumbnailLinks]);
        // change each inner array with the below mentioned variables----
        //keepTheseTitles

        //videoLinks
        //keepTheseVideoPublishDates
        //keepTheseThumbnailLinks



        
      });

      newSubscriptionForMultipleChannels.push(newSubscriptions);

      // update each query's lookedUpToVidTag here...
      query.details = newDetailsArr;
      delete query.subscriptionNo;
      this.dbWriteHelper(refToDb, 'query', query);
      
    }
    console.log(newSubscriptionForMultipleChannels);


    const allSubscriptions = await dbReader(refToDb, 'subscription');

    allSubscriptions.forEach((channelSubscriptionObj: any, channelSubscriptionObjIndex: number) => {
      channelSubscriptionObj.unseenVideoTitles.forEach((titleArr: string[], titleArrIndex: number) => {
        titleArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][titleArrIndex][0]);
        
      });
      channelSubscriptionObj.videoLinks.forEach((videoLinkArr: string[], videoLinkArrIndex: number) => {
        videoLinkArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoLinkArrIndex][1]);
        
      });

      channelSubscriptionObj.videoUploadTime.forEach((videoUploadTimeArr: string[], videoUploadTimeIndex: number) => {
        videoUploadTimeArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoUploadTimeIndex][2]);
        
      });
      channelSubscriptionObj.videoThumbnailLinks.forEach((videoThumbnailLinksArr: string[], videoThumbnailLinksArrIndex: number) => {
        videoThumbnailLinksArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoThumbnailLinksArrIndex][3]);
        
      });
    });
    
    console.log(allSubscriptions);

    this.dbWriteHelper(refToDb, 'subscription', allSubscriptions);
    

    reloadSvg.classList.remove('rotate');
  }

  public async dbWriteHelper(dbRef: any, objStore: string, data: any) {
    try {
      const ref = await dbRef;
      
      if (Array.isArray(data)) {
        for (const oneData of data) {
        await dbWriter(ref, objStore, oneData);
        }
      }  else {

        
        await dbWriter(ref, objStore, data);
      }
    } catch (error) {
      console.log(error);
      
      this.props.dispatch({
        type: `showError`
      });
    }
  }

  public async objStoreItemDeletor(dbRef: any, objStoreName: string, keyPath: string) {
    try {
      const ref = await dbRef;
      await ref.transaction(objStoreName).store.delete(keyPath);
    } catch (err) {
      this.props.dispatch({
        type: `showError`
      });
    }
  }

  public videoDeleter(link: string, thumbnailLink: string, subscriptionPart: number) {
    const data = this.props.store.addSubscriptions[subscriptionPart];
    // const indexToDelete: any = [];

    const toKeep: any[] = [];

    data.videoLinks.forEach((videoLinkArr: string[], videoLinkArrIndex: number) => {
      toKeep.push([]);
      videoLinkArr.forEach((vidLink: string) => {
        //tslint:disable
        if (link === vidLink) {
          toKeep[videoLinkArrIndex].push(false);
        } else {
          toKeep[videoLinkArrIndex].push(true);
        }
      });
    });

    data.unseenVideoTitles = subscriptionFilter(toKeep, data.unseenVideoTitles);
    data.videoThumbnailLinks = subscriptionFilter(toKeep, data.videoThumbnailLinks);
    data.videoLinks = subscriptionFilter(toKeep, data.videoLinks);
    data.videoUploadTime = subscriptionFilter(toKeep, data.videoUploadTime);

    dbReader(refToDb, 'cache-keep', 1)
      .then(res => {
        if (res) {
          let deletedCacheKeepData = res.data.filter((val: string) => {
            if (val !== thumbnailLink) {
              return true;
            } else {
              return false;
            }
          });
          this.dbWriteHelper(refToDb, 'cache-keep', { id: 1, data: deletedCacheKeepData });
        }
      })
      .catch(() => {
        this.props.dispatch({
          type: `showError`
        });
      });

    // Now the variable 'data' is the modified suscription that needs to be put in IDB

    let areArraysEmpty = true;

    data.videoLinks.forEach((arr: string[]) => {
      if (arr.length !== 0) {
        areArraysEmpty = false;
      }
    });

    if (areArraysEmpty) {
      // this.objStoreItemDeletor(refToDb, 'subscription', this.props.store.addSubscriptions[subscriptionPart].channelTag);
      // this.objStoreItemDeletor(refToDb, 'query', this.props.store.addSubscriptions[subscriptionPart].channelTag);
      refToDb
        .then(ref => {
          const tx = ref.transaction(['subscription', 'query'], 'readwrite');
          tx.objectStore('subscription').delete(this.props.store.addSubscriptions[subscriptionPart].channelTag);
          // Don't delete queries....as the user may not have any videos right now but the user hasn't deleted the query
          // tx.objectStore('query').delete(this.props.store.addSubscriptions[subscriptionPart].channelTag);
          tx.done.catch(() => {
            this.props.dispatch({
              type: `showError`
            });
          });
        })
        .catch(() => {
          this.props.dispatch({
            type: `showError`
          });
        });
    } else {
      this.dbWriteHelper(refToDb, 'subscription', data);
    }

    this.forceUpdate();
  }

  public render() {
    if (this.props.store.errorToggler) {
      return <Redirect to="/error" />;
    } else {
      if (this.props.store.addSubscriptions[0]) {
        const subscriptionsInfo = this.props.store.addSubscriptions;
        const renderThis: any = [];
        subscriptionsInfo.forEach((element: any, indexOfSubscription: number) => {
          const allUnseenVideoTitles: string[] = [];
          const allVideoThumbnailLinks: string[] = [];
          const allVideoLinks: string[] = [];
          const allVideoUploadTime: string[] = [];
          element.unseenVideoTitles.forEach((titles: any) => {
            titles.forEach((title: any) => {
              allUnseenVideoTitles.push(title);
            });
          });
          element.videoThumbnailLinks.forEach((thumbnailLinks: any) => {
            thumbnailLinks.forEach((thumbnailLink: any) => {
              allVideoThumbnailLinks.push(thumbnailLink);
            });
          });
          element.videoLinks.forEach((links: any) => {
            links.forEach((link: any) => {
              allVideoLinks.push(link);
            });
          });
          element.videoUploadTime.forEach((uploadTimes: any) => {
            uploadTimes.forEach((uploadTime: any) => {
              allVideoUploadTime.push(uploadTime);
            });
          });

          const indexesToRemove: any = uniqueIndex(allUnseenVideoTitles);

          const uniqueAllUnseenVideoTitles = removeIndexesFromArray(allUnseenVideoTitles, indexesToRemove);
          const uniqueAllVideoThumbnailLinks = removeIndexesFromArray(allVideoThumbnailLinks, indexesToRemove);
          const uniqueAllVideoLinks = removeIndexesFromArray(allVideoLinks, indexesToRemove);
          const uniqueAllVideoUploadTime = removeIndexesFromArray(allVideoUploadTime, indexesToRemove);

          renderThis.push(
            <TogglingCard
              togglingFunction={(e: any) => {
                let nodes = e.target.parentNode.childNodes;

                if (nodes.length === 2) {
                  if (
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '' ||
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '10px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';

                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '10px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                if (nodes.length === 1) {
                  nodes = e.target.parentNode.parentNode.parentNode.childNodes;

                  if (
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '' ||
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '10px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '10px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                if (nodes.length === 3) {
                  nodes = e.target.parentNode.parentNode.childNodes;
                  if (
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '' ||
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '10px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '10px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                nodes.forEach((node: any) => {
                  node.classList.forEach((className: any) => {
                    if (className === 'collapsible-card-item-container') {
                      if (node.style.display === 'none' || node.style.display === '') {
                        node.style.display = 'block';
                        // node.style.maxHeight = `inherit`;
                      } else {
                        node.style.display = 'none';
                        // node.style.maxHeight = null;
                      }
                    }
                  });
                });
              }}
              title={element.channelName}
              forceUpdater={this.forceUpdate.bind(this)}
              items={uniqueAllUnseenVideoTitles}
              channelLogoLink={element.channelLogoLink}
              deletor={this.videoDeleter}
              videoThumbnailLinks={uniqueAllVideoThumbnailLinks}
              videoLinks={uniqueAllVideoLinks}
              videoUploadTimes={uniqueAllVideoUploadTime}
              subscriptionPart={indexOfSubscription}
              key={Math.random()}
            />
          );
        });
        return (
          <div>
            {renderThis}
            <button id="reload-subscriptions" onClick={this.reloadSubscriptions}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          </div>
        );
      }
    }

    // here, rather than returning null, we'll return a custom div saying user has no subscription
    // and instruct user how to add subscription
    return <EmptyComponent text="No subscription!" svgComponent={Logo} />;
  }
}

export default connect(mapStateToProps)(App);
