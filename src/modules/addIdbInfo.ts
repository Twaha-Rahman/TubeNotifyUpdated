interface IAddIdbInfo {
  type: string;
  idbInfo: any;
}

const addIdbInfo = (state = false, action: IAddIdbInfo) => {
  if (action.type === 'addIdbInfo') {
    const newState = action.idbInfo;

    return newState;
  }
  if (action.type === 'eraseIdbInfo') {
    return {};
  }
  return state;
};

export default addIdbInfo;
