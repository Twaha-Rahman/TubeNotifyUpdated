interface IAddThumbnailLinksAction {
  type: string;
  ThumbnailLink: string;
}

const addThumbnailLinks = (state = [], action: IAddThumbnailLinksAction) => {
  if (action.type === 'addThumbnailLinks') {
    const newState: string[] = [...state];
    newState.push(action.ThumbnailLink);
    return newState;
  }

  if (action.type === 'eraseThumbnailLinks') {
    return [];
  }

  return state;
};

export default addThumbnailLinks;
