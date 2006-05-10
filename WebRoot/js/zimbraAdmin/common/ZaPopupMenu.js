/*
 * ***** BEGIN LICENSE BLOCK *****
 * Version: ZPL 1.1
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.1 ("License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.zimbra.com/license
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 * 
 * The Original Code is: Zimbra Collaboration Suite Web Client
 * 
 * The Initial Developer of the Original Code is Zimbra, Inc.
 * Portions created by Zimbra are Copyright (C) 2005 Zimbra, Inc.
 * All Rights Reserved.
 * 
 * Contributor(s):
 * 
 * ***** END LICENSE BLOCK *****
 */

/**
* @class ZaPopupMenu
* @constructor
* @param parent
* @param className
* @param dialog
* @param opList
*
* This widget class extends DwtMenu. Similar to ZaToolBar, this class creates
* buttons form an array of ZaOperation objects
**/
function ZaPopupMenu(parent, className, dialog, opList) {
	if (arguments.length == 0) return;
	className = className || "ActionMenu";
	DwtMenu.call(this, parent, DwtMenu.POPUP_STYLE, className, null, dialog);
	this._menuItems = new Object();	
	if(opList) {
		var cnt = opList.length;
		for(var ix=0; ix < cnt; ix++) {
			if(opList[ix].id == ZaOperation.NONE  || opList[ix].id == ZaOperation.HELP)
				continue;
				
			var style = (opList[ix].id == ZaOperation.SEP) ? DwtMenuItem.SEPARATOR_STYLE : DwtMenuItem.CASCADE_STYLE;
			this.createMenuItem(opList[ix].id, opList[ix].imageId, opList[ix].caption, null, true,style,null);
			this.addSelectionListener(opList[ix].id, opList[ix].listener);		
		}
	}
}

ZaPopupMenu.prototype = new DwtMenu;
ZaPopupMenu.prototype.constructor = ZaPopupMenu;

ZaPopupMenu.prototype.toString = 
function() {
	return "ZaPopupMenu";
}

ZaPopupMenu.prototype.addSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].addSelectionListener(listener);
}

ZaPopupMenu.prototype.removeSelectionListener =
function(menuItemId, listener) {
	this._menuItems[menuItemId].removeSelectionListener(listener);
}

ZaPopupMenu.prototype.popup =
function(delay, x, y, kbGenerated) {
	if (delay == null)
		delay = 0;
	if (x == null) 
		x = Dwt.DEFAULT;
	if (y == null)
		y = Dwt.DEFAULT;
	this.setLocation(x, y);
	DwtMenu.prototype.popup.call(this, delay, null, null, kbGenerated);
}

/**
* Enables/disables menu items.
*
* @param ids		a list of menu item IDs
* @param enabled	whether to enable the menu items
*/
ZaPopupMenu.prototype.enable =
function(ids, enabled) {
	if (!(ids instanceof Array))
		ids = [ids];
	for (var i = 0; i < ids.length; i++)
		if (this._menuItems[ids[i]])
			this._menuItems[ids[i]].setEnabled(enabled);
}

ZaPopupMenu.prototype.enableAll =
function(enabled) {
	for (var i in this._menuItems)
		this._menuItems[i].setEnabled(enabled);
}

ZaPopupMenu.prototype.addMenuItem =
function(menuItemId, menuItem) {
	this._menuItems[menuItemId] = menuItem;
}

ZaPopupMenu.prototype.createMenuItem =
function(menuItemId, imageId, text, disImageId, enabled, style, radioGroupId) {
	var mi = this._menuItems[menuItemId] = new DwtMenuItem(this, style, radioGroupId);
	if (imageId)
		mi.setImage(imageId);
	if (text)
		mi.setText(text);
	if (disImageId)
		mi.setDisabledImage(disImageId);
	mi.setEnabled(enabled !== false);
	return mi;
}

ZaPopupMenu.prototype.createSeparator =
function() {
	new DwtMenuItem(this, DwtMenuItem.SEPARATOR_STYLE);
}
