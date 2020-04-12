function uniqueIndex(para: string[]) {
  const unique = [...new Set(para)];
  const count: any = {};
  const cloneIndex: number[] = [];
  para.forEach((element: string, index: number) => {
    unique.forEach((val: string) => {
      if (val === element) {
        if (count[element] === null || count[element] === undefined) {
          count[element] = 0;
        } else {
          count[element] += 1;
        }
        if (count[element] > 0) {
          cloneIndex.push(index);
        }
      }
    });
  });
  return cloneIndex;
}

export default uniqueIndex;
