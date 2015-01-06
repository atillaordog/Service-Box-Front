ServiceBox.temp_service = 
{
	slug : 'calculator',
	
	name : 'Calculator',
	
	description : 'A small and simple calculator',
	
	getIcon : function()
	{
		return 'http://static.cfnet.ro/media/calculator-icon2.jpg';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/calculator/vendor/calculator.html',
			cache : false,
			async : false,
			dataType : 'html'
		}).done(function(data){
			ServiceBox.box.addContent(data);
		}).fail(function(data){
			ServiceBox.box.addContent('Failed to load calculator.');
			console.log(data);
		});
		
		ServiceBox.box_container.append(ServiceBox.box.render());
	}
}