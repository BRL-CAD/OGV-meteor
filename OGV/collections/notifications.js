notificationSchema = new SimpleSchema({
	user: {
		type: String
	},
	ownerId: {
		type: String
	},
	modelId: {
		type: String
	},
	type: {
		type: String
	},
	seen: {
		type: Boolean
	},
	timeNotified: {
		type: Date
	}
});

Notifications = new Meteor.Collection("notifications");
Notifications.attachSchema(notificationSchema);

Notifications.allow({
    update: function(userId, notification) {
		if (Meteor.userId() == userId) return true;
		throw new Meteor.Error(550, "You must be logged in to update existing notifications.");
    }
});
