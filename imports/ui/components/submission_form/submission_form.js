import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Articles } from '/imports/api/articles/articles.js';
import { Fields } from '/imports/api/articles/articles.js';
import { Regions } from '/imports/api/articles/articles.js';
import { Nomenclatures } from '/imports/api/articles/articles.js';
import { Pheonomena } from '/imports/api/articles/articles.js';
import { Species } from '/imports/api/articles/articles.js';
import { Investigators } from '/imports/api/articles/articles.js';
import { Institutions } from '/imports/api/articles/articles.js';

import './submission_form.html';

//subscribing to all databases
Template.submission_form.onCreated(function () {
  Meteor.subscribe('fields.all');
  Meteor.subscribe('articles.all');
  Meteor.subscribe('regions.all');
  Meteor.subscribe('phenomena.all');
  Meteor.subscribe('nomenclatures.all');
  Meteor.subscribe('species.all');
  Meteor.subscribe('investigators.all');
  Meteor.subscribe('institutions.all');
});

// Template.submission_form.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.submission_form.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.submission_form.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

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

Template.submission_form.helpers({
  input_fields(){
    // populate the fields based on database
    // return Fields.find({});
    return Fields.find({}, {sort: {order: 1}});
  },
});

Template.submission_form.events({
  'submit .new-search'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const url = target.url.value;

    $('.article_iframe').attr('src',url);
    $('.new-article').removeClass('hidden');

  },
  'submit .new-article'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    //Get value from each form element
    $('form .input_container').each(function(){

    });

    const url = getValues($('.new-search [name=url]'));
    const title = $('.new-article [name=title]').val();
    const brain_region = $('.new-article [name=brain_region]').val();
    const parent_region = $('.new-article [name=parent_region]').val();
    const nomenclature = $('.new-article [name=nomenclature]').val();
    const species = $('.new-article [name=species]').val();
    const genetic_variant = $('.new-article [name=genetic_variant]').val();
    const phenomena = $('.new-article [name=phenomena]').val();
    const investigator = $('.new-article [name=investigator]').val();
    const institution = $('.new-article [name=institution]').val();

    // Insert an article into the collection
    Articles.insert({
      name: title,
      url,
      brain_region,
      parent_region,
      nomenclature,
      phenomena,
      species,
      title,
      investigator,
      institution,
      createdAt: new Date(), // current time
    });

    //work on form submissions

    Phenomena.insert({
      name: phenomena,
      createdAt: new Date(), // current time
    });

    Regions.insert({
      name: brain_region,
      parent_region,
      createdAt: new Date(), //current time
    });

    Regions.insert({
      name: species,
      genetic_variant,
      createdAt: new Date(), //current time
    });

    $('.new-article').addClass('hidden');

    // Clear form
    $('.new-article input').val('');
  },

  "keyup .new-article input": function(event, template) {

    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    
    //when a key is pressed, search the input for appropriate matches
    
    const matches = findMatches(target.name, target.value);

  },

  "click .match_item": function(event, template) {
    event.preventDefault();
  // Session.set('affiliation_parent', AffiliationList.findOne({name: getSelectedValue(event)}))

  //define object targets according to html code
  const target = event.target;
  const input_container = target.parentNode.parentNode.parentNode;

  //move the item from unselected to selected and empty other options
  const matched_item = $(target).text();
  $(target).remove();
  $(input_container).find('.unselected_matches').empty();
  $(input_container).find('.selected_matches').removeClass('hidden').append("<span class='match_item'>"+matched_item+"<span>");
  $(input_container).find('.unselected_matches').addClass('hidden'); 

  //bind selected item to appropriate db
  //example: users.update({_id : "Jack"},{$set:{age : 13, username : "Jack"}});

  //clear input
  $(input_container).find(':input').val('');

},

});

function getSelectedValue(event){
  $('.matching').removeClass('selected');
  $(event.target).addClass('selected');
  return event.target.getAttribute('value');
}

function findMatches(type, queryValue){

  switch (type) {
    case 'url':
        //search ARTICLE db for matching URL
        //if found, auto fill title, connect to ARTICLE.title
        return Articles.find({ url: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'title':
        //if blank, search ARTICLE db for matching title
        //if found, connect to ARTICLE.title
        return Articles.find({ title: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'brain_region':
        //search REGION db for matching region
        //if found, connect to ARTICLE db
        //if not found, create new REGION
        return Regions.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'parent_region':
        //search REGION db for matching region
        //if found, connect to REGION as parent relationship
        //if not found, connect to REGION as parent AND create new REGION
        return Regions.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'nomenclature':
        return Nomenclatures.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        //search NOMENCLATURE db for matching (hard coded, manually updated)
        break;
        case 'species':
        return Species.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'genetic_variant':
        return Species.find({ genetic_variant: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'phenomena':
        return Phenomena.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'investigator': 
        return Investigators.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;
        case 'institution':
        return Institutions.find({ name: { $regex: queryValue, $options: 'i' } }).fetch();
        break;

      }
    }

