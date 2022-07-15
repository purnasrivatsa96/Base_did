
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import React from 'react';
import ReactDOM from "react-dom";
// import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './index.css';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>
//   <Provider store={store}>
//     <App Path='//>
//   </Provider>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitalsÍ
reportWebVitals();
