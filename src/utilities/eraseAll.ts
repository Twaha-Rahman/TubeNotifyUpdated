function eraseAll(refToThis: any, scene: string) {
  refToThis.props.dispatch({
    type: `eraseTitles`
  });

  refToThis.props.dispatch({
    type: `eraseDescriptions`
  });

  refToThis.props.dispatch({
    type: `eraseThumbnailLinks`
  });

  refToThis.props.dispatch({
    type: `eraseVideoIds`
  });

  refToThis.props.dispatch({
    type: `eraseVideoPublishDates`
  });
  if (scene === 'selector') {
    refToThis.props.dispatch({
      type: 'eraseRequestLink'
    });
  }
}

export default eraseAll;
