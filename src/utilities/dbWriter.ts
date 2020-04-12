async function dbWriter(refToDB: any, objStorName: string, objToWrite: any) {
  const reference = await refToDB;
  const transaction = reference.transaction(objStorName, 'readwrite');
  const objectStore: any = transaction.objectStore(objStorName);
  objectStore.put(objToWrite);
  const status = await transaction.done;
  return status;
}

export default dbWriter;
