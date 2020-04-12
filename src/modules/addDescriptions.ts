interface IAddDescriptionsAction {
  type: string;
  Description: string;
}

const addDescriptions = (state = [], action: IAddDescriptionsAction) => {
  if (action.type === 'addDescriptions') {
    const newState: string[] = [...state];
    newState.push(action.Description);
    return newState;
  }

  if (action.type === 'eraseDescriptions') {
    return [];
  }

  return state;
};

export default addDescriptions;
