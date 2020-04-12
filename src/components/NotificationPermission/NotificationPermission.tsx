import * as React from 'react';
import { ReactComponent as Logo } from '../../media/image/notification.svg';
import EmptyComponent from '../EmptyComponent/EmptyComponent';
import './NotificationPermission.css';
import Button from '../Button/Button';
import { faPowerOff, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import urlBase64ToUint8Array from '../../utilities/urlBase64ToUint8Array';
import publicVapidKey from '../../api_keys/publicVapidKey';

interface INotificationPermission {
  dispatcher: any;
}

const NotificationPermission: React.SFC<INotificationPermission> = props => {
  return (
    <div className="notification-permission">
      <h1>Enable Notification</h1>
      <EmptyComponent svgComponent={Logo} />
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
                          }).catch(() => {
                            console.log(props);

                            // props.dispatcher({
                            //   type: `showError`
                            // });
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
                        }).catch(() => {
                          console.log(props);

                          //   props.dispatcher({
                          //     type: `showError`
                          //   });
                        });
                      });
                  }
                });
              }
              //////////////
            })
            .catch(err => {
              console.log('errr/...........................');

              props.dispatcher({
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
};

export default NotificationPermission;
