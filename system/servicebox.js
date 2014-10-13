var ServiceBox = {
	
	/**
	 * @var Array The dependencies that need to be loaded for the system to work
	 */
	dependencies : [
		{url : 'system/servicebox/plugger.js', loaded : false}
	],
	
	/**
	 * @var int Number of loaded dependencies to check if all dependencies were loaded
	 */
	nr_loaded_deps : 0,
	
	/**
	 * @var Array Contains all the services as unique_key => Service
	 */
	services : [],
	
	/** 
	 * @var ServiceBox.Plugger The object that is responsible for plugging in all the modules of the system
	 */
	plugger : null,
	
	/**
	 * Used instead of the constructor, inits the system, loads files, etc
	 */
	initSystem : function()
	{
		this.loadDependencies();
	},
	
	/**
	 * Loads the dependencies that are required to run the system
	 */
	loadDependencies : function()
	{	
		var context = this;
		
		context.blockSystem();
		
		$.each(this.dependencies, function(index, value){
			$.getScript(value.url).done( function( script, textStatus ) {
				context.dependencies[index].loaded = true;
				context.nr_loaded_deps++;
			})
			.fail( function( jqxhr, settings, exception ) {
				console.log('Loading dependancy failed.');
			});
		});
		
		context.loading_iterations = 0;
		
		var intervalIdentifier = setInterval(function(){
			if ( context.nr_loaded_deps == context.dependencies.length )
			{
				context.unblockSystem();
				clearInterval(intervalIdentifier);
				delete context.loading_iterations;
			}
			
			context.loading_iterations++;
			
			if ( context.loading_iterations >= 20 )
			{
				context.unblockSystem();
				context.displayException('Could not load dependencies, please try to refresh the page.');
				clearInterval(intervalIdentifier);
				delete context.loading_iterations;
			}
		}, 100);
	},
	
	/**
	 * Displays a full-screen loading animation until the system loads or processes
	 */
	blockSystem : function()
	{
		var loader = '<div class="container-fluid" id="blocker"><img src="assets/images/ajax_loader_gray_350.gif"></div>';
		
		$('body').append(loader);
	},
	
	/**
	 * Removes the blocking from the system
	 */
	unblockSystem : function()
	{
		$('#blocker').remove();
	},
	
	/**
	 * Display an exception on the page
	 * @param string text The text to display as exception
	 */
	displayException : function(text)
	{
		var exception = '<div class="container-fluid" id="exception">';
		exception += '<div class="row">';
		exception += '<div class="col-xs-12 text-center">'+text+'</div>';
		exception += '<div class="col-xs-12 text-center"><button class="btn btn-primary" onclick="$(this).parents(\'#exception\').remove();">OK</button></div>';
		exception += '<div>';
		exception += '<div>';
		
		$('body').append(exception);
	}
};

$(document).ready(function(){
	ServiceBox.initSystem();
});