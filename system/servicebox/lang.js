ServiceBox.lang = {
	
	/**
	 * @var array Holds all the loaded translations
	 */
	loaded_translations : [],
	
	loadTranslations : function()
	{	
		var context = this;
		
		$.getScript('system/lang/'+ServiceBox.current_lang+'.js').done( function( script, textStatus ) {
			context.loaded_translations.push(ServiceBox.temp_lang);
			context.translatePage();
		})
		.fail( function( jqxhr, settings, exception ) {
			console.log('Loading language '+ServiceBox.current_lang+' failed');
		});
	},
	
	getLangVar : function(lang_var)
	{
		if ( this.loaded_translations.hasOwnProperty(lang_var) )
		{
			return this.loaded_translations[ lang_var ];
		}
		
		return lang_var;
	},
	
	translatePage : function()
	{
		$('.servicebox-translate').each(function(){
			
			if ( $(this).children().length == 0 )
			{
				var lang_var = $(this).data('lang_var');
				
				var translated_var = ServiceBox.lang.getLangVar(lang_var);
				
				if ( translated_var != lang_var )
				{
					$(this).html(translated_var);
				}
			}
		});
	}
}