function looper(toLoopBig: string[], toLoopSmall: string[]) {
  const indexOfMatched: number[] = [];
  toLoopBig.forEach((partOfBig: string, index: number) => {
    const words = partOfBig.split(` `);
    words.forEach((word: string) => {
      toLoopSmall.forEach((partOfSmall: string) => {
        const lowerCasedPartOfSmall = partOfSmall.toLocaleLowerCase();
        const lowerCasedWord = word.toLocaleLowerCase();
        if (lowerCasedWord === lowerCasedPartOfSmall) {
          indexOfMatched.push(index);
        }
      });
    });
  });
  return indexOfMatched;
}

export default looper;
