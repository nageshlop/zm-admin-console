/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */

 /**
* @class ZaDomainController controls display of a single Domain
* @contructor ZaDomainController
* @param appCtxt
* @param container
* @param abApp
**/

ZaDomainController = function(appCtxt, container) {
	ZaXFormViewController.call(this, appCtxt, container,"ZaDomainController");
	this._UICreated = false;
	this._helpURL = location.pathname + ZaUtil.HELP_URL + "managing_domains/managing_domains.htm?locid="+AjxEnv.DEFAULT_LOCALE;
	this._toolbarOperations = new Array();			
	this.deleteMsg = ZaMsg.Q_DELETE_DOMAIN;	
	this.objType = ZaEvent.S_DOMAIN;
	this.tabConstructor = ZaDomainXFormView;				
}

ZaDomainController.prototype = new ZaXFormViewController();
ZaDomainController.prototype.constructor = ZaDomainController;

ZaController.changeActionsStateMethods["ZaDomainController"] = new Array();
ZaController.initToolbarMethods["ZaDomainController"] = new Array();
ZaController.setViewMethods["ZaDomainController"] = new Array();
ZaController.changeActionsStateMethods["ZaDomainController"] = new Array();
/**
*	@method show
*	@param entry - isntance of ZaDomain class
*/

ZaDomainController.prototype.show = 
function(entry) {
	if (! this.selectExistingTabByItemId(entry.id)){
		this._setView(entry, true);
	}
}

ZaDomainController.changeActionsStateMethod = function () {
	if(this._toolbarOperations[ZaOperation.SAVE])
		this._toolbarOperations[ZaOperation.SAVE].enabled = false;
}
ZaController.changeActionsStateMethods["ZaDomainController"].push(ZaDomainController.changeActionsStateMethod);

/**
* @method initToolbarMethod
* This method creates ZaOperation objects 
* All the ZaOperation objects are added to this._toolbarOperations array which is then used to 
* create the toolbar for this view.
* Each ZaOperation object defines one toolbar button.
* Help button is always the last button in the toolbar
**/
ZaDomainController.initToolbarMethod =          
function () {                                    
	this._toolbarOperations[ZaOperation.SAVE]=new ZaOperation(ZaOperation.SAVE,ZaMsg.TBB_Save, ZaMsg.DTBB_Save_tt, "Save", "SaveDis", new AjxListener(this, this.saveButtonListener));
	this._toolbarOrder.push(ZaOperation.SAVE);		

	this._toolbarOperations[ZaOperation.CLOSE]=new ZaOperation(ZaOperation.CLOSE,ZaMsg.TBB_Close, ZaMsg.DTBB_Close_tt, "Close", "CloseDis", new AjxListener(this, this.closeButtonListener));    	
	this._toolbarOperations[ZaOperation.SEP] = new ZaOperation(ZaOperation.SEP);


	this._toolbarOrder.push(ZaOperation.CLOSE);
	this._toolbarOrder.push(ZaOperation.SEP);

	this._toolbarOperations[ZaOperation.NEW]=new ZaOperation(ZaOperation.NEW,ZaMsg.TBB_New, ZaMsg.DTBB_New_tt, "Domain", "DomainDis", new AjxListener(this, this._newButtonListener));
	this._toolbarOrder.push(ZaOperation.NEW);		


	this._toolbarOperations[ZaOperation.DELETE]=new ZaOperation(ZaOperation.DELETE,ZaMsg.TBB_Delete, ZaMsg.DTBB_Delete_tt, "Delete", "DeleteDis", new AjxListener(this, this.deleteButtonListener));
	this._toolbarOrder.push(ZaOperation.DELETE);		    	    	

    this._toolbarOperations[ZaOperation.VIEW_DOMAIN_ACCOUNTS]=new ZaOperation(ZaOperation.VIEW_DOMAIN_ACCOUNTS,ZaMsg.Domain_view_accounts, ZaMsg.Domain_view_accounts_tt, "Search", "SearchDis", new AjxListener(this, this.viewAccountsButtonListener));
    this._toolbarOrder.push(ZaOperation.VIEW_DOMAIN_ACCOUNTS);


    if(ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.DOMAIN_GAL_WIZ] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
		this._toolbarOperations[ZaOperation.SEP] = new ZaOperation(ZaOperation.SEP);
		this._toolbarOperations[ZaOperation.GAL_WIZARD]=new ZaOperation(ZaOperation.GAL_WIZARD,ZaMsg.DTBB_GAlConfigWiz, ZaMsg.DTBB_GAlConfigWiz_tt, "GALWizard", "GALWizardDis", new AjxListener(this, ZaDomainController.prototype._galWizButtonListener));   		
		this._toolbarOrder.push(ZaOperation.SEP);
		this._toolbarOrder.push(ZaOperation.GAL_WIZARD);			
	}
	if(ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.DOMAIN_AUTH_WIZ] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
		this._toolbarOperations[ZaOperation.AUTH_WIZARD]=new ZaOperation(ZaOperation.AUTH_WIZARD,ZaMsg.DTBB_AuthConfigWiz, ZaMsg.DTBB_AuthConfigWiz_tt, "AuthWizard", "AuthWizardDis", new AjxListener(this, ZaDomainController.prototype._authWizButtonListener));
		this._toolbarOrder.push(ZaOperation.AUTH_WIZARD);		   		   		
	}
	if(ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.DOMAIN_WIKI_WIZ] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
		this._toolbarOperations[ZaOperation.INIT_NOTEBOOK]=new ZaOperation(ZaOperation.INIT_NOTEBOOK,ZaMsg.DTBB_InitNotebook, ZaMsg.DTBB_InitNotebook_tt, "NewNotebook", "NewNotebookDis", new AjxListener(this, ZaDomainController.prototype._initNotebookButtonListener));
		this._toolbarOrder.push(ZaOperation.INIT_NOTEBOOK);		
	}	
	
	if(ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.DOMAIN_CHECK_MX_WIZ] || ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI]) {
	   	this._toolbarOperations[ZaOperation.CHECK_MX_RECORD]=new ZaOperation(ZaOperation.CHECK_MX_RECORD,ZaMsg.DTBB_CheckMX, ZaMsg.DTBB_CheckMX_tt, "ReindexMailboxes", "ReindexMailboxes", new AjxListener(this, ZaDomainController.prototype._checkMXButtonListener));
		this._toolbarOrder.push(ZaOperation.CHECK_MX_RECORD);	   	
	}
}
ZaController.initToolbarMethods["ZaDomainController"].push(ZaDomainController.initToolbarMethod);

