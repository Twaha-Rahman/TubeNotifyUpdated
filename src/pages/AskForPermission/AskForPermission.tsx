import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './AskForPermission.css';
import { Redirect } from 'react-router-dom';
import { ReactComponent as Logo } from '../../media/image/notification.svg';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import Button from '../../components/Button/Button';
import { faPowerOff, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import urlBase64ToUint8Array from '../../utilities/urlBase64ToUint8Array';
import publicVapidKey from '../../api_keys/publicVapidKey';

class AskForPermission extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props

    this.pushNotificationSetter = this.pushNotificationSetter.bind(this);
  }

  public pushNotificationSetter(refToRegistration: any) {
    refToRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
      .then((subscription: any) => {
        console.log(subscription);

        fetch('http://localhost:3005/api/init', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then(() => {
            console.log("Everything went as it should've!!!");
            this.props.dispatch({
              type: 'hasPermission'
            });
          })
          .catch(() => {
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

    if (this.props.store.hasPermission) {
      return <Redirect to="/final" />;
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
                //////////

                let serviceWorker;
                if (registration.installing) {
                  serviceWorker = registration.installing;
                  // console.log('Service worker installing');
                } else if (registration.waiting) {
                  serviceWorker = registration.waiting;
                  // console.log('Service worker installed & waiting');
                } else if (registration.active) {
                  serviceWorker = registration.active;
                  console.log('Service worker active');
                }

                if (serviceWorker) {
                  if (serviceWorker.state === 'activated') {
                    // If push subscription wasnt done yet have to do here

                    /////////////
                    registration.pushManager.getSubscription().then(pushSubscription => {
                      console.log(pushSubscription);

                      if (!pushSubscription) {
                        // user isn't subcribed to any notification
                        this.pushNotificationSetter(registration);
                      } else {
                        this.props.dispatch({
                          type: 'hasPermission'
                        });
                      }
                    });

                    ////////////
                  }
                  serviceWorker.addEventListener('statechange', (e: any) => {
                    console.log('sw statechange : ', e.target.state);
                    if (e.target.state === 'activated') {
                      // use pushManger for subscribing here.
                      console.log('Just now activated. now we can subscribe for push notification');
                      console.log('start');
                      this.pushNotificationSetter(registration);
                    }
                  });
                }
                //////////////
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
          <Button buttonMessage="Cancel" buttonIcon={faTimes} />
        </Link>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AskForPermission);
