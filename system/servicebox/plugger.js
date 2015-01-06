/** 
 * This part of the system loads the services
 */
ServiceBox.plugger = {
	name : 'Plugger',
	
	/**
	 * This function is responsible for loading all the services, from local computer and from server, too
	 */
	loadServices : function()
	{
		// Get the list of local services
		var preset_services = ServiceBox.config.preset_services;
		$.each(preset_services, function(index, value){
			$.getScript('system/services/'+value.slug+'/'+value.slug+'.js').done( function( script, textStatus ) {
				ServiceBox.services[value.slug] = ServiceBox.temp_service;
				
				ServiceBox.icon_container.append( ServiceBox.icon.create(ServiceBox.temp_service.slug, ServiceBox.temp_service.getIcon()) );
			})
			.fail( function( jqxhr, settings, exception ) {
				console.log('Loading service '+value.slug+' failed.');
			});
		});
	}
};