ZaDomainController.changeActionsStateMethod = function () {
	if(this._currentObject.setAttrs)
		this._toolbar.getButton(ZaOperation.SAVE).setEnabled(false);  		

	if(this._currentObject.attrs[ZaDomain.A_zimbraDomainStatus] == ZaDomain.DOMAIN_STATUS_SHUTDOWN) {
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_DELETE_DOMAIN])
			this._toolbar.getButton(ZaOperation.DELETE).setEnabled(false);
		
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_CONFIGURE_GAL])
			this._toolbar.getButton(ZaOperation.GAL_WIZARD).setEnabled(false);
		
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_CONFIGURE_AUTH])
			this._toolbar.getButton(ZaOperation.AUTH_WIZARD).setEnabled(false);		
		
		if(ZaDomain.prototype.canConfigureWiki.call(this._currentObject))
			this._toolbar.getButton(ZaOperation.INIT_NOTEBOOK).setEnabled(false);
	} else {
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_DELETE_DOMAIN]) {
			if(!this._currentObject.id) {
				this._toolbar.getButton(ZaOperation.DELETE).setEnabled(false);  			
			} else {
				this._toolbar.getButton(ZaOperation.DELETE).setEnabled(true);  				
			}
		}			
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_CONFIGURE_GAL])
			this._toolbar.getButton(ZaOperation.GAL_WIZARD).setEnabled(true);
		
		if(this._currentObject.rights && this._currentObject.rights[ZaDomain.RIGHT_CONFIGURE_AUTH])
			this._toolbar.getButton(ZaOperation.AUTH_WIZARD).setEnabled(true);		
		
		if(ZaDomain.prototype.canConfigureWiki.call(this._currentObject)) {
			if(this._currentObject.attrs[ZaDomain.A_zimbraNotebookAccount])
				this._toolbar.getButton(ZaOperation.INIT_NOTEBOOK).setEnabled(false);
			else
				this._toolbar.getButton(ZaOperation.INIT_NOTEBOOK).setEnabled(true);
		}
	}
}
ZaController.changeActionsStateMethods["ZaAccountViewController"].push(ZaAccountViewController.changeActionsStateMethod);

