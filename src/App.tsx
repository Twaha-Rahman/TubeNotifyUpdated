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

class App extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props
    this.videoDeleter = this.videoDeleter.bind(this);

    navigator.serviceWorker.ready.then((registration: any) => {
      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
        // console.log('Service worker installing');
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        // console.log('Service worker installed & waiting');
      } else if (registration.active) {
        serviceWorker = registration.active;
      }

      if (serviceWorker) {
        if (serviceWorker.state === 'activated') {
          // If push subscription wasnt done yet have to do here

          /////////////
          registration.pushManager.getSubscription().then((pushSubscription: any) => {
            console.log(pushSubscription);

            if (pushSubscription) {
              this.props.dispatch({
                type: 'hasPermission'
              });
            }
          });

          ////////////
        }
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
            // throw new Error('Something went wrong while reading IDB!!!');
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

  public async dbWriteHelper(dbRef: any, objStore: string, obj: any) {
    console.log(await dbRef, obj);

    try {
      const ref = await dbRef;
      await dbWriter(ref, objStore, obj);
    } catch (error) {
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
    console.log(this.props.store.addSubscriptions[subscriptionPart].videoLinks);

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

    console.log(toKeep);

    data.unseenVideoTitles = subscriptionFilter(toKeep, data.unseenVideoTitles);
    data.videoThumbnailLinks = subscriptionFilter(toKeep, data.videoThumbnailLinks);
    data.videoLinks = subscriptionFilter(toKeep, data.videoLinks);
    data.videoUploadTime = subscriptionFilter(toKeep, data.videoUploadTime);

    dbReader(refToDb, 'cache-keep', 1)
      .then(res => {
        if (res) {
          let deletedCacheKeepData = res.data.filter((val: string) => {
            if (val !== thumbnailLink) {
              console.log('b1');

              return true;
            } else {
              console.log('b2');
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

    console.log(data.videoLinks);

    let areArraysEmpty = true;

    data.videoLinks.forEach((arr: string[]) => {
      if (arr.length !== 0) {
        areArraysEmpty = false;
      }
    });

    console.log(areArraysEmpty);

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

    if (!this.props.store.showLoader) {
      this.props.dispatch({
        type: 'showLoader'
      });
      this.props.dispatch({
        type: 'hideLoader'
      });
    } else {
      this.props.dispatch({
        type: 'showLoader'
      });
      this.props.dispatch({
        type: 'hideLoader'
      });
    }
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

          console.log(indexesToRemove);

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
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '20px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';
                    console.log(nodes[0].childNodes);

                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '20px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                if (nodes.length === 1) {
                  nodes = e.target.parentNode.parentNode.parentNode.childNodes;

                  if (
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '' ||
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '20px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '20px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                if (nodes.length === 3) {
                  nodes = e.target.parentNode.parentNode.childNodes;
                  if (
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '' ||
                    nodes[0].childNodes[0].style.borderBottomLeftRadius === '20px'
                  ) {
                    nodes[0].childNodes[2].style.transform = 'rotate(180deg)';
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '0px';
                  } else {
                    nodes[0].childNodes[0].style.borderBottomLeftRadius = '20px';
                    nodes[0].childNodes[2].style.transform = 'rotate(0deg)';
                  }
                }

                nodes.forEach((node: any) => {
                  node.classList.forEach((className: any) => {
                    if (className === 'collapsible-card-item-container') {
                      if (node.style.display === 'none' || node.style.display === '') {
                        node.style.display = 'block';
                        node.style.maxHeight = `${node.scrollHeight}px`;
                      } else {
                        node.style.display = 'none';
                        node.style.maxHeight = null;
                      }
                    }
                  });
                });
              }}
              title={element.channelName}
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
        return renderThis;
      }
    }

    // here, rather than returning null, we'll return a custom div saying user has no subscription
    // and instruct user how to add subscription
    return <EmptyComponent text="No subscription!" svgComponent={Logo} />;
  }
}

export default connect(mapStateToProps)(App);
