interface IAddQueriesAction {
  type: string;
  queries: any[];
}

const addQueries = (state = [], action: IAddQueriesAction) => {
  if (action.type === 'addQueries') {
    const newState: any = [...state];
    action.queries.forEach((query: any) => {
      newState.push(query);
    });
    return newState;
  }

  if (action.type === 'eraseQueries') {
    return [];
  }

  return state;
};

export default addQueries;
