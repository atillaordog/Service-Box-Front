ServiceBox.temp_service = 
{
	slug : 'radio',
	
	name : 'Online radio',
	
	description : 'Small online radio with three stations',
	
	getIcon : function()
	{
		return 'http://static.allmyapps.com/data/apps/3/4/3455/dd1321191aaf1b89e4549231d96b93cd_icon.png';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/radio/vendor/radio.html',
			cache : false,
			async : false,
			dataType : 'html'
		}).done(function(data){
			ServiceBox.box.addContent(data);
		}).fail(function(data){
			ServiceBox.box.addContent('Failed to load radio.');
			console.log(data);
		});
		
		var win = ServiceBox.box.render();
		win.css('max-width', '300px');
		ServiceBox.box_container.append(win);
	}
}