import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './AskForPermission.css';
import { Redirect } from 'react-router-dom';
import { ReactComponent as Logo } from '../../media/image/notification.svg';
import Button from '../../components/Button/Button';
import { faPowerOff, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import urlBase64ToUint8Array from '../../utilities/urlBase64ToUint8Array';
import publicVapidKey from '../../api_keys/publicVapidKey';
import dbWriter from '../../utilities/dbWriter';
import refToDb from '../../utilities/dbOpener';
import Loading from '../../components/Loading/Loading';
import dbReader from '../../utilities/dbReader';

class AskForPermission extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props

    this.pushNotificationSetter = this.pushNotificationSetter.bind(this);
  }

  public pushNotificationSetter(refToRegistration: any) {
    this.props.dispatch({
      type: 'showLoader'
    });

    refToRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
      .then((subscription: any) => {
        fetch('http://localhost:3005/api/init', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then((resObj: any) => {
            throw new Error('fdsfffsdfsdf');

            resObj.json().then((data: any) => {
              console.log(data);

              if (data.uid) {
                // recieved uid.....save it to idb

                const generalObj = {
                  uid: data.uid
                };

                dbWriter(refToDb, 'general', generalObj).catch(() => {
                  this.props.dispatch({
                    type: `showError`
                  });
                });

                dbReader(refToDb, 'query')
                  .then((queries: any) => {
                    const queryObjToSend = {
                      uid: data.uid,
                      queries
                    };
                    fetch('http://localhost:3005/api/query', {
                      method: 'POST',
                      body: JSON.stringify(queryObjToSend),
                      headers: {
                        'content-type': 'application/json'
                      }
                    })
                      .then(err => {
                        console.log(err);
                        this.props.dispatch({
                          type: `hideLoader`
                        });
                      })
                      .catch(err => {
                        console.log(err);

                        this.props.dispatch({
                          type: `showError`
                        });
                      });
                  })
                  .catch(err => {
                    console.log(err);

                    this.props.dispatch({
                      type: `showError`
                    });
                  });
              }
              this.props.dispatch({
                type: 'hasSubscription'
              });
            });
          })
          .catch(err => {
            console.log(err);

            this.props.dispatch({
              type: `showError`
            });
          });
      });
  }

  public render() {
    if (this.props.store.errorToggler) {
      return <Redirect to="/error" />;
    }

    if (this.props.store.hasSubscription && !this.props.store.showLoader) {
      return <Redirect to="/final" />;
    }

    if (this.props.store.showLoader) {
      return <Loading />;
    }

    return (
      <div className="notification-permission">
        <h1>Enable Notification</h1>
        <Logo width="90%" height="auto" />
        <div className="notification-permission-body">
          <h2>Why do I need to enable Notification?</h2>
          <p>To deliver you with notifications according to your subscription, we need you to enable notification.</p>
          <p>If you don't enable notification, we can't notify you accordingly.</p>
        </div>

        <Button
          buttonMessage="Enable Notification"
          clickHandler={() => {
            navigator.serviceWorker.ready
              .then(registration => {
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

                    registration.pushManager.getSubscription().then(pushSubscription => {
                      if (!pushSubscription) {
                        // user isn't subcribed to any notification
                        this.pushNotificationSetter(registration);
                      } else {
                        this.props.dispatch({
                          type: 'hasSubscription'
                        });
                      }
                    });
                  }
                  serviceWorker.addEventListener('statechange', (e: any) => {
                    console.log('sw statechange : ', e.target.state);
                    if (e.target.state === 'activated') {
                      // use pushManger for subscribing here.

                      this.pushNotificationSetter(registration);
                    }
                  });
                }
              })
              .catch(err => {
                this.props.dispatch({
                  type: `showError`
                });
              });
          }}
          buttonIcon={faPowerOff}
        />
        <Link to="/">
          <Button buttonMessage="Don't Enable Notification" buttonIcon={faTimes} />
        </Link>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AskForPermission);
