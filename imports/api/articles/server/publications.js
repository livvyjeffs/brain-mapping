// All article-related publications



import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

import { Regions } from '../articles.js';
import { Nomenclatures } from '../articles.js';
import { Species } from '../articles.js';
import { Phenomena } from '../articles.js';
import { Investigators } from '../articles.js';
import { Institutions } from '../articles.js';

import { Fields } from '../articles.js';

//publishes articles
Meteor.publish('articles.all', function () {
  return Articles.find();
});

Meteor.publish('fields.all', function () {
  return Fields.find();
});

Meteor.publish('regions.all', function () {
  return Regions.find();
});

Meteor.publish('nomenclatures.all', function () {
  return Nomenclatures.find();
});

Meteor.publish('species.all', function () {
  return Species.find();
});

Meteor.publish('investigators.all', function () {
  return Investigators.find();
});

Meteor.publish('institutions.all', function () {
  return Institutions.find();
});