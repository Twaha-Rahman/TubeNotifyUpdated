interface ICurrentlySelectedAction {
  type: string;
  number: number;
}

const currentlySelected = (state = 0, action: ICurrentlySelectedAction) => {
  if (action.type === `currentlySelected`) {
    const newState = action.number;
    return newState;
  }
  if (action.type === `eraseCurrentlySelected`) {
    return 0;
  }
  return state;
};

export default currentlySelected;
