// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';



import { Meteor } from 'meteor/meteor';

import '../imports/api/articles.js';

Meteor.startup(() => {
  // code to run on server at startup
});
