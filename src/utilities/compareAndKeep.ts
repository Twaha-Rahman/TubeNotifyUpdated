interface ICompareAndKeep {
  toCompareWith: number[];
  source: string[];
}

function compareAndKeep(passed: ICompareAndKeep) {
  const toCompareWith = passed.toCompareWith;
  const source = passed.source;
  const keep: string[] = [];

  for (const combinedUniqueIndex of toCompareWith) {
    keep.push(source[combinedUniqueIndex]);
  }

  return keep;
}

export default compareAndKeep;
