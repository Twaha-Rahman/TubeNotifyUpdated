interface IAddSubscriptionsAction {
  type: string;
  subscriptions: [];
}

const addSubscriptions = (state = [], action: IAddSubscriptionsAction) => {
  if (action.type === 'addSubscriptions') {
    const newState: any = [...state];
    action.subscriptions.forEach(sub => {
      newState.push(sub);
    });
    return newState;
  }

  if (action.type === 'eraseSubscriptions') {
    return [];
  }

  return state;
};

export default addSubscriptions;
