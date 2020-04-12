interface IRequestLink {
  type: string;
  link: string;
  nextPageToken: string;
}

const requestLink = (state = {}, action: IRequestLink) => {
  if (action.type === 'requestLink') {
    const newState = {
      link: action.link,
      nextPageToken: action.nextPageToken
    };
    return newState;
  }
  if (action.type === 'eraseRequestLink') {
    return {};
  }
  return state;
};

export default requestLink;
