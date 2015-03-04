ServiceBox.temp_service = 
{
	slug : 'dos_games',
	
	name : 'Dos Games',
	
	description : 'Dos Games with Archive.org emulation',
	
	getIcon : function()
	{
		return 'http://www.vogons.org/download/file.php?avatar=26231_1396473033.png';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/dos_games/dos_games.html',
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
		win.css('width', '1100px');
		ServiceBox.box_container.append(win);
		
		this.addEvents();
	},
	
	addEvents : function()
	{
		$('body').on('click', '.dos-games-list a', function(e){
			e.preventDefault();
			
			var iframe = $('<iframe>');
			iframe.attr('src', $(this).attr('href'));
			iframe.attr('width', '800px');
			iframe.attr('height', '600px');
			
			$('.dos-games-emulator-holder').html(iframe);
		});
		
		$('body').on('change keyup', '.dos-games-search-field', function(){
			var s = $(this).val();
			console.log(s);
			if ( $.trim(s) == "" )
			{
				$('.dos-games-list li').show();
			}
			else
			{
				var result = $('.dos-games-list').find('li:Contains("'+s+'")');
				$('.dos-games-list li').hide();
				result.each(function(){
					$(this).show();
				});
			}
		});
	}
}