/**
*	@method setViewMethod 
*	@param entry - isntance of ZaDomain class
*/
ZaDomainController.setViewMethod =
function(entry) {
	entry.load("name", entry.attrs[ZaDomain.A_domainName],false,true);
	if(!this._UICreated) {
		this._createUI();
	} 
	ZaApp.getInstance().pushView(this.getContentViewId());
	this._view.setDirty(false);
	this._view.setObject(entry); 	//setObject is delayed to be called after pushView in order to avoid jumping of the view	
	this._currentObject = entry;
}
ZaController.setViewMethods["ZaDomainController"].push(ZaDomainController.setViewMethod);

/**
* @method _createUI
**/
ZaDomainController.prototype._createUI =
function () {
	this._contentView = this._view = new this.tabConstructor(this._container);

	this._initToolbar();
	//always add Help button at the end of the toolbar
	this._toolbarOperations[ZaOperation.NONE] = new ZaOperation(ZaOperation.NONE);
	this._toolbarOperations[ZaOperation.HELP]=new ZaOperation(ZaOperation.HELP,ZaMsg.TBB_Help, ZaMsg.TBB_Help_tt, "Help", "Help", new AjxListener(this, this._helpButtonListener));							
	this._toolbarOrder.push(ZaOperation.NONE);
	this._toolbarOrder.push(ZaOperation.HELP);	
	this._toolbar = new ZaToolBar(this._container, this._toolbarOperations,this._toolbarOrder);		
	
	var elements = new Object();
	elements[ZaAppViewMgr.C_APP_CONTENT] = this._view;
	elements[ZaAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;	
    var tabParams = {
		openInNewTab: true,
		tabId: this.getContentViewId()
	}  		
    ZaApp.getInstance().createView(this.getContentViewId(), elements, tabParams) ;
	this._UICreated = true;
	ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
}

ZaDomainController.prototype.saveButtonListener =
function(ev) {
	try {
		if(this._saveChanges()) {
			this._view.setDirty(false);
			if(this._toolbar)
				this._toolbar.getButton(ZaOperation.SAVE).setEnabled(false);		
		}
	} catch (ex) {
		this._handleException(ex, "ZaDomainController.prototype.saveButtonListener", null, false);
	}
	return;
}

ZaDomainController.prototype.saveChangesCallback = 
function(params, resp) {
	try {
		if(params.busyId)
			ZaApp.getInstance().getAppCtxt().getShell().setBusy(false, params.busyId);
			
		if(!resp && !this._currentRequest.cancelled) {
			throw(new AjxException(ZaMsg.ERROR_EMPTY_RESPONSE_ARG, AjxException.UNKNOWN, "ZaDomainController.prototype.saveChangesCallback"));
		} else if(resp.isException && resp.isException()) {
			throw(resp.getException());
		} else if(respObj.getResponse().Body.BatchResponse && respObj.getResponse().Body.BatchResponse.Fault) {
			var fault = respObj.getResponse().Body.BatchResponse.Fault;
			if(fault instanceof Array)
				fault = fault[0];
					
			if (fault) {
				// JS response with fault
				var ex = ZmCsfeCommand.faultToEx(fault);
				throw(ex);
			}
		}
		
	} catch (ex) {
		this._handleException(ex, "ZaDomainController.prototype.saveChangesCallback");	
	}		
}

ZaDomainController.prototype._saveChanges = 
function () {
	var tmpObj = this._view.getObject();
	var mods = new Object();
	var haveSmth = false; //what is this variable for?
    var	isNew = (!tmpObj.id) ? true : false;
    var renameNotebookAccount = false;
    var catchAllChanged = false ;

    if (!(AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress]) && AjxUtil.isEmpty(this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress])) 
    	&& (tmpObj[ZaAccount.A_zimbraMailCatchAllAddress] != this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress])) {
         catchAllChanged = true ;
    }


	for(var a in tmpObj.attrs) {
		if(a == ZaItem.A_zimbraId || a==ZaDomain.A_domainName || a == ZaDomain.A_domainType)
			continue;
		
		if (!(AjxUtil.isEmpty(this._currentObject.attrs[a]) && AjxUtil.isEmpty(tmpObj.attrs[a]))) {
			if(tmpObj.attrs[a] instanceof Array) {
					if((this._currentObject.attrs[a] && tmpObj.attrs[a]
						&& tmpObj.attrs[a].join(",").valueOf() !=  this._currentObject.attrs[a].join(",").valueOf())
                        || (this._currentObject.attrs[a] == null && tmpObj.attrs[a] != null)
                        || (this._currentObject.attrs[a] != null && (tmpObj.attrs[a] == null || tmpObj.attrs[a].length == 0)) )
                    {
						mods[a] = tmpObj.attrs[a];
						haveSmth = true;
					}	
			} else if(tmpObj.attrs[a] != this._currentObject.attrs[a]) {
				mods[a] = tmpObj.attrs[a];
				haveSmth = true;
			}
		}                                       
	}

	var writeACLs = false;	
	//var changeStatus = false;	
	var permsToRevoke = [];
	//check if any notebook permissions are changed
	if(tmpObj[ZaDomain.A_allNotebookACLS]._version > 0) {
		writeACLs = true;	
		var cnt = this._currentObject[ZaDomain.A_allNotebookACLS].length;
		for(var i = 0; i < cnt; i++) {
			if(this._currentObject[ZaDomain.A_allNotebookACLS][i].gt == ZaDomain.A_NotebookUserACLs ||
				this._currentObject[ZaDomain.A_allNotebookACLS][i].gt == ZaDomain.A_NotebookGroupACLs ||
				this._currentObject[ZaDomain.A_allNotebookACLS][i].gt == ZaDomain.A_NotebookDomainACLs)	{
				var cnt2 = tmpObj[ZaDomain.A_allNotebookACLS].length;
				var foundUser = false;
				for(var j = 0; j < cnt2; j++) {
					if(tmpObj[ZaDomain.A_allNotebookACLS][j].name == this._currentObject[ZaDomain.A_allNotebookACLS][i].name) {
						foundUser = true;
						break;
					}
				}
				if(!foundUser && this._currentObject[ZaDomain.A_allNotebookACLS][i].zid) {
					permsToRevoke.push(this._currentObject[ZaDomain.A_allNotebookACLS][i].zid);
				}
			}
		
		}
	}

	if(haveSmth || writeACLs || catchAllChanged) {
		try { 
/*			var soapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra");
			soapDoc.setMethodAttribute("onerror", "stop");*/		
			if(renameNotebookAccount) {
				var account = new ZaAccount();
				account.load(ZaAccount.A_name,this._currentObject.attrs[ZaDomain.A_zimbraNotebookAccount]);
				account.rename(tmpObj.attrs[ZaDomain.A_zimbraNotebookAccount]);
			}

            //change the catchAllMailAddress for the account
            if (catchAllChanged) {
                //1. remove the old account catchAll
                if(!AjxUtil.isEmpty(this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress]) && !AjxUtil.isEmpty(this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress].id)) {
                	ZaAccount.modifyCatchAll (this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress].id, "") ;
                } else if (this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress] && ZaItem.ID_PATTERN.test(this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress])) {
                	ZaAccount.modifyCatchAll (this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress], "") ;
                }
                if(!AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress]) && !AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress].id)) {
                //2. Add the new account catchAll
                	ZaAccount.modifyCatchAll (tmpObj[ZaAccount.A_zimbraMailCatchAllAddress].id, this._currentObject.attrs[ZaDomain.A_domainName]) ;
                } else if(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress] && ZaItem.ID_PATTERN.test(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress])) {
                	ZaAccount.modifyCatchAll (tmpObj[ZaAccount.A_zimbraMailCatchAllAddress], this._currentObject.attrs[ZaDomain.A_domainName]) ;	
                	
                }
                if(!AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress])  && !AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress].id)) {
                //3. Set the new catchAll value to the current object
                	this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress] = tmpObj[ZaAccount.A_zimbraMailCatchAllAddress] ;
                } else if (!AjxUtil.isEmpty(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress]) && ZaItem.ID_PATTERN.test(tmpObj[ZaAccount.A_zimbraMailCatchAllAddress])) {
                	var acc = new ZaAccount(ZaApp.getInstance());
                	acc.load("id",tmpObj[ZaAccount.A_zimbraMailCatchAllAddress],false,true);
                	this._currentObject[ZaAccount.A_zimbraMailCatchAllAddress] = acc;
                }
            }

			if(haveSmth) {
				try {	
					this._currentObject.modify(mods, tmpObj);
				} catch (ex) {
					this._handleException(ex, "ZaAccountViewController.prototype._saveChanges", null, false);	
					return false;
				}
            }
			if(writeACLs) {
				if(permsToRevoke.length>0) {
					ZaDomain.revokeNotebookACLs(permsToRevoke, this.saveChangesCallback);
				}				
				var accountName = tmpObj[ZaDomain.A_NotebookAccountName] ? tmpObj[ZaDomain.A_NotebookAccountName] : tmpObj.attrs[ZaDomain.A_zimbraNotebookAccount];					
				ZaDomain.grantNotebookACLs(tmpObj, accountName, this.saveChangesCallback);				
			}
			/*var command = new ZmCsfeCommand();
			var params = new Object();
			
			if(writeACLs) {
				if(permsToRevoke.length>0) {
					ZaDomain.getRevokeACLsrequest(permsToRevoke, soapDoc);
				}
				params.accountName = tmpObj[ZaDomain.A_NotebookAccountName] ? tmpObj[ZaDomain.A_NotebookAccountName] : tmpObj.attrs[ZaDomain.A_zimbraNotebookAccount];					
				ZaDomain.getNotebookACLsRequest	(tmpObj,soapDoc);
				
			}
	

			params.soapDoc = soapDoc;	
			var callback = new AjxCallback(this, this.saveChangesCallback);	
			params.asyncMode = true;
			params.callback = callback;			
			var reqMgrParams = {
				controller : ZaApp.getInstance().getCurrentController(),
				busyMsg : ZaMsg.BUSY_MODIFY_DOMAIN
			}	
			ZaRequestMgr.invoke(params, reqMgrParams);*/			
			//command.invoke(params);
			return true;
		} catch (ex) {
			this._handleException(ex,"ZaDomainController.prototype._saveChanges");
		}
	} else {
		return true;
	}
}



