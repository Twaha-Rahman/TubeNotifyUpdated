interface IAddKeyword {
  type: string;
  keyword: string;
}

const addKeyword = (state = [], action: IAddKeyword) => {
  if (action.type === 'addKeyword') {
    const newState: string[] = [...state];
    newState.push(action.keyword);
    return newState;
  }
  if (action.type === 'eraseKeywords') {
    return [];
  }
  return state;
};

export default addKeyword;
