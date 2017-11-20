import { Articles } from '/imports/api/articles/articles.js';
import { Meteor } from 'meteor/meteor';
import './list_viewer.html';

Template.list_viewer.onCreated(function () {
  Meteor.subscribe('articles.all');
});

Template.list_viewer.helpers({
  articles() {
    return Articles.find({});
  },
});
