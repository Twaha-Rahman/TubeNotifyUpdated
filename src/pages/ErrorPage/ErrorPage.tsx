import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

class ErrorPage extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props
    this.props.dispatch({
      type: `hideError`
    });
  }

  public render() {
    return <ErrorMessage />;
  }

  public componentWillUnmount() {
    this.props.dispatch({
      type: 'eraseKeywords'
    });
    this.props.dispatch({
      type: 'eraseAdditionalInfo'
    });
    this.props.dispatch({
      type: 'eraseSubscriptions'
    });
  }
}

export default connect(mapStateToProps)(ErrorPage);
