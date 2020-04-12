import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Add from './pages/Add/Add';
import Delete from './pages/Delete/Delete';
import Settings from './pages/Settings/Settings';
import About from './pages/About/About';
import App from './App';
import Navbar from './components/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Selector from './pages/Selector/Selector';
import FinalStep from './pages/FinalStep/FinalStep';
import AskForPermission from './pages/AskForPermission/AskForPermission';

import { Provider } from 'react-redux';
import * as Router from 'react-router-dom';
import Store from './store';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={Store}>
    <Router.BrowserRouter>
      <div className="main-body">
        <Router.Route exact={true} component={Navbar} />
        <Router.Route exact={true} path="/" component={App} />
        <Router.Route exact={true} path="/add" component={Add} />
        <Router.Route exact={true} path="/delete" component={Delete} />
        <Router.Route exact={true} path="/settings" component={Settings} />
        <Router.Route exact={true} path="/about" component={About} />
        <Router.Route exact={true} path="/error" component={ErrorPage} />
        <Router.Route exact={true} path="/selector" component={Selector} />
        <Router.Route exact={true} path="/final" component={FinalStep} />
        <Router.Route exact={true} path="/ask" component={AskForPermission} />
      </div>
    </Router.BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