ZaDomainController.prototype.newDomain = 
function () {
	this._currentObject = new ZaDomain();
	
	this._currentObject.getAttrs = {all:true};
	/*this._currentObject.setAttrs = {all:true};
	this._currentObject.rights = {};
	this._currentObject._defaultValues = {attrs:{}};*/
	
	this._currentObject.loadNewObjectDefaults();
	this._showNewDomainWizard();
}

ZaDomainController.prototype._showNewDomainWizard = 
function () {
	try {
		this._newDomainWizard = ZaApp.getInstance().dialogs["newDomainWizard"] = new ZaNewDomainXWizard(this._container);	
		this._newDomainWizard.registerCallback(DwtWizardDialog.FINISH_BUTTON, ZaDomainController.prototype._finishNewButtonListener, this, null);			
		this._newDomainWizard.setObject(this._currentObject);
		this._newDomainWizard.popup();
	} catch (ex) {
			this._handleException(ex, "ZaDomainController.prototype._showNewDomainWizard", null, false);
	}
}

// new button was pressed
ZaDomainController.prototype._newButtonListener =
function(ev) {
	if(this._view.isDirty()) {
		//parameters for the confirmation dialog's callback 
		var args = new Object();		
		args["params"] = null;
		args["obj"] = ZaApp.getInstance().getDomainController();
		args["func"] = ZaDomainController.prototype.newDomain;
		//ask if the user wants to save changes		
		//ZaApp.getInstance().dialogs["confirmMessageDialog"] = ZaApp.getInstance().dialogs["confirmMessageDialog"] = new ZaMsgDialog(this._view.shell, null, [DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON, DwtDialog.CANCEL_BUTTON]);								
		ZaApp.getInstance().dialogs["confirmMessageDialog"].setMessage(ZaMsg.Q_SAVE_CHANGES, DwtMessageDialog.INFO_STYLE);
		ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.YES_BUTTON, this.saveAndGoAway, this, args);		
		ZaApp.getInstance().dialogs["confirmMessageDialog"].registerCallback(DwtDialog.NO_BUTTON, this.discardAndGoAway, this, args);		
		ZaApp.getInstance().dialogs["confirmMessageDialog"].popup();
	} else {
		this.newDomain();
	}	
}


