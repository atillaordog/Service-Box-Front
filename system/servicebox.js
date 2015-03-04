var ServiceBox = {
	
	/**
	 * @var ServiceBox.config The object that holds the system configuration
	 */
	config : null,
	
	/**
	 * @var Array The dependencies that need to be loaded for the system to work
	 */
	dependencies : [
		{url : 'system/servicebox/config.js', loaded : false},
		{url : 'system/servicebox/components/icon/icon.js', loaded : false},
		{url : 'system/servicebox/components/box/box.js', loaded : false},
		{url : 'system/servicebox/components/popup/popup.js', loaded : false},
		{url : 'system/servicebox/plugger.js', loaded : false},
		{url : 'system/servicebox/events.js', loaded : false},
		{url : 'system/servicebox/communicator.js', loaded : false},
		{url : 'system/servicebox/components/auth/auth.js', loaded : false},
		{url : 'system/servicebox/lang.js', loaded : false}
	],
	
	/**
	 * @var Array The html components needed to run the system
	 */
	components : [
		{url : 'system/servicebox/components/icon/icon.html', loaded : false},
		{url : 'system/servicebox/components/box/box.html', loaded : false},
		{url : 'system/servicebox/components/popup/popup.html', loaded : false}
	],
	
	/**
	 * @var int Number of loaded dependencies to check if all dependencies were loaded
	 */
	nr_loaded_deps : 0,
	
	/**
	 * @var int Number of loaded components
	 */
	nr_loaded_components : 0,
	
	/**
	 * @var Array Contains all the services as unique_key => Service
	 */
	services : [],
	
	/** 
	 * @var ServiceBox.Plugger The object that is responsible for plugging in all the modules of the system
	 */
	plugger : null,
	
	/**
	 * @var jQuery Object Holds the main window container
	 */
	box_container : null,
	
	/**
	 * @var jQuery Object Holds the main icon container
	 */
	icon_container : null,
	
	/**
	 * @var jQuery Object Holds the container for components
	 */
	components_container : null,
	
	/**
	 * @var string Holds the currently used language
	 */
	current_lang : 'EN',
	
	/**
	 * Used instead of the constructor, inits the system, loads files, etc
	 */
	initSystem : function()
	{
		this.components_container = $('.components-holder');
		
		this.blockSystem();
		this.loadDependencies();
		this.loadComponents();
		
		var context = this;
		var max_loading_iterations = 40;
		var intervalID = setInterval(function(){
			if ( context.nr_loaded_deps == context.dependencies.length && context.nr_loaded_components == context.components.length )
			{
				clearInterval(intervalID);
				intervalID = false;
				context.unblockSystem();
				
				context.plugger.loadServices('/');
				
				context.box_container = $('#window-container');
				context.icon_container = $('#icon-holder');
				
				context.events.init();
				context.lang.loadTranslations();
				
				context.runSystem();
			}
			
			max_loading_iterations--;
			
			if ( max_loading_iterations <= 0 )
			{
				context.displayException('Could not load dependencies');
				clearInterval(intervalID);
				intervalID = false;
				context.unblockSystem();
			}
		}, 100);
	},
	
	/**
	 * This is the main execution of the system, add all code here that needs to be run after system initialization
	 */
	runSystem : function()
	{
		ServiceBox.auth.checkBackIsLoggedIn();
		console.log('System ready');
		
		//$('#icon-link-car_wash').trigger('click');
		//$('#window-car_wash .fullscreen-window').trigger('click');
	},
	
	/**
	 * Loads the dependencies that are required to run the system
	 */
	loadDependencies : function()
	{	
		var context = this;
		
		$.each(this.dependencies, function(index, value){
			$.getScript(value.url).done( function( script, textStatus ) {
				context.dependencies[index].loaded = true;
				context.nr_loaded_deps++;
			})
			.fail( function( jqxhr, settings, exception ) {
				console.log('Loading dependancy "'+value.url+'" failed.');
			});
		});
	},
	
	loadComponents : function()
	{
		var context = this;
		
		$.each(this.components, function(index, value){
			$.ajax({
				url : value.url,
				cache : false,
				async : false,
				dataType : 'html'
			}).done(function(data){
				context.components_container.append(data);
				context.components[index].loaded = true;
				context.nr_loaded_components++;
			}).fail(function(data){
				ServiceBox.box.addContent('Failed to load component '+value.url);
			});
		});
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