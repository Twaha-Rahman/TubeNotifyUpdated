interface IAddVideoIdsAction {
  type: string;
  videoIds: string[];
}

const addVideoIds = (state = [], action: IAddVideoIdsAction) => {
  if (action.type === 'addVideoIds') {
    const newState: string[] = [...state];
    action.videoIds.forEach(videoId => {
      newState.push(videoId);
    });
    return newState;
  }
  if (action.type === 'eraseVideoIds') {
    return [];
  }
  return state;
};

export default addVideoIds;
