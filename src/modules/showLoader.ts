interface IShowLoaderAction {
  type: string;
  signal: boolean;
}

const showLoader = (state = false, action: IShowLoaderAction) => {
  if (action.type === 'showLoader') {
    return true;
  }
  if (action.type === `hideLoader`) {
    return false;
  }
  return state;
};

export default showLoader;