ZaDomainController.prototype.viewAccountsButtonListener  =
function (ev) {
   var domainName = this._view.getObject().name ;
   ZaDomain.searchAccountsInDomain (domainName) ;
}

ZaDomainController.prototype._galWizButtonListener =
function(ev) {
	try {
		this._galWizard = ZaApp.getInstance().dialogs["galWizard"] = new ZaGALConfigXWizard(this._container);	
		this._galWizard.registerCallback(DwtWizardDialog.FINISH_BUTTON, ZaDomainController.prototype._finishGalButtonListener, this, null);			
		this._galWizard.setObject(this._currentObject);
		this._galWizard.popup();
	} catch (ex) {
			this._handleException(ex, "ZaDomainController.prototype._showGalWizard", null, false);
	}
}


ZaDomainController.prototype._authWizButtonListener =
function(ev) {
	try {
		this._authWizard = ZaApp.getInstance().dialogs["authWizard"] =  new ZaAuthConfigXWizard(this._container);	
		this._authWizard.registerCallback(DwtWizardDialog.FINISH_BUTTON, ZaDomainController.prototype._finishAuthButtonListener, this, null);			
		this._authWizard.setObject(this._currentObject);
		this._authWizard.popup();
	} catch (ex) {
			this._handleException(ex, "ZaDomainController.prototype._showAuthWizard", null, false);
	}
}

