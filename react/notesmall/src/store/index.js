import { createStore } from 'redux';
import documentReducer from '../reducers/document';

const store = createStore(documentReducer);

export default store;