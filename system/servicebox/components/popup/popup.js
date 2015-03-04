ServiceBox.popup = {
	instance : null,
	
	sizes : {'small' : 'modal-sm', 'large' : 'modal-lg'},
	
	create : function(id, title, content)
	{
		this.instance = $('#blank_popup').clone();
		
		this.instance.attr('id', id);
		this.instance.attr('aria-labelledby', id);
		this.instance.find('.modal-title').html(title);
		this.instance.find('.modal-body').html(content);
		
		$('body').append(this.instance);
	},
	
	setSize : function(size)
	{
		this.instance.find('.modal-dialog').addClass(this.sizes[size]);
	},
	
	hideFooter : function()
	{
		this.instance.find('.modal-footer').hide();
	},
	
	run : function()
	{
		$('#'+this.instance.attr('id')).modal();
	}
}