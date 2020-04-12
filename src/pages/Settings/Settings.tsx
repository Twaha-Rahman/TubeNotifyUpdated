import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './Settings.css';

class Settings extends React.Component<any> {
  public render() {
    return (
      <div className="App">
        <h1>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus tenetur consequuntur voluptatibus ut,
          quisquam odit porro vel repudiandae vitae ipsum laudantium dolorem impedit, debitis natus maiores quae
          consectetur totam! Accusantium!
        </h1>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Settings);
