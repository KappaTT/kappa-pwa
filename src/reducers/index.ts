import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import auth, { TAuthState } from './auth';
import kappa, { TKappaState } from './kappa';
import prefs, { TPrefState } from './pref';
import ui, { TUIState } from './ui';

export interface TRedux {
  auth: TAuthState;
  kappa: TKappaState;
  prefs: TPrefState;
  ui: TUIState;
}

export const reducers = combineReducers({
  auth,
  kappa,
  prefs,
  ui
});

export default createStore(reducers, applyMiddleware(ReduxThunk));
