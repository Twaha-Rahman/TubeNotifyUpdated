import { openDB } from 'idb';

const refToDb = openDB(`TubeDB`, 1, {
  upgrade(db, oldVerNum, newVerNum, tx) {
    if (!db.objectStoreNames.contains(`subscription`)) {
      db.createObjectStore(`subscription`, {
        keyPath: `channelTag`
      });
    }
    if (!db.objectStoreNames.contains(`general`)) {
      db.createObjectStore(`general`, { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains(`last-updated`)) {
      db.createObjectStore(`last-updated`, { keyPath: 'channelTag' });
    }
    if (!db.objectStoreNames.contains(`query`)) {
      db.createObjectStore(`query`, { keyPath: 'channelTag' });
    }
    if (!db.objectStoreNames.contains(`cache-history`)) {
      db.createObjectStore(`cache-history`, {
        keyPath: 'id',
        autoIncrement: true
      });
    }
    if (!db.objectStoreNames.contains(`cache-keep`)) {
      db.createObjectStore(`cache-keep`, {
        keyPath: 'id',
        autoIncrement: true
      });
    }
    if (!db.objectStoreNames.contains('setting')) {
      db.createObjectStore('setting', {
        keyPath: 'id',
        autoIncrement: true
      });
    }
  }
});

export default refToDb;
