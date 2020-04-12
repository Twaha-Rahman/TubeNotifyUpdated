interface IAddVideoPublishDatesAction {
  type: string;
  dates: string[];
}

const addVideoPublishDates = (state = [], action: IAddVideoPublishDatesAction) => {
  if (action.type === 'addVideoPublishDates') {
    const newState: string[] = [...state];
    action.dates.forEach(date => {
      newState.push(date);
    });
    return newState;
  }
  if (action.type === 'eraseVideoPublishDates') {
    return [];
  }
  return state;
};

export default addVideoPublishDates;
