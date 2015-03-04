ServiceBox.events = 
{
	init : function()
	{
		this.addIconEvents();
		this.addWindowActionEvents();
		this.addPopupActionEvents();
		this.addAuthEvents();
	},
	
	addIconEvents : function()
	{
		$('body').on('click', '.icon-action', function(){
			var id = $(this).attr('id');
			
			slug = id.split('-');
			slug = slug[ slug.length - 1 ];
			
			if ( slug in ServiceBox.services )
			{
				ServiceBox.communicator.request.action = 'service_needs_auth';
				ServiceBox.communicator.request.objectType = 'blank';
				ServiceBox.communicator.request.service = slug;
				ServiceBox.communicator.sendRequest(ServiceBox.communicator.request);
				
				var response = ServiceBox.communicator.getResponse();
				
				if ( response.success )
				{
					if ( ServiceBox.auth.isLoggedIn )
					{
						ServiceBox.services[slug].run();
					}
					else
					{
						ServiceBox.auth.bringUpLogin();
					}
				}
				else
				{
					ServiceBox.services[slug].run();
				}
			}
			else
			{
				console.log('Service '+slug+' cannot be run!');
			}
			
			$(window).trigger('resize');
		});
	},
	
	addWindowActionEvents : function()
	{
		$('body').on('click', '.close-window', function(){
			$(this).parents('.window').remove();
			$(window).trigger('resize');
		});
		
		$('body').on('click', '.fullscreen-window', function(){
			var content = $(this).parents('.window').find('.window-content');
			content.css('width', '100%');
			
			$('.windowed-container').hide();
			$('nav').hide();
			$('.fullscreen-container').append(content);
			$('.fullscreen-container').show();
			$(window).trigger('resize');
		});
	},
	
	addPopupActionEvents : function()
	{
		$('body').on('click', '.popup-destroy', function(){
			
			$(this).parents('.modal').remove();
			$('.modal-backdrop').remove();
		});
	},
	
	addAuthEvents : function()
	{
		$('body').on('submit', '.servicebox-login-form', function(e){
			e.preventDefault();
			
			var form_data = $(this).serializeArray();
			var obj = {};
			for (var i = 0, l = form_data.length; i < l; i++) {
				obj[form_data[i].name] = form_data[i].value;
			}
			form_data = obj;
			
			ServiceBox.communicator.request.action = 'login';
			ServiceBox.communicator.request.data = form_data;
			ServiceBox.communicator.request.objectType = 'user';
			ServiceBox.communicator.request.service = 'auth';
			
			ServiceBox.communicator.sendRequest(ServiceBox.communicator.request);
			
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				ServiceBox.auth.setLoggedIn(true);
				
				$(this).parents('.modal').remove();
				$('.modal-backdrop').remove();
			}
			else
			{
				var form = $(this);
				$(this).find('.help-block').remove();
				
				$.each(response.errors, function(index, value){
					form.find('input[name="'+index+'"]').after('<span class="help-block" style="color:red;">'+value+'</span>');
				});
			}
			
			return false;
		});
		
		$('body').on('click', '.servicebox-login-button', function(){
			ServiceBox.auth.bringUpLogin();
		});
		
		$('body').on('click', '.servicebox-logout-button', function(){
			ServiceBox.communicator.request.action = 'logout';
			ServiceBox.communicator.request.objectType = 'user';
			ServiceBox.communicator.request.service = 'auth';
			ServiceBox.communicator.sendRequest(ServiceBox.communicator.request);
			
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				ServiceBox.auth.setLoggedIn(false);
			}
			else
			{
				ServiceBox.popup.create('logout_error', 'Could not log out', 'Could not log out');
				ServiceBox.popup.run();
			}
		});
	}
}