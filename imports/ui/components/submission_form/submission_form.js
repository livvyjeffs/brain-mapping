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

    const values = {};

    //Get value from each form element
    $('form .input_container').each(function(){

      console.log(values);

      const matching_container = $(this);
      const type = $(this).attr('name');
      const matching_field = matching_container.find('.matching_field');
      const input_field = matching_container.find(':input');
      const unselected_matches = matching_field.find('.unselected_matches');
      const selected_matches = matching_field.find('.selected_matches');
      const matching_item = selected_matches.find('.matching_item');

      //right now only one-to-one
      if(matching_item.length > 0){
        values[type] = {
          matching: true,
          value: matching_item.text()
        };
      }else{
        
        const val = input_field.val();
        values[type] = {
          matching: false,
          value: val
        };

      }

      //empty form
      input_field.val('');
      unselected_matches.empty().addClass('hidden');
      selected_matches.empty();
      matching_field.addClass('hidden');

    });

    absorbData(values);


    //Hide form (already cleared earlier)
    $('.new-article').addClass('hidden');

  },

  "keyup .new-article input": function(event, template) {

    // Prevent default browser form submit
    event.preventDefault();

    const target = event.target;
    const val = target.value;
    const type = target.name;
    const matching_field = $('.matching_field[name='+type+']');

    displayMatches(matching_field, val);

  },

  "click .matching_item": function(event, template) {

    // Prevent default browser form submit
    event.preventDefault();

  //define object targets according to html code
  const target = event.target;
  const matching_item = $(target);
  const matching_container = matching_item.parentsUntil('form','.input_container');
  const matching_field = matching_container.find('.matching_field');
  const input_field = matching_container.find(':input');
  const unselected_matches = matching_field.find('.unselected_matches');
  const selected_matches = matching_field.find('.selected_matches');

  //remove the element from unselected and move to selected
  //clear input field
  selected_matches.removeClass('hidden').append(matching_item.remove());
  input_field.val('');

  //search for no matches
  displayMatches(matching_field, input_field.val());

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

function displayMatches(matching_field, val){
  // Get value from form element
  const unselected_matches = matching_field.find('.unselected_matches');
  const selected_matches = matching_field.find('.selected_matches');
  const type = matching_field.attr('name');

  // Clear previous values
  unselected_matches.empty();

  //only search if non-empty
  if(val === ''){

  //if they delete the input value
  //or it is emptied after being typed in

  //if no selected_matches, then hide matching_field
  if(selected_matches.is(':empty')){
    matching_field.addClass('hidden');
  }

  }else{
  //when a key is pressed, search the input for appropriate matches
  const matches = findMatches(type, val);

  if (matches.length > 0){

    //unhide the matching_field
    matching_field.removeClass('hidden');

    //add input to appropriate container
    for (var i in matches) {
      unselected_matches.append('<span class="matching_item" name="'+type+'">'+matches[i].name+'</span>');
    }

  }

}
}

function absorbValues(values){

  if(values['title'])

  // Insert an article into the collection
    Articles.insert({
      name: values['title'],
      url: values['url'],
      title: values['title'],
      brain_region: values['brain_region'],
      parent_region: values['parent_region'],
      nomenclature: values['nomeclature'],
      phenomena: values['phenomena'],
      species: values['species'],
      genetic_variant: values['genetic_variant'],
      investigator: values['investigator'],
      institution: values['institution'],
      createdAt: new Date(), // current time
    });

        //insert into relevant db if new item
        //assuming one-to-one
        switch (type){
          case 'brain_region':
          Regions.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
          case 'parent_region':
          Regions.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
          case 'phenomena':
          Phenomena.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
          case 'investigator':
          Investigators.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
          case 'institution':
          Institutions.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
          case 'species':
          Species.insert({
            name: val,
            createdAt: new Date(),
          });
          break;
        }
}
