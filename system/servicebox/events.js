ServiceBox.events = 
{
	init : function()
	{
		this.addIconEvents();
		this.addWindowActionEvents();
	},
	
	addIconEvents : function()
	{
		$('body').on('click', '.icon-action', function(){
			var id = $(this).attr('id');
			
			slug = id.split('-');
			slug = slug[ slug.length - 1 ];
			
			if ( slug in ServiceBox.services )
			{
				ServiceBox.services[slug].run();
			}
			else
			{
				console.log('Service '+slug+' cannot be run!');
			}
		});
	},
	
	addWindowActionEvents : function()
	{
		$('body').on('click', '.close-window', function(){
			$(this).parents('.window').remove();
		});
	}
}