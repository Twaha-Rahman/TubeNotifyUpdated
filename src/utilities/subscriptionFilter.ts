export default function subscriptionFilter(boolNestedArr: any[], dataArr: any[]) {
  const keep: any[] = [];

  boolNestedArr.forEach((nestedArr: any[], outerIndex: number) => {
    keep.push([]);
    nestedArr.forEach((decision: boolean[], innerIndex: number) => {
      if (decision) {
        keep[outerIndex].push(dataArr[outerIndex][innerIndex]);
      }
    });
  });

  return keep;
}
