/**
 * The communicator, manages requests to exterior sources
 */
ServiceBox.communicator = {
	
	request : {name : 'ServiceBox', service : '', action : '', objectID : null, objectType : '', data : []},
	
	response : {success : false, msg : '', data : [], errors : []},
	
	insertData : function(service, objectType, data)
	{
		var context = this;
		
		context.request.action = 'insert';
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		context.sendRequest(context.request);
	},
	
	updateData : function(service, objectID, objectType, data)
	{
		var context = this;
		
		context.request.action = 'update';
		context.request.objectID = objectID;
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	deleteData : function(service, objectID, objectType)
	{
		var context = this;
		
		context.request.action = 'delete';
		context.request.objectID = objectID;
		context.request.objectType = objectType;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	getData : function(service, objectType, data)
	{
		var context = this;
		
		context.request.action = 'get';
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	getResponse : function()
	{
		return this.response;
	},
	
	sendRequest : function(request, dont_display_error)
	{
		var context = this;
		var pop = ServiceBox.popup;
		var auth = ServiceBox.auth;
		
		$.ajax({
			crossDomain : true,
			url : ServiceBox.config.back_end_base,
			type : 'POST',
			data : context.request,
			cache : false,
			async : false,
			dataType : 'JSON',
			statusCode : {
				404 : function(){
					pop.create('ajax_error', 'Request Failed', 'ServiceBox Back service offline');
					pop.run();
					
					dont_display_error = true;
				},
				0 : function(){
					pop.create('ajax_error', 'Request Failed', 'ServiceBox Back service offline');
					pop.run();
					
					dont_display_error = true;
				}
			}
		}).done(function(data){
			context.response = data;
			if ( context.response.msg == 'service_needs_login' )
			{
				context.response.success = false;
				auth.bringUpLogin();
			}
			
		}).fail(function(jqXHR, textStatus, error){
			context.response.success = false;
			context.response.msg = jqXHR.statusText;
			if ( !dont_display_error )
			{
				pop.create('ajax_error', 'Request Failed', textStatus+' '+error);
				pop.run();
			}
		});
	}
	
}