/**
 * This is a box used for service views, like a window
 */
ServiceBox.box = 
{
	instance : null,
	
	create : function(slug)
	{
		this.instance = $('#blank_window').clone();
		this.instance.attr('id', 'window-'+slug);
		this.instance.show();
	},
	
	addTitle : function(title)
	{
		this.instance.find('.window-header').html(title);
	},
	
	addContent : function(content)
	{
		this.instance.find('.window-content').html(content);
	},
	
	setSizes : function(width, height)
	{
		this.instance.css('width', width);
		this.instance.find('window-content').css('height', height);
	},
	
	render : function()
	{
		return this.instance;
	}
}