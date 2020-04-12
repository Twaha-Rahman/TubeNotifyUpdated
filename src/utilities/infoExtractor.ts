function infoExtractor(response: any) {
  const videoInfoArray = response.items;
  const descriptions: string[] = [];
  const thumbnailLinks: string[] = [];
  const titles: string[] = [];
  videoInfoArray.forEach((abc: any) => {
    titles.push(abc.snippet.title);
    descriptions.push(abc.snippet.description);
    thumbnailLinks.push(abc.snippet.thumbnails.medium.url);
  });
}

export default infoExtractor;
