interface IAddTitlesAction {
  type: string;
  Title: string;
}

const addTitles = (state = [], action: IAddTitlesAction) => {
  if (action.type === 'addTitles') {
    const newState: string[] = [...state];
    newState.push(action.Title);
    return newState;
  }
  if (action.type === 'eraseTitles') {
    return [];
  }
  return state;
};

export default addTitles;