ZaDomainController.prototype._finishGalButtonListener =
function(ev) {
	try {
		//var changeDetails = new Object();
		ZaDomain.modifyGalSettings.call(this._currentObject, this._galWizard.getObject()); 
		//if a modification took place - fire an DomainChangeEvent
		//changeDetails["obj"] = this._currentObject;
		this.fireChangeEvent(this._currentObject);
		this._view.setObject(this._currentObject);		
		this._galWizard.popdown();
	} catch (ex) {
		this._handleException(ex, "ZaDomainController.prototype._finishGalButtonListener", null, false);
	}
	return;
}

ZaDomainController.prototype._finishAuthButtonListener =
function(ev) {
	try {
		ZaDomain.modifyAuthSettings.call(this._currentObject,this._authWizard.getObject());
		//var changeDetails = new Object();
		//if a modification took place - fire an DomainChangeEvent
		//changeDetails["obj"] = this._currentObject;
	
		this.fireChangeEvent(this._currentObject);
		this._view.setObject(this._currentObject);
		this._authWizard.popdown();
	} catch (ex) {
		this._handleException(ex, "ZaDomainController.prototype._finishAuthButtonListener", null, false);
	}
	return;
}

/**
* @param 	ev event object
* This method handles "finish" button click in "New Domain" dialog
**/

ZaDomainController.prototype._finishNewButtonListener =
function(ev) {
	try {
		var domain = ZaDomain.create(this._newDomainWizard.getObject());
		domain.load("id",domain.id,false,true);
		if(domain != null) {
			//if creation took place - fire an DomainChangeEvent
			this.fireCreationEvent(domain);
			if(domain.rights && domain.rights[ZaDomain.RIGHT_DELETE_DOMAIN])
				this._toolbar.getButton(ZaOperation.DELETE).setEnabled(true);
					
			this._newDomainWizard.popdown();		
			if(this._newDomainWizard.getObject()[ZaDomain.A_CreateNotebook]=="TRUE") {
				var params = new Object();
			//	if(this._newDomainWizard.getObject()[ZaDomain.A_OverwriteNotebookACLs]) {
					params[ZaDomain.A_OverwriteNotebookACLs] = true;
					params.obj = this._newDomainWizard.getObject();
			//	} else
					params[ZaDomain.A_OverwriteNotebookACLs] = false;
					
				var callback = new AjxCallback(this, this.initNotebookCallback, params);				
				ZaDomain.initNotebook(this._newDomainWizard.getObject(),callback, this) ;
			}
		}
	} catch (ex) {
		if(ex.code == ZmCsfeException.DOMAIN_EXISTS) {
			this.popupErrorDialog(ZaMsg.ERROR_DOMAIN_EXISTS, ex);		
		} else {
			this._handleException(ex, "ZaDomainController.prototype._finishNewButtonListener", null, false);
		}
	}
	return;
}

