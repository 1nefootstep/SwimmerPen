import { createStore, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { rootReducer, RootState } from './reducers';
import { AppActionTypes } from './types';

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, unknown, AppActionTypes>;