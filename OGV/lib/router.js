/*                   R O U T E R . J S
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

/**
 * @file OGV/lib/router.js
 * @brief connects URLs to views, handles routing of the application
 *
 * Meteor is basically meant for single page apps but that does not 
 * mean that we cannot have urls to bookmark our favorite models. Using
 * package named Iron Router, routing of OGV is handled.
 */

/**
 * Configurations that are applied globally to all the routes.
 */

Router.configure({
    layoutTemplate:'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate:'preloader',
});

/**
 * Mapping urls to template names
 */

Router.map(function() {
    this.route('landingPage', {
    path : '/'
    });
    this.route('signUp', {path : 'sign-up'});
    this.route('feedbackThanks', {path : 'thanks'});
    this.route('logIn', {path : 'log-in'});
    this.route('cfsUploader', {path : 'upload'});
    this.route('notVerified', {path : 'not-verified'});
    this.route('forgotPassword', {path : 'forgot-password'});
    this.route('home', {path : 'home'});
    
    this.route('dashboard',{
    path: 'dashboard',
    waitOn: function() {
        return Meteor.subscribe('ogvSettings');
    }
    });
    
    this.route('modelViewer', {
	    path: '/models/:_id/:_share?',
    waitOn: function() {
        return Meteor.subscribe('modelFiles');
    },
    data: function() 
    { 
        return ModelFiles.findOne (this.params._id);
    },
    action : function () 
    {
         if (this.ready()) this.render();
    },
    onRun: function()
    {
        ModelFiles.update(this.params._id, {$inc: {viewsCount: 1}});
        this.next();
    }
    });

    this.route('modelMeta', {
    path: '/description/:_id',
    waitOn: function() {
        return Meteor.subscribe('modelFiles');
    },
    data: function() 
    {
        var model = ModelFiles.findOne({'owner' : Meteor.user()._id});
        if( model == null ){
            Router.go('/upload');
            return;
        } else {
            Session.set('modelId', this.params._id);
            return ModelFiles.findOne(this.params._id);     
        }     
    }
    });
    
    this.route('profilePage', {
    path: '/profile/:_id',
    waitOn:function()
    {
        return [Meteor.subscribe("userProfile",this.params._id),
                Meteor.subscribe('modelFiles')];
        
    },
    data: function(){
        var id = this.params._id;
        personVar = Meteor.users.findOne( { _id:id } );
        return {
            person: personVar
        }
    }
    });

    this.route('explore', {
        path:'/explore',
        waitOn:function(){
            Meteor.subscribe('modelFiles');
        }
    });

    this.route('models', {
        path : '/newsfeed/:modelId?',
        waitOn: function() {
            Meteor.subscribe('modelFiles');
        }
    });
});

// add the dataNotFound plugin, which is responsible for
// rendering the dataNotFound template if your RouteController
// data function returns a falsy value
Router.plugin("dataNotFound",{
    notFoundTemplate: "dataNotFound"
});

/**
 * Some routes are shown only when user has a valid email 
 * address
 */
var validateUser = function(pause) {
    if (Meteor.user()) {
        this.next();
    } else if (Meteor.loggingIn()) {
    this.render('preloader');
    } else {
    this.render('logIn');
    }
}


/**
 * actionReady shows a route only after it has fetched all
 * the required data. 
 */
var actionReady = function(pause) 
{
    if (this.ready()) {
    this.next();
    } else {
    this.render('preloader');
    }
}

/**
 * While the user is still logging in, all the routes should
 * show a preloader
 */
var loggingIn = function(pause) {
    if (Meteor.loggingIn()) {
    this.render('preloader');
    }
    else {
    this.next();
    }
}

/**
 * Remove notifications and error messages that have been seen
 * every time a route is changed 
*/

Router.onBeforeAction(validateUser,{only:['cfsUploader','filemanager','dashboard','modelMeta', 'newsfeedSidebar', 'models', 'modelFeed', 'explore', 'profilePage', 'index']});
Router.onBeforeAction(actionReady, {only:['index', 'modelViewer', 'profilePage', 'explore', 'models', 'modelFeed']});
Router.onBeforeAction(loggingIn);