ZaDomainController.prototype.initNotebookCallback = 
function (params, resp) {
	if(!resp)
		return;
	if(resp.isException()) {
		this._handleException(resp.getException(), "ZaDomainController.prototype._initNotebookCallback", null, false);
		return;
	} 
//	if(params[ZaDomain.A_OverwriteNotebookACLs] && params.obj!=null) {
		var callback = new AjxCallback(this, this.setNotebookAclsCallback);				
		ZaDomain.setNotebookACLs(params.obj, callback) ;
//	}	
	this._currentObject.refresh(false,true);
	this.show(this._currentObject);
}

ZaDomainController.prototype.setNotebookAclsCallback = 
function (resp) {
	if(!resp)
		return;
	if(resp.isException()) {
		this._handleException(resp.getException(), "ZaDomainController.prototype.setNotebookAclsCallback", null, false);
		return;
	} 
}


ZaDomainController.prototype._finishDomainNotebookListener =
function(ev) {
	try {
		var obj = this._initDomainNotebookWiz.getObject();
		if(obj[ZaDomain.A_NotebookAccountPassword] != obj[ZaDomain.A_NotebookAccountPassword2]) {
			this.popupErrorDialog(ZaMsg.ERROR_PASSWORD_MISMATCH);
			return;
		}
		this._initDomainNotebookWiz.popdown();
		var params = new Object();
		params.obj = obj;
			
		var callback = new AjxCallback(this, this.initNotebookCallback, params);
		ZaDomain.initNotebook(this._initDomainNotebookWiz.getObject(),callback, this) ;
	} catch (ex) {
		this._initDomainNotebookWiz.popdown();
		this._handleException(ex, "ZaDomainController.prototype._finishDomainNotebookListener", null, false);
	}
	return;
}

ZaDomainController.prototype._checkMXButtonListener = 
function (ev) {
	var callback = new AjxCallback(this, this.checkMXCallback);
	ZaDomain.checkDomainMXRecord(this._currentObject, callback);
}

ZaDomainController.prototype.checkMXCallback = 
function (resp) {
	if(!resp)
		return;
	if(resp.isException()) {
		var ex = resp.getException();
		if(ex.msg && (ex.msg.indexOf("NameNotFoundException")>0 || ex.msg.indexOf("NoMXRecordsForDomain")>0)) {
			this.popupErrorDialog(AjxMessageFormat.format(ZaMsg.failedToGetMXRecords, [this._currentObject.name]));
		} else {
			this._handleException(resp.getException(), "ZaDomainController.prototype.checkMXCallback", null, false);
		}
		return;
	} 
	var response = resp.getResponse().Body.CheckDomainMXRecordResponse;
	if(response.code[0]._content=="Ok") {
		this.popupMsgDialog(ZaMsg.MX_RecordCheckSuccess);
	} else {
		var msgArray = [];
		msgArray.push(ZaMsg.foundTheseMXRecords);
		if(response.entry && response.entry.length>0) {
			var cnt = response.entry.length;
			for (var i=0;i<cnt;i++) {
				msgArray.push(response.entry[i]._content);
			}
		}
		this._errorDialog.setMessage(response.message[0]._content, msgArray.join("<br/>"), DwtMessageDialog.CRITICAL_STYLE, ZaMsg.zimbraAdminTitle);
		this._errorDialog.popup();
	}
	
}

ZaDomainController.prototype._initNotebookButtonListener = 
function (ev) {
	try {
		this._initDomainNotebookWiz = ZaApp.getInstance().dialogs["initDomainNotebookWiz"] = new ZaDomainNotebookXWizard(this._container);	
		this._initDomainNotebookWiz.registerCallback(DwtWizardDialog.FINISH_BUTTON, ZaDomainController.prototype._finishDomainNotebookListener, this, null);			
		this._initDomainNotebookWiz.setObject(this._currentObject);
		this._initDomainNotebookWiz.popup();
	} catch (ex) {
		this._handleException(ex, "ZaDomainController.prototype._initNotebookButtonListener", null, false);
	}	
}

ZaDomainController.prototype._handleException = 
function (ex, method, params, restartOnError, obj) {
	if(ex.code == ZmCsfeException.DOMAIN_NOT_EMPTY) {
		this.popupErrorDialog(ZaMsg.ERROR_DOMAIN_NOT_EMPTY);
		
	} else if(ex.code == ZmCsfeException.DOMAIN_EXISTS) {
		this.popupErrorDialog(ZaMsg.ERROR_DOMAIN_EXISTS);
		
	} else {
		ZaController.prototype._handleException.call(this, ex, method, params, restartOnError, obj);				
	}	
}
