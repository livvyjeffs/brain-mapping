// Methods related to articles

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Articles } from './articles.js';

Meteor.methods({
  'articles.insert'(title, url) {
    check(url, String);
    check(title, String);

    return Articles.insert({
      url,
      title,
      createdAt: new Date(),
    });
  },
});
