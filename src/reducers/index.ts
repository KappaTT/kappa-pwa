import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import auth, { TAuthState } from './auth';
import kappa, { TKappaState } from './kappa';
import prefs, { TPrefState } from './pref';

export interface TRedux {
  auth: TAuthState;
  kappa: TKappaState;
  prefs: TPrefState;
}

export const reducers = combineReducers({
  auth,
  kappa,
  prefs
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
