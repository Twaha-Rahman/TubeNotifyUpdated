interface IHasPermissionAction {
  type: string;
  signal: boolean;
}

const hasPermission = (state = false, action: IHasPermissionAction) => {
  if (action.type === 'hasPermission') {
    return true;
  }
  if (action.type === `noPermission`) {
    return false;
  }
  return state;
};

export default hasPermission;
