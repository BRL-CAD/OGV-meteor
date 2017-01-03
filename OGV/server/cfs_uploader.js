/*                C F S _ U P L O A D E R . J S
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

/** @file OGV/server/cfs_uploader.js
 *  @brief uploads files to server
 *
 *  it uploads .g files to server and then converts them to .obj files
 */


Meteor.methods({
    /**
     * Converts g into obj files 
     */
    convertFile:function(fileId)
    {
	/**
	 * 3 NPM packages sys, fs and child_process
	 * are required for executing shell commands 
	 * from within node
	 */
	var sys = Npm.require('sys'),
	    fs = Npm.require('fs'),
	    exec = Npm.require('child_process').exec;

	var modelObj = ModelFiles.findOne(fileId),
	    readStream = modelObj.createReadStream('modelFiles'),
	    filePath = readStream.path,
	    objects,
	    objPath = [],
	    settings = OgvSettings.findOne(),
	    mgedPath = settings.mgedPath,
	    g_objPath = settings.gobjPath,
	    cmd = mgedPath + " -c  " + filePath +" ls -a 2>&1",
	    uploadDirPath = filePath.substring(0, filePath.lastIndexOf("/")); 
	
	/**
	 * exec() function executes system commands and Meteor.BindEnvironment binds it
	 * meteor environment so that they can share each other's variables
	 */
	child = exec(cmd, Meteor.bindEnvironment (function (error, stdout, stderr) {
		/**
		 * the command in cmd returns a list of obj files which are then converted into
		 * array , which is hence traversed to store each OBJ file in database
		 */
		sys.print('stdout' + stdout);
		objects = stdout.split(" ");
		console.log(objects);
		sys.print('stderr' + stderr);
	   
		if (error != null) {
		    console.log('exec error: ' + error);
	    	} else {

		    for (i = 1; i < objects.length; i++) {
			var counter = 0;
			(function(i) {
			    objPath[i] = uploadDirPath + "/" + objects[i] + ".obj";
		            cmd = g_objPath + " -n 10 -o " + objPath[i] + " " + filePath  + " " +  objects[i];
			    console.log(cmd);
	                    child = exec(cmd, Meteor.bindEnvironment (function (error, stdout, stderr) {
				if (error) {
				    throw (new Meteor.Error("There's some error in converting file" + error));
			        } else {
				    console.log("File has been converted" + objects[i] + i);
				    objFS = new FS.File(objPath[i]);
				    objFS.gFile = fileId;				
				    OBJFiles.insert(objFS, function (err, objFile) {
			    	        if (err) { 
					    console.log(err); 
				        } else {
					     counter = counter + 1;
					     var convertPercentage =  (counter/(objects.length - 2)) *100; 
					     console.log("done " + convertPercentage + " %");
					    /**
					     * The acceptance rate for successful conversion is at least 70%
					     * Any model with conversion less than that is not said to be 
					     * converted and is not shown across the website.
					     */
					     if (convertPercentage > 70) { 
						modelObj.update({$set: {converted: true}});
						console.log(modelObj);
					    }
					}
				    });	
			        }    
	   	            }));
		        })(i);	
		    }

	    }       
	}));
    }


});		
