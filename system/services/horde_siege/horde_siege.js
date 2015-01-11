ServiceBox.temp_service = 
{
	slug : 'horde_siege',
	
	name : 'Horde Siege',
	
	description : 'Horde Siege game',
	
	getIcon : function()
	{
		return 'http://wiki.guildwars.com/images/d/d5/Junundu_Siege.jpg';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/horde_siege/horde_siege.html',
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
		win.css('max-width', '680px');
		ServiceBox.box_container.append(win);
	}
}