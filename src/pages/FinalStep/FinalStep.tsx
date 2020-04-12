import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './FinalStep.css';
import { Redirect } from 'react-router';
import * as Router from 'react-router-dom';
import Button from '../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import urlBase64ToUint8Array from '../../utilities/urlBase64ToUint8Array';
import publicVapidKey from '../../api_keys/publicVapidKey';

class FinalStep extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props

    if (Notification.permission === 'granted') {
      // proceed with subscribing

      navigator.serviceWorker.ready
        .then(registration => {
          console.log(registration);
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
            console.log('sw current state', serviceWorker.state);
            if (serviceWorker.state === 'activated') {
              // If push subscription wasnt done yet have to do here
              console.log('sw already activated - Do watever needed here');
              /////////////
              registration.pushManager.getSubscription().then(pushSubscription => {
                console.log(pushSubscription);

                if (!pushSubscription) {
                  // user isn't subcribed to any notification
                  registration.pushManager
                    .subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                    })
                    .then(subscription => {
                      console.log(subscription);

                      fetch('http://localhost:3005/api/init', {
                        method: 'POST',
                        body: JSON.stringify(subscription),
                        headers: {
                          'content-type': 'application/json'
                        }
                      });
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
                registration.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                  })
                  .then(subscription => {
                    console.log(subscription);

                    fetch('http://localhost:3005/api/init', {
                      method: 'POST',
                      body: JSON.stringify(subscription),
                      headers: {
                        'content-type': 'application/json'
                      }
                    });
                  });
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
    } else {
      //ask for permission and then proceed with subscribing
      // Notification.requestPermission().then(status => {
      //   if (status === 'granted') {
      //     // proceed with subscribing
      //     console.log(status);
      //   }
      // });
    }
  }

  public componentWillUnmount() {
    this.props.dispatch({
      type: 'eraseAdditionalInfo'
    });

    this.props.dispatch({
      type: 'eraseKeywords'
    });
  }

  public render() {
    if (this.props.store.errorToggler) {
      return <Redirect to="/error" />;
    }

    let wordNodes = '';
    const len = this.props.store.addKeyword.length;
    let singularOrPlural = 'keyword';
    if (len > 1) {
      singularOrPlural = 'keywords';
    }
    this.props.store.addKeyword.forEach((val: string, index: number) => {
      if (index === 0) {
        wordNodes += val;
      } else {
        if (index === len) {
          wordNodes += ` and ${val}`;
        } else {
          wordNodes += `, ${val}`;
        }
      }
    });

    return (
      <div className="final-step">
        <h1>Congratulations!</h1>
        <div className="success-info">
          <h4>
            Your subscription has been set up for the channel{' '}
            <span>{this.props.store.addAdditionalInfo.channelName}</span> with the {singularOrPlural}:{' '}
            <span>{wordNodes}</span>. You'll get notified when{' '}
            <span>{this.props.store.addAdditionalInfo.channelName}</span> uploads a video with a title that includes the{' '}
            {singularOrPlural}. You will get all the notifications on this device. If you want to get notifications on
            other devices besides this device, then go to <span>Settings</span> and copy the <span>UID</span>. Then,
            open <span>TubeNotify</span> on the other device and navigate to the <span>Settings</span> page and click on{' '}
            <span>Sync Notifications Across Devices</span>. Then type code shown on the other device and press the next
            button. You can connect multiple devices this way to get the same notification across multiple devices. If
            you want to disable this feature, you can do so from <span>Settings</span>.
          </h4>
        </div>

        <div className="warning-info">
          <h3>
            <FontAwesomeIcon className="warning-svg" icon={faExclamationTriangle} color="#f9a825" />
            Warning
            <FontAwesomeIcon className="warning-svg" icon={faExclamationTriangle} color="#f9a825" />
          </h3>
          <div>
            <h4>
              <em>Please note that: if you deny the notification permission, this app can't send you notifications!</em>
            </h4>
          </div>
        </div>

        <Router.Link to="/">
          <Button expadedButton={true} buttonMessage="Finish" buttonIcon={faCheck} />
        </Router.Link>
      </div>
    );
  }
}

export default connect(mapStateToProps)(FinalStep);
