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

// Template.list_viewer.events({
//   'submit .info-link-add'(event) {
//     event.preventDefault();

//     const target = event.target;
//     const title = target.title;
//     const url = target.url;

//     Meteor.call('links.insert', title.value, url.value, (error) => {
//       if (error) {
//         alert(error.error);
//       } else {
//         title.value = '';
//         url.value = '';
//       }
//     });
//   },
// });
