// Methods related to articles

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Articles } from './articles.js';
import { Regions } from './articles.js';
import { Nomenclatures } from './articles.js';
import { Species } from './articles.js';
import { Phenomena } from './articles.js';
import { Investigators } from './articles.js';
import { Institutions } from './articles.js';
import { Fields } from './articles.js';

Meteor.methods({
	'articles.insert'(title) {

		check(title, String);

		return Articles.insert({
			name: title,
			title: title,
			createdAt: new Date(),
		});
	},
});

