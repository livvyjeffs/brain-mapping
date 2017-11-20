// All article-related publications

import { Meteor } from 'meteor/meteor';
import { Articles } from '../articles.js';

Meteor.publish('articles.all', function () {
  return Articles.find();
});
