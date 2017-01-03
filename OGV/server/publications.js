
/*                P U B L I C A T I O N S . J S
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

/** @file OGV/server/publications
 *  @brief publishes data from server to client
 */

Meteor.publish('modelFiles', function() {
    return ModelFiles.find();
});

Meteor.publish('objFiles', function() {
    return OBJFiles.find();
});

Meteor.publish('thumbFiles', function() {
    return ThumbFiles.find();
});

Meteor.publish('comments', function() {
    return Comments.find();
});

Meteor.publish('profilePictures', function() {
    return ProfilePictures.find();
});

Meteor.publish('lovers', function(){
    return Lovers.find();
});

Meteor.publish('ogvSettings', function(){
    return OgvSettings.find();
});

Meteor.publish('sharedModels', function(){
   return SharedModels.find();
});

Meteor.publish('notifications', function(){
  return Notifications.find();
});

/**
 * Not every detail about user is published to client
 * for security reasons
 */
Meteor.publish('profiles', function() {
    return Meteor.users.find({}, {fields: {emails : 1, profile: 1, roles: 1}});
}); 

Meteor.publish("userProfile",function(id){
    Meteor._sleepForMs(1000);
    // try to find the user by ID
    var user=Meteor.users.findOne({
        _id:id
    });
    // if we can't find it, mark the subscription as ready and quit
    if(!user){
        this.ready();
        return;
    }
    // if the user whose profile we want to display is the currently logged-in user...
    if(this.userId==user._id){
        // then we return the corresponding full document via a cursor
        return Meteor.users.find(this.userId);
    }
    else{
        // if we are viewing only the public part, strip the "profile"
        // property from the fetched document, you might want to
        // set only a nested property of the profile as private
        // instead of the whole property
        return Meteor.users.find(user._id);
    }
});
