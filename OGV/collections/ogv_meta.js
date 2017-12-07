/*                     O G V _ M E T A . J S
 * BRL-CAD
 *
 * Copyright (c) 1995-2013 United States Government as represented by
 * the U.S. Army Research Laboratory.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * version 2.1 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this file; see the file named COPYING for more
 * information.
 */

/** @file OGV/collections/ogv_meta.js
 *  @brief Collections for site wide settings. 
 *
 */

const OgvSchema = new SimpleSchema({
	gobjPath: { 
		type: String
	},
	mailUrl: {
		type: String
	},
	mgedPath: {
		type: String
	},
	siteName: {
		type: String
	},
	settingSwitch: {
		type: Boolean
	}
});

const OgvSettings = new Meteor.Collection('OgvSettings');
OgvSettings.attachSchema(OgvSchema);

/**
 * No one is allowed to insert and only admin can update the settings
 */

OgvSettings.allow({
    insert: function(userId, setting) {
		throw new Meteor.Error(550, "You are not allowed to insert new settings, but you may still edit old ones.");
	},
	
    update: function(userId, setting) {
		if (Meteor.user().roles.includes('admin')) return true;
		throw (new Meteor.Error(550, "You must be an admin to edit site settings."));
    }
});
