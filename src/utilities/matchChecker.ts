function matchChecker(str: string, keywords: string[]) {
  const excludedWords: string[] = ['playlist', 'episodes', "let's"];
  const regexToMatchAllEmojis = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const refinedStr = str.replace(regexToMatchAllEmojis, ' ');
  const words = refinedStr.toLowerCase().split(' ');
  keywords.forEach((keyword: String) => {
    words.forEach((word: string, index: number, wordsArr: string[]) => {
      if (word === keyword) {
        const nextWord = wordsArr[index + 1];
        if (!excludedWords.includes(nextWord)) {
          return true;
        }
      }
    });
  });
}

export default matchChecker;
