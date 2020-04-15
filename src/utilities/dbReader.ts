async function dbReader(refToDB: any, objectStore: any, id?: any) {
  try {
    const db = await refToDB;
    const tx = db.transaction(objectStore, 'readonly');

    let data;

    if (id) {
      data = await tx.objectStore(objectStore).get(id);
    } else {
      data = await tx.objectStore(objectStore).getAll();
    }

    return data;
  } catch (err) {
    console.log(err);
  }
  return null;
}

export default dbReader;
