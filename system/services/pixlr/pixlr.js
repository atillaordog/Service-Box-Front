ServiceBox.temp_service = 
{
	slug : 'pixlr',
	
	name : 'Image Editor',
	
	description : 'Image Editor',
	
	getIcon : function()
	{
		return 'http://i.i.cbsi.com/cnwk.1d/i/tim2/2014/05/21/Foreman_13743709_408_icon_64x64.png';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/pixlr/frame.html',
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
		win.css('max-width', '1100px');
		ServiceBox.box_container.append(win);
	}
}