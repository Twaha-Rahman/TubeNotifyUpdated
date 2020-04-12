import { createStore, combineReducers } from 'redux';
import addKeyword from './modules/addKeyword';
import addTitles from './modules/addTitles';
import showLoader from './modules/showLoader';
import stepCounter from './modules/stepCounter';
import addDescriptions from './modules/addDescriptions';
import addThumbnailLinks from './modules/addThumbnailLinks';
import errorToggler from './modules/errorToggler';
import currentlySelected from './modules/currentlySelected';
import requestLink from './modules/requestLink';
import addAdditionalInfo from './modules/addAdditionalInfo';
import addSubscriptions from './modules/addSubscriptions';
import addQueries from './modules/addQueries';
import addVideoPublishDates from './modules/addVideoPublishDates';
import addVideoIds from './modules/addVideoIds';
import hasPermission from './modules/hasPermission';

const reducers = combineReducers({
  addAdditionalInfo,
  addDescriptions,
  addQueries,
  addKeyword,
  addSubscriptions,
  addThumbnailLinks,
  addTitles,
  addVideoIds,
  addVideoPublishDates,
  currentlySelected,
  hasPermission,
  errorToggler,
  requestLink,
  showLoader,
  stepCounter
});

const Store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default Store;
