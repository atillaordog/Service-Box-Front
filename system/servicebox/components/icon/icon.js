ServiceBox.icon = 
{
	create : function(slug, icon_url, icon_name)
	{
		var icon = $('#blank_icon').clone();
		icon.show();
		
		icon.find('.icon-link').attr('id', 'icon-link-'+slug);
		icon.find('.icon-text').attr('id', 'icon-text-'+slug);
		
		var img = '<img src="'+icon_url+'" width="64">';
		
		icon.find('.icon-link').html(img);
		icon.find('.icon-text').html(icon_name);
		
		return icon;
	}
}