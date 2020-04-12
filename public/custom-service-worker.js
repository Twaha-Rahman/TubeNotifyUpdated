this.addEventListener('push', e => {
  if (!Notification || Notification.permission !== 'granted') {
    console.log('Notification not available or permission not granted...');

    return;
  }

  const data = e.data.json();
  console.log(data);

  console.log('Push Recieved...');
  this.registration.showNotification(data.title, {
    body: data.body,
    icon: '512.png',
    tag: data.tag,
    vibrate: [200, 100, 200, 100, 200, 100, 200]
  });
});
