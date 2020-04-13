function looper(titleOrDescription: string[], keywordsArr: string[]) {
  const indexOfMatchedArr: number[] = [];
  titleOrDescription.forEach((partOfBig: string, index: number) => {
    const words = partOfBig.split(` `);
    words.forEach((word: string) => {
      keywordsArr.forEach((keyword: string) => {
        const lowerCasedPartOfSmall = keyword.toLowerCase();
        const lowerCasedWord = word.toLowerCase();
        if (lowerCasedWord === lowerCasedPartOfSmall) {
          indexOfMatchedArr.push(index);
        }
      });
    });
  });
  return indexOfMatchedArr;
}

export default looper;
