import './style.scss'
import './rooter.js';

import { home } from './scripts/home.js'

const Core = () => {
  Fth.Initialize();
}

window.CallBackPage = function (pageActive) {
  switch (pageActive) {
    case 'home':
      home();
      break;
    case 'loader':
      home();
      break;

    default:
      break;
  }
}


window.addEventListener('DOMContentLoaded', Core, false);