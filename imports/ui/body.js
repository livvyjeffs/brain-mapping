import { Session } from 'meteor/session';

import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import { Regions } from '../api/articles.js';

import { Nomenclatures } from '../api/articles.js';

import { Species } from '../api/articles.js';

import { Phenomena } from '../api/articles.js';

import { Investigators } from '../api/articles.js';

import { Institutions } from '../api/articles.js';

import { Fields } from '../api/articles.js';

import './body.html';

Template.body.helpers({
  input_fields(){
    return Fields.find({});
    // return Fields.find({}, {sort: {order: 1}});
  },
  matching_fields(){

    if (Session.get('queryCalled') === true){

      switch (Session.get('queryType')) {
        case 'url':
      //search ARTICLE db for matching URL
      //if found, auto fill title, connect to ARTICLE.title
      return Articles.find({ url: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'title':
      //if blank, search ARTICLE db for matching title
      //if found, connect to ARTICLE.title
      return Articles.find({ title: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'brain_region':
      //search REGION db for matching region
      //if found, connect to ARTICLE db
      //if not found, create new REGION
      return Regions.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'parent_region':
      //search REGION db for matching region
      //if found, connect to REGION as parent relationship
      //if not found, connect to REGION as parent AND create new REGION
      return Regions.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'nomenclature':
      return Nomenclatures.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      //search NOMENCLATURE db for matching (hard coded, manually updated)
      break;
      case 'species':
      return Species.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'genetic_variant':
      return Species.find({ genetic_variant: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'phenomena':
      return Phenomena.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'investigator': 
      return Investigators.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;
      case 'institution':
      return Institutions.find({ name: { $regex: Session.get('queryValue'), $options: 'i' } });
      break;

    }

  }

},
  articles() {
    return Articles.find({});
  },
});

Template.body.events({
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

      //if has selected matches, update corresponding dbs
      if($(this).has('.selected_matches > .match_item')){

      }

      //else simply add new
      Session.set({
        $(this).find(':input').attr('name'),
        $(this).find(':input').val()
      });


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
    const input_container = target.parentNode;

    // when a key is pressed, search affiliation and display options
    const val = target.value;

    if(val === ''){
      Session.set('queryCalled', false);
      $(input_container).find('.unselected_matches').addClass('hidden');   
    }else{
      Session.set('queryCalled', true);
      Session.set('queryType', target.name);
      Session.set('queryValue', target.value);
      
      //reveals relevant matching from fields
      $(input_container).find('.unselected_matches').removeClass('hidden'); 
    }

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

function getValues(target){

  const input_container = $(target).parent();
  const json = {};

  json



  //objects will always be inputs
  alert('called')
  return 'lala';

}


