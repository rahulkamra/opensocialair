gadgets.DemoAppGadget = function(opt_params) {
  gadgets.IfrGadget.call(this, opt_params);
};

gadgets.DemoAppGadget.inherits(gadgets.IfrGadget);

gadgets.DemoAppGadget.prototype.getTitleBarContent=function(continuation) {
	if(this.viewMode==1){
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '" class="' + this.cssClassTitleBar + '"><span id="' +
      this.getIframeId() + '_title" class="' +
      this.cssClassTitle + '">' + (this.title ? this.title : 'Title') + '</span><span class="' +
      this.cssClassTitleButtonBar +
      '"></span></div>');
}else{

	continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '" class="' + this.cssClassTitleBar + '"><span id="' +
      this.getIframeId() + '_title" class="' +
      this.cssClassTitle + '">' + (this.title ? this.title : 'Title') + '</span> | <span class="' +
      this.cssClassTitleButtonBar +
      '"><a href="#" onclick="gadgets.container.getGadget(' + this.id +
      ').handleOpenUserPrefsDialog();return false;" class="' + this.cssClassTitleButton +
      '">settings</a> <a href="#" onclick="gadgets.container.getGadget(' +
      this.id + ').handleToggle();return false;" class="' + this.cssClassTitleButton +
      '">toggle</a></span></div>');
}
};
gadgets.DemoAppGadget.prototype.getBottomBarContent = function(continuation) {
	if(this.user=="viewer"){
	if(this.viewMode==1){
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '-footer" class="' + this.cssClassTitleBar + '"><span class="' +
      this.cssClassTitleButtonBar +
      '"><a href="javascript:View()">View</a> | <a href="removeGadget.php?gadget=' + this.gadget_url +'" onclick="return confirmDelete();">Remove</a> | <a href="sharegadget_friends.php?gadget=' + this.gadget_url +'">Share App</a></span></div>');
	}else{
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '-footer" class="' + this.cssClassTitleBar + '"><span class="' +
      this.cssClassTitleButtonBar +
      '"><a href="removeGadget.php?gadget=' + this.gadget_url +'" onclick="return confirmDelete();">Remove</a> | <a href="sharegadget_friends.php?gadget=' + this.gadget_url +'">Share App</a></span></div>');
	 }
	}
	else{
	if(this.viewMode==1){
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '-footer" class="' + this.cssClassTitleBar + '"><span class="' +
      this.cssClassTitleButtonBar +
      '"><a href="javascript:View()">View</a></span></div>');
	}else{
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '-footer" class="' + this.cssClassTitleBar + '"><span class="' +
      this.cssClassTitleButtonBar +
      '"></span></div>');
	 }
	}
};


gadgets.DemoAppGadget.prototype.getContent = function(continuation) {
  gadgets.callAsyncAndJoin([
      this.getTitleBarContent, this.getUserPrefsDialogContent,
      this.getMainContent ,this.getBottomBarContent],function(results) {
        continuation(results.join(''));
      }, this);
};


gadgets.DemoAppContainer = function() {
  gadgets.IfrContainer.call(this);
};
  
gadgets.DemoAppContainer.inherits(gadgets.IfrContainer);

gadgets.DemoAppContainer.prototype.gadgetClass = gadgets.DemoAppGadget;

gadgets.container = new gadgets.DemoAppContainer();
