import { Template } from 'meteor/templating';
 
import { Articles } from '../api/articles.js';
 
import './body.html';
 
Template.body.helpers({
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
 
    //interlinked databases, one of each...
    // - url
    // - title
    // - region (parents)
    // - investigated functions
    // - species

    // Get value from form element
    const url = $('.new-search [name=url]').val();
    const study_title = $('.new-article [name=title]').val();
    const brain_region = $('.new-article [name=brain_region]').val();
    const parent_region = $('.new-article [name=parent_region]').val();
    const nomenclature = $('.new-article [name=nomenclature]').val();
    const species = $('.new-article [name=species]').val();
    const genetic_variant = $('.new-article [name=genetic_variant]').val();
    const investigated_function = $('.new-article [name=investigated_function]').val();
 
    // Insert a task into the collection
    Articles.insert({
      url,
      brain_region,
      parent_region,
      nomenclature,
      investigated_function,
      species,
      study_title,
      createdAt: new Date(), // current time
    });

    $('.new-article').addClass('hidden');
 
    // Clear form
    $('.new-article input').val('');
  },
});