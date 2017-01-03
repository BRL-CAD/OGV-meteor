/*                   A C C O U N T S . J S
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

/** @file OGV/server/accounts.js
 *  @brief file for email validation configuration
 *
 *  This file  serves two purposes. Firstly it contains configuration
 *  regarding sending email for the purpose of validating the new 
 *  registered user. After verification  one can upload their models, 
 *  and use OGV.
 */

/**
 * Create a test user without admin roles and a super user with 
 * admin roles on a fresh install (when number of users is zero)
 */
Accounts.config({
  sendVerificationEmail:true,
  //forbidClientAccountCreation: false
})

if (Meteor.users.find().fetch().length === 0) {
    var users = [
	{name:"Test User",email:"normal@example.com",roles:[]},
	{name:"Super User",email:"admin@example.com",roles:['admin']}
    ];

	var Bio = "greatest 3d modeller on the planet";
    _.each(users, function (userData) {
	var id,
	    user; 

	id = Accounts.createUser({
	    email: userData.email,
            password: "ogv123",
            profile: { name: userData.name, bio: Bio }
	});

	// email verification
	Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});

	Roles.addUsersToRoles(id, userData.roles);
    
    });

} 

Accounts.onCreateUser(function(options, user) {
    var followingArray = [];
    //followingArray[0] = user._id;
    var adminUser = Meteor.users.findOne({'roles.0': "admin"});
    followingArray[0] = adminUser._id;
    followingArray[1] = user._id;

    options.profile.following = followingArray;

    if (options.profile){
        user.profile = options.profile;
    }

    return user;
});

/*Meteor.users.allow({
    update: function(userId, user, fields) 
    {   
        if (!fields.isEqualTo(['profile.following', 'profile.follower'])) { 
            return false; 
        } else {
            return true;
        }
    }    
});
*/


/**
*  Need to allow the users to update only the followers array of other users
*/
Meteor.users.allow({
    update: function(userId, user, fieldNames, modifier) 
    {
        return true;
    }    
});

/**
 * Intended to Delete/Remove users who have not verified their Emails in hrs hours
 */
var hrs = 1;
Meteor.setInterval(function() {
    Meteor.users.find({'emails.0.verified': false}).forEach(function(user) {
        //Do action with 'user' that has not verified email for 1 hour
        Meteor.users.remove({_id: user._id}, true);
    });
}, (3600000 * hrs));

