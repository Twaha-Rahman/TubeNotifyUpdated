interface IErrorTogglerAction {
  type: string;
  signal: boolean;
}

const errorToggler = (state = false, action: IErrorTogglerAction) => {
  if (action.type === 'showError') {
    return true;
  }
  if (action.type === 'hideError') {
    return false;
  }
  return state;
};

export default errorToggler;
