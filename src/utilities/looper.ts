import matchChecker from '../utilities/matchChecker';

function looper(titleOrDescriptionArr: string[], keywordsArr: string[]) {
  const indexOfMatchedArr: number[] = [];
  titleOrDescriptionArr.forEach((titleOrDescription: string, index: number) => {
    const isMatching = matchChecker(titleOrDescription, keywordsArr);

    if (isMatching) {
      indexOfMatchedArr.push(index);
    }
  });
  return indexOfMatchedArr;
}

export default looper;
