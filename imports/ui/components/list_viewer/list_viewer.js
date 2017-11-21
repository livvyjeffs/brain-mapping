import { Articles } from '/imports/api/articles/articles.js';
import { Phenomena } from '/imports/api/articles/articles.js';
import { Regions } from '/imports/api/articles/articles.js';
import { Meteor } from 'meteor/meteor';
import './list_viewer.html';

// ARRAY PUSHIFNOTEXIST
// source:https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
// Array.prototype.inArray = function(comparer) { 
// 	for(var i=0; i < this.length; i++) { 
// 		if(comparer(this[i])) return true; 
// 	}
// 	return false; 
// }; 

// // adds an element to the array if it does not already exist using a comparer 
// // function
// Array.prototype.pushIfNotExist = function(element, comparer) { 
// 	if (!this.inArray(comparer)) {
// 		this.push(element);
// 	}
// }; 

Template.by_article.events({
	'click .view_toggle': function(event) {
		Session.set('list_view', $(event.target).attr('name'));
	},
});
Template.by_phenomena.events({
	'click .view_toggle': function(event) {
		Session.set('list_view', $(event.target).attr('name'));
	},
});
Template.by_brain_region.events({
	'click .view_toggle': function(event) {
		Session.set('list_view', $(event.target).attr('name'));
	},
});

Template.list_viewer.onCreated(function () {
	Session.set('list_view','by_article');
	Meteor.subscribe('articles.all');
	Meteor.subscribe('phenomena.all');
	Meteor.subscribe('regions.all');
});

Template.list_viewer.helpers({
	list_view() {
		return Session.get('list_view');
	},
});

Template.by_article.helpers({
	articles() {
		return Articles.find({});
	},
});

Template.by_phenomena.helpers({
	phenomena(){

		const phenomena = Phenomena.find({}).fetch();

		for (x in phenomena){
			phenomena[x].articles = Articles.find({'phenomena.id': phenomena[x]._id}).fetch();
		}

		console.log(phenomena);
		return phenomena;
	},
});

Template.by_brain_region.helpers({
	brain_regions(){

		const brain_regions = Regions.find({}).fetch();

		for (var x in brain_regions){
			brain_regions[x].articles = Articles.find({'brain_region.id': brain_regions[x]._id}).fetch();
		}

		for (var x in brain_regions){
			if (brain_regions[x].articles.length === 0){
				//remove if no articles b/c its a parent region
				brain_regions.splice(x,1);
			}
		}

		console.log(brain_regions);
		return brain_regions;
	},
});
