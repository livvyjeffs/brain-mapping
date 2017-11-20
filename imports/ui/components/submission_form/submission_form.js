import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Articles } from '/imports/api/articles/articles.js';
import { Fields } from '/imports/api/articles/articles.js';
import { Regions } from '/imports/api/articles/articles.js';
import { Nomenclatures } from '/imports/api/articles/articles.js';
import { Phenomena } from '/imports/api/articles/articles.js';
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

      const matching_container = $(this);
      const type = $(this).attr('name');
      const matching_field = matching_container.find('.matching_field');
      const input_field = matching_container.find(':input');
      const unselected_matches = matching_field.find('.unselected_matches');
      const selected_matches = matching_field.find('.selected_matches');
      const matching_item = selected_matches.find('.matching_item');
      const val = input_field.val();

      //right now only one-to-one
      if(val != ''){
        //if empty
        values[type] = {
          matching: false,
          name: val,
          type: type,
        };
      }else if(matching_item.length > 0){
        //if matching
        values[type] = {
          matching: true,
          name: matching_item.text(),
          id: matching_item.attr('id'),
          type: type,
        };
      }else{
        //if new
        values[type] = {
          matching: false,
          name: null,
          type: type,
        };
      }

      //empty form
      input_field.val('');
      unselected_matches.empty();
      selected_matches.empty().addClass('hidden');
      matching_field.addClass('hidden');

    });

    // Meteor.call('articles.insert', values);
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
      unselected_matches.append('<span class="matching_item" name="'+type+'" id="'+matches[i]._id+'">'+matches[i].name+'</span>');
    }

  }

}
}

function createNewNonNull(object, database){

  if(!object.matching && object.name != null){
  //only add if its a new, non-match
    if(database.find({name: object.name}).fetch().length == 0){
    //because of some redundancy, check that its not in db first
      object.id = database.insert({
        name: object.name,
        createdAt: new Date(),
      });
    }
    
  }
}

function absorbData(values){

  //createNewNonNull upstream ids

  createNewNonNull(values.parent_region, Regions);
  createNewNonNull(values.brain_region, Regions);
  createNewNonNull(values.phenomena, Phenomena);
  createNewNonNull(values.species, Species);
  createNewNonNull(values.investigator, Investigators);
  createNewNonNull(values.nomenclature, Nomenclatures);
  createNewNonNull(values.institution, Institutions);

  console.log(values)

  if(values.title.matching){
    //if matching an existing article
    Articles.update(values.title.id,
    {
      $addToSet: {
        url: [values.url.name],
        brain_region: [{
          name: values.brain_region.name,
          id: values.brain_region.id,
          parent_region: values.parent_region.name,
          type: 'brain_region',
        }],
        nomenclature: [{
          name: values.nomenclature.name,
          id: values.nomenclature.id,
        }],
        phenomena: [{
          name: values.phenomena.name,
          id: values.phenomena.id,
        }],
        species: [{
          name: values.species.name,
          id: values.species.id,
          genetic_variant: values.genetic_variant.name,
          type: 'species',
        }],
        investigators: [{
          name: values.investigator.name,
          id: values.investigator.id,
        }],
        institution: [{
          name: values.institution.name,
          id: values.institution.id,
        }],
      }
    });
  }else{
    //else create new article
    Articles.insert({
      url: [values.url.name],
      name: values.title.name,
      title: values.title.name,
      brain_region: [{
        name: values.brain_region.name,
        id: values.brain_region.id,
        parent_region: values.parent_region.name,
        type: 'brain_region',
      }],
      nomenclature: [{
        name: values.nomenclature.name,
        id: values.nomenclature.id,
      }],
      phenomena: [{
        name: values.phenomena.name,
        id: values.phenomena.id,
      }],
      species: [{
        name: values.species.name,
        id: values.species.id,
        genetic_variant: values.genetic_variant.name,
        type: 'species',
      }],
      investigators: [{
        name: values.investigator.name,
        id: values.investigator.id,
      }],
      institution: [{
        name: values.institution.name,
        id: values.institution.id,
      }],
      createdAt: new Date(),
    });
  }

  

  // Articles.update({
  //   query: { name: values.title },
  //   update: { 

  //   },
  //   upsert: true
  // });

  // Regions.findAndModify({
  //   query: { name : values[brain_region] },
  //   update: {
  //     $addToSet: {
  //       parent_region: values[parent_region]
  //     }
  //   },
  //   upsert: true
  // });

  // Phenomena.findAndModify({
  //   query: { name : values[phenomena] },
  //   upsert: true
  // });

  // Institutions.findAndModify({
  //   query: { name : values[institution] },
  //   upsert: true
  // });

  // Investigators.findAndModify({
  //   query: { name : values[investigators] },
  //   upsert: true
  // });

}

