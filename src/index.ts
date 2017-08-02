/*
 * Reverie
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 *
 * */

  // config file
const config = require('../reverie.json');

import Reverie from './server/Reverie';
const reverie = new Reverie(config);

