import React from 'react';
import ReactDOM from 'react-dom/client';
// import { registerMicroApps, start } from 'qiankun';
import App from './App';

import './global.css';
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// registerMicroApps([
//   {
//     name: 'reactApp',
//     entry: 'https://github.com/',
//     container: '#micro-app',
//     activeRule: '/baidu',
//   },
// ]);
// // 启动 qiankun
// start();
