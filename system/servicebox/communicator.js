/**
 * The communicator, manages requests to exterior sources
 */
ServiceBox.communicator = {
	
	request : {type : 1, name : 'ServiceBox', service : '', action : '', objectID : null, objectType : '', data : [], customAction : ''},
	
	response : {success : false, msg : '', data : [], errors : []},
	
	insertData : function(service, objectType, data)
	{
		var context = this;
		
		context.request.action = 'Insert';
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		context.sendRequest(context.request);
	},
	
	updateData : function(service, objectID, objectType, data)
	{
		var context = this;
		
		context.request.action = 'Update';
		context.request.objectID = objectID;
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	deleteData : function(service, objectID, objectType)
	{
		var context = this;
		
		context.request.action = 'Delete';
		context.request.objectID = objectID;
		context.request.objectType = objectType;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	getData : function(service, objectType, data)
	{
		var context = this;
		
		context.request.action = 'Get';
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	searchData: function(service, objectType, data)
	{
		var context = this;
		
		context.request.action = 'Search';
		context.request.objectType = objectType;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
	},
	
	getResponse : function()
	{
		return this.response;
	},
	
	performCustomAction : function(service, customAction, data)
	{
		var context = this;
		
		context.request.action = 'Custom';
		context.request.customAction = customAction;
		context.request.data = data;
		context.request.service = service;
		
		context.sendRequest(context.request);
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