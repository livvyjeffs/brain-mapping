import { Mongo } from 'meteor/mongo';
 

//unique articles, titles, abstracts
export const Articles = new Mongo.Collection('articles');

//unique brain regions
export const Regions = new Mongo.Collection('regions');

//unique species, genetic variants
export const Species = new Mongo.Collection('species');

//unique phenomena
export const Phenomena = new Mongo.Collection('phenomena');

//unique investigators, PIs, institutions
export const Investigators = new Mongo.Collection('investigators');

//unique nomenclatures, sources
export const Nomenclatures = new Mongo.Collection('nomenclatures');

//unique institutions, connected to PIs
export const Institutions = new Mongo.Collection('institutions');

//form fields for submission
export const Fields = new Mongo.Collection('fields');