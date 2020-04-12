function removeIndexesFromArray(array: any[], indexesToRemove: any) {
  const removedArray: any[] = [];
  array.forEach((val, index) => {
    if (!indexesToRemove.includes(index)) {
      removedArray.push(val);
    }
  });

  return removedArray;
}

export default removeIndexesFromArray;
