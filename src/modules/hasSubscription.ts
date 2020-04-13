interface IHasSubscriptionAction {
  type: string;
  signal: boolean;
}

const hasSubscription = (state = false, action: IHasSubscriptionAction) => {
  if (action.type === 'hasSubscription') {
    return true;
  }
  if (action.type === `noSubscription`) {
    return false;
  }
  return state;
};

export default hasSubscription;
