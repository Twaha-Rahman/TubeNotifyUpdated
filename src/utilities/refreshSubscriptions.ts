import refToDb from './dbOpener';
import dbReader from './dbReader';
import linkGenerator from './linkGenerator';
import looper from './looper';
import compareAndKeep from './compareAndKeep';

async function refreshSubscription(dbWriteHelper: any, refToReloadButton: any) {
  refToReloadButton.classList.add('rotate');

  const allQueries = await dbReader(refToDb, 'query');

  const newSubscriptionForMultipleChannels: string[][][][] = [];

  for (const query of allQueries) {
    const { playlistId, details } = query;

    const newSubscriptions: string[][][] = [];

    const link = linkGenerator({
      playlistId,
      type: `playlistItems`,
      maxResults: 50,
      part: `snippet`
    });
    const unparsedData = await fetch(link);
    const data = await unparsedData.json();

    const newLookedUpToThisVideoTag: string = data.items[0].snippet.resourceId.videoId;
    const newDetailsArr: any[] = [];

    details.forEach((detailObj: any) => {
      const { lookedUpToThisVideoTag, keyWords } = detailObj;

      newDetailsArr.push({ lookedUpToThisVideoTag: newLookedUpToThisVideoTag, keyWords });

      let keepChecking = true;
      const titlesToProcess: string[] = [];
      const descriptionsToProcess: string[] = [];
      const videoPublishDatesToProcess: string[] = [];
      const thumbnailLinksToProcess: string[] = [];
      const videosIdsToProcess: string[] = [];
      data.items.forEach((item: any) => {
        if (item.snippet.resourceId.videoId === lookedUpToThisVideoTag) {
          keepChecking = false;
        }
        if (keepChecking) {
          titlesToProcess.push(item.snippet.title);
          descriptionsToProcess.push(item.snippet.description);

          const date = item.snippet.publishedAt.substring(0, 10);
          videoPublishDatesToProcess.push(date);

          thumbnailLinksToProcess.push(item.snippet.thumbnails.medium.url);
          videosIdsToProcess.push(item.snippet.resourceId.videoId);
        }
      });

      const indexByTitle = looper(titlesToProcess, keyWords);

      const indexByDescription = looper(descriptionsToProcess, keyWords);

      const combinedUniqueIndexes = [...new Set([...indexByTitle, ...indexByDescription])];

      const keepTheseTitles: string[] = compareAndKeep({
        source: titlesToProcess,
        toCompareWith: combinedUniqueIndexes
      });

      const keepTheseThumbnailLinks: string[] = compareAndKeep({
        source: thumbnailLinksToProcess,
        toCompareWith: combinedUniqueIndexes
      });

      const keepTheseVideoIds: string[] = compareAndKeep({
        source: videosIdsToProcess,
        toCompareWith: combinedUniqueIndexes
      });

      const videoLinks: string[] = [];

      keepTheseVideoIds.forEach((videoId: string) => {
        const link: string = `https://www.youtube.com/watch?v=${videoId}`;
        videoLinks.push(link);
      });

      const keepTheseVideoPublishDates: string[] = compareAndKeep({
        source: videoPublishDatesToProcess,
        toCompareWith: combinedUniqueIndexes
      });

      newSubscriptions.push([keepTheseTitles, videoLinks, keepTheseVideoPublishDates, keepTheseThumbnailLinks]);
      // newSubscriptions.push([['sas', 'sdd'], ['sas', 'sdd'], ['sas', 'sdd'], ['sas', 'sdd']]);
    });

    newSubscriptionForMultipleChannels.push(newSubscriptions);

    // update each query's lookedUpToVidTag here...
    query.details = newDetailsArr;
    delete query.subscriptionNo;
    dbWriteHelper(refToDb, 'query', query);
  }

  const allSubscriptions = await dbReader(refToDb, 'subscription');

  allSubscriptions.forEach((channelSubscriptionObj: any, channelSubscriptionObjIndex: number) => {
    if (newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][0][0].length === 0) {
      return;
    }
    channelSubscriptionObj.unseenVideoTitles.forEach((titleArr: string[], titleArrIndex: number) => {
      titleArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][titleArrIndex][0]);
    });
    channelSubscriptionObj.videoLinks.forEach((videoLinkArr: string[], videoLinkArrIndex: number) => {
      videoLinkArr.push(...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoLinkArrIndex][1]);
    });

    channelSubscriptionObj.videoUploadTime.forEach((videoUploadTimeArr: string[], videoUploadTimeIndex: number) => {
      videoUploadTimeArr.push(
        ...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoUploadTimeIndex][2]
      );
    });
    channelSubscriptionObj.videoThumbnailLinks.forEach(
      (videoThumbnailLinksArr: string[], videoThumbnailLinksArrIndex: number) => {
        videoThumbnailLinksArr.push(
          ...newSubscriptionForMultipleChannels[channelSubscriptionObjIndex][videoThumbnailLinksArrIndex][3]
        );
      }
    );
  });

  dbWriteHelper(refToDb, 'subscription', allSubscriptions);
  refToReloadButton.classList.remove('rotate');
}

export default refreshSubscription;
