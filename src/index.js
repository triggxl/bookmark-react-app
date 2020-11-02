import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

/*
10/22
npx serve -s build, only saw 1 file in network panel
Vercel: --> Permission Errors
WARN checkPermissions Missing write access to /usr/local/lib/node_modules
/Users/Triggxl/.npm/_logs/2020-10-22T18_31_31_099Z-debug.log
recommended link: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
*/