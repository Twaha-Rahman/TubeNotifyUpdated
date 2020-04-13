interface IAddAdditionalInfoAction {
  type: string;
  action?: any;
  channelName?: string;
  channelLogoLink?: string;
  channelTag?: string;
  playlistID?: string;
  lookedUpToThisVideoTag?: string;
}

const addAdditionalInfo = (state: any = {}, action: IAddAdditionalInfoAction) => {
  if (action.type === 'addAdditionalInfo') {
    if (action.channelName == null) {
      action.channelName = state.channelName;
    }
    if (action.channelLogoLink == null) {
      action.channelLogoLink = state.channelLogoLink;
    }
    if (action.channelTag == null) {
      action.channelTag = state.channelTag;
    }
    if (action.playlistID == null) {
      action.playlistID = state.playlistID;
    }
    if (action.lookedUpToThisVideoTag == null) {
      action.lookedUpToThisVideoTag = state.lookedUpToThisVideoTag;
    }

    const newState = {
      channelName: action.action.channelName,
      channelLogoLink: action.action.channelLogoLink,
      channelTag: action.action.channelTag,
      playlistID: action.action.playlistID,
      lookedUpToThisVideoTag: action.action.lookedUpToThisVideoTag
    };

    return newState;
  }

  if (action.type === 'eraseAdditionalInfo') {
    return {};
  }
  return state;
};

export default addAdditionalInfo;
