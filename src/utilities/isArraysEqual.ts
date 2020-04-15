function isArraysEqual(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) {
    return false;
  } else {
    const sortedArr1 = arr1.sort();
    const sortedArr2 = arr2.sort();
    const matchCount: any[] = [];

    arr1.forEach((val, index) => {
      if (sortedArr1[index] === sortedArr2[index]) {
        matchCount.push(true);
      }
    });

    if (matchCount.length === arr1.length) {
      return true;
    } else {
      return false;
    }
  }
}

export default isArraysEqual;
