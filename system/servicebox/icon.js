ServiceBox.icon = 
{
	create : function(slug, icon_url)
	{
		var icon = $('#blank_icon').clone();
		icon.show();
		
		icon.find('a').attr('id', 'icon-'+slug);
		
		var img = '<img src="'+icon_url+'" width="64">';
		
		icon.find('a').html(img);
		
		return icon;
	}
}