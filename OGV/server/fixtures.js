/*                F I X T U R E S . J S
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
 * This file contains initial settings that are entered into database
 * during the first installation of the software 
 */
if (OgvSettings.find().count() === 0) 
{
   OgvSettings.insert({
	settingSwitch: true,
	siteName :"Online Geometry Viewer",
	mailUrl : "http://username:password@example.com",
	gobjPath : "/usr/brlcad/dev-7.24.2/bin/g-obj",
	mgedPath : "/usr/brlcad/dev-7.24.2/bin/mged"
    }); 
}
