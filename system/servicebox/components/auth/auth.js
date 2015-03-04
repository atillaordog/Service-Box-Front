/**
 * Serves the role of authentication
 */
ServiceBox.auth = 
{
	bringUpLogin : function()
	{
		var pop = ServiceBox.popup;
		
		$.ajax({
			url : 'system/servicebox/components/auth/lic.html',
			cache : false,
			async : false,
			dataType : 'html'
		}).done(function(data){
			pop.create('login_form', 'Login', data);
			pop.hideFooter();
			pop.run();
		}).fail(function(jqXHR, textStatus, error){
			pop.create('ajax_error', 'Request Failed', textStatus+' '+error);
			pop.run();
		});
	},
	
	setLoggedIn : function(status)
	{
		this.isLoggedIn = status;
		
		if ( this.isLoggedIn )
		{
			$('.servicebox-login-button').hide();
			$('.servicebox-logout-button').show();
		}
		else
		{
			$('.servicebox-login-button').show();
			$('.servicebox-logout-button').hide();
		}
	},
	
	isLoggedIn : false,
	
	checkBackIsLoggedIn : function()
	{
		ServiceBox.communicator.request.action = 'is_logged_in';
		ServiceBox.communicator.request.objectType = 'user';
		ServiceBox.communicator.request.service = 'auth';
		ServiceBox.communicator.sendRequest(ServiceBox.communicator.request, true);
		
		var response = ServiceBox.communicator.getResponse();
		
		if ( response.success )
		{
			ServiceBox.auth.setLoggedIn(true);
		}
		else
		{
			ServiceBox.auth.setLoggedIn(false);
		}
	}
}