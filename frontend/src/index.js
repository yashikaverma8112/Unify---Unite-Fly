import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import TimeAgo from "javascript-time-ago";

// import en from "javascrispt-time-ago/locale/en.json";
import { Provider } from "react-redux";
import {persistor ,store }from "./app/store";
// import ru from "javascript-time-ago/locale/ru.json";

// TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
   <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
  
    

    </>
 
);