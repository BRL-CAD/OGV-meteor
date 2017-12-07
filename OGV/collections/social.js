/*                     S O C I A L . J S
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

/** @file OGV/client/views/social.js
 *  @brief Collections required for the social functionality of OGV
 */

const commentSchema = new SimpleSchema({
	author: {
		type: String
	},
	body: {
		type: String
	},
	postId: {
		type: String
	},
	submitted: {
		type: Number
	},
	userId: {
		type: String
	}
});

const loverSchema = new SimpleSchema({
	lovers: {
		type: Array
	},
	"lovers.$": {
		type: String
	},
	postId: {
		type: String
	},
	submitted: {
		type: Number
	}
});

const shareSchema = new SimpleSchema({
	ownerId: {
		type: String
	},
	model: {
		type: String
	},
	sharedby: {
		type: String
	},
	timeShared: {
		type: String
	}
});

const Comments = new Meteor.Collection('comments');
const Lovers = new Meteor.Collection('lovers');
const SharedModels = new Meteor.Collection('sharedModels');

Comments.attachSchema(commentSchema);
Lovers.attachSchema(loverSchema);
SharedModels.attachSchema(shareSchema);

Meteor.methods({
    /**
     * Adds new comment to post 
     */
    share: function(shareAttributes) {
		var user = Meteor.user();
		
		if(!user) throw new Meteor.Error(401, "You must be logged in to comment.");

		SharedModels.insert({
			ownerId: shareAttributes.owner,
			sharedby: shareAttributes.sharedBy,
			model: shareAttributes.model,
			timeShared: new Date()
		});
		
		if(user._id != owner) {
			Notifications.insert({
				user: sharedBy,
				ownerId: owner,
				modelId: post,
				type: "share",
				seen: false,
				timeNotified: new Date()
			});
		}
    },

    comment: function(commentAttributes) {
		var user = Meteor.user();
		var post = ModelFiles.findOne(commentAttributes.postId);
		
		/** 
		 * Validations before adding comments.
		 */
		if (!user) {
			throw new Meteor.Error(401, 'You must be logged in to comment.');
		}
		
		if (!commentAttributes.body) {
			throw new Meteor.Error(422, 'Your comment cannot be empty.');
		}	
		
		if (!post) {
			throw new Meteor.Error(422, 'You must comment on a post.');
		}
		
		modelId = commentAttributes.postId;
			ownerId = post.owner;
		if(user._id != ownerId){
			Notifications.insert({
				user: user._id,
				ownerId: ownerId,
				modelId: modelId,
				type: 'comment',
				seen: false,
				timeNotified: new Date()
			});
		}
		comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
			userId: user._id,
			author: user.profile.name,
			submitted: new Date().getTime()
			});

			Comments.insert(comment);
    },
    
    /**
     * Adds one to lovemeter
     */
    love: function(loveAttributes) {
		var lovers = [];
		var user = Meteor.user();

		lovers.push(user._id);
			
		var post = ModelFiles.findOne(loveAttributes.postId);
		var loversObj = Lovers.findOne({postId: loveAttributes.postId});

		if (!user) throw new Meteor.Error(401, 'You must be logged in to love a post');
		if (!post) throw new Meteor.Error(422, 'You must love a post.');
		
		/**
		 * If someone has loved the post aka there's at least one love
		 * in the lovemeter then add 1 to it otherwise create new lovers
		 * Object in the database.
		 */

		if (loversObj) {
			let loversArray = loversObj.lovers;
	
			// If user already loves the post, then throw an error
			if (loversArray.includes(user._id)) throw (new Meteor.Error(550, "you already love this"));

			loversArray.push(user._id);
			Lovers.update({
				postId: loveAttributes.postId
			}, 
			{
				$set: {
					lovers: loversArray,
					countLovers: loversArray.length
				}
			});
			return;
		}

		let modelId = loveAttributes.postId;
		let ownerId = post.owner;
		if(user._id != ownerId) {
			Notifications.insert({
				user: user._id,
				ownerId: ownerId,
				modelId: modelId,
				type: "love",
				seen: false,
				timeNotified: new Date()
			});
		}
		
		let love = _.extend(_.pick(loveAttributes, 'postId'), {
			lovers: lovers,
			submitted: new Date().getTime()
		});
		return Lovers.insert(love);
    }
});
