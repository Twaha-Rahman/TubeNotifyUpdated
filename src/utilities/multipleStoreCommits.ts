interface IMultipleStoreCommits {
  refToDispatcher: any;
  arrayToCommit: string[];
  commitName: string;
}

function multipleStoreCommits(passed: IMultipleStoreCommits) {
  for (const thing of passed.arrayToCommit) {
    passed.refToDispatcher({
      [passed.commitName]: thing,
      type: `add${passed.commitName}s`
    });
  }
}

export default multipleStoreCommits;
