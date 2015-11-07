ServiceBox.temp_service = 
{
	slug : 'car_wash',
	
	name : 'Car Wash',
	
	description : 'Car Wash',
	
	css : 'system/services/car_wash/assets/car_wash.css',
	
	getIcon : function()
	{
		return 'system/services/car_wash/icon.png';
	},
	
	run : function()
	{
		ServiceBox.box.create(this.slug);
		ServiceBox.box.addTitle(this.name);
		
		$.ajax({
			url : 'system/services/car_wash/parts/main.html',
			cache : false,
			async : false,
			dataType : 'html'
		}).done(function(data){
			ServiceBox.box.addContent(data);
		}).fail(function(data){
			ServiceBox.box.addContent('Failed to load car wash.');
		});
		
		var win = ServiceBox.box.render();
		
		win.css('float', 'none');
		ServiceBox.box_container.append(win);
		
		this.addEvents();
		this.startClock();
		this.initCarsAutocomplete();
		
		var context = this;
		var clock = setInterval(function(){
			context.startClock();
		}, 10000);
	},
	
	statuses : {
		0 : {comment : 'Waiting', slug : 'waiting'},
		1 : {comment : 'Processing', slug : 'processing'},
		2 : {comment : 'Completed', slug : 'completed'},
		3 : {comment : 'Suspended', slug : 'suspended'},
		9 : {comment : 'Taken', slug : 'taken'}
	},
	
	addEvents : function()
	{
		var context = this;
		var parentClass = '.panel-body';
		
		$('body').on('click', '.car-wash-add-car-button', function(){
			var parent = $(this).parents(parentClass);
			parent.find('.car-wash-main').hide();
			parent.find('.car-wash-add-car-form').show();
		});
		
		$('body').on('click', '.car-wash-car-list-button', function(){
			var parent = $(this).parents(parentClass);
			
			parent.find('.car-wash-main').hide();
			parent.find('.car-wash-list').show();
			parent.find('.car-wash-car-list-table tbody').html('');
			
			$(window).trigger('resize');
			parent.find('.car-wash-right-menu-button').hide();
			
			ServiceBox.communicator.getData(context.slug, 'car', {status:[0,1,2,3], date_created : context.getCurrentTimeinDateTimeFormat()});
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				var index = 0;
				for ( var i = 0; i < response.data.length; i++ )
				{
					var car = response.data[i];
					var tr = '<tr class="'+context.statuses[car.status].slug+'" data-car_id="'+car.id+'" data-status_id="'+car.status+'">';
					tr += '<td>'+i+'</td>';
					tr += '<td>'+car.plate_number+'</td>';
					tr += '<td>'+car.car_make+'-'+car.car_type+'</td>';
					tr += '<td>'+((car.inside_wash)? 'interior' : '')+((car.inside_wash && car.outside_wash)? ' / ' : '')+((car.outside_wash)? 'exterior' : '')+'</td>';
					tr += '</tr>';
					
					parent.find('.car-wash-car-list-table tbody').append(tr);
				}
			}
			
			context.setListColorNumbers();
		});
		
		$('body').on('click', '.car-wash-car-list-table tbody tr td', function(){
			var parent = $(this).parents(parentClass);
			
			if ( $(this).parents('tr').hasClass('selected') )
			{
				$(this).parents('tr').removeClass('selected');
				parent.find('.car-wash-right-menu-button').hide();
			}
			else
			{
				parent.find('.car-wash-car-list-table tbody tr').removeClass('selected');
				parent.find('.car-wash-right-menu-button').hide();
				$(this).parents('tr').addClass('selected');
				
				var status = $(this).parents('tr').data('status_id');
				parent.find('.car-wash-delete-car-button').show();
				if ( status == 0 )
				{
					parent.find('.car-wash-start-car-button').show();
					parent.find('.car-wash-suspend-car-button').show();
				}
				
				if ( status == 1 )
				{
					parent.find('.car-wash-ready-car-button').show();
				}
				
				if ( status == 2 )
				{
					parent.find('.car-wash-take-car-button').show();
				}
				
				if ( status == 3 )
				{
					parent.find('.car-wash-start-car-button').show();
				}
			}
		});
		
		$('body').on('submit', '.car-wash-add-car-form .add-car-form', function(e){
			e.preventDefault();
			
			var parent = $(this).parents(parentClass);
			
			var form_data = $(this).serializeArray();
			var obj = {};
			for (var i = 0, l = form_data.length; i < l; i++) {
				obj[form_data[i].name] = form_data[i].value;
			}
			obj['date_created'] = context.getCurrentTimeinDateTimeFormat();
			form_data = obj;
			
			ServiceBox.communicator.insertData(context.slug, 'car', form_data);
			
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				parent.find('.car-wash-content-holder').html('');
				
				ServiceBox.popup.create('add_car', 'Adauga Masina', 'Masina adaugata cu success');
				ServiceBox.popup.run();
				
				parent.find('.car-wash-main').show();
				parent.find('.car-wash-add-car-form').hide();
			}
			else
			{
				$(this).find('.help-block').remove();
				
				$.each(response.errors, function(index, value){
					parent.find('input[name="'+index+'"]').parents('.form-group').append('<span class="help-block" style="color:red;">'+value+'</span>');
				});
			}
		});
		
		$('body').on('click', '.car-wash-plus-button-xxl', function(){
			var parent = $(this).parents(parentClass);
			
			parent.find('.car-wash-add-car-form .add-car-form').submit();
		});
		
		$('body').on('click', '.car-wash-delete-car-button', function(){
			var parent = $(this).parents(parentClass);
			
			var id = parent.find('.car-wash-car-list-table tbody tr.selected').data('car_id');
			
			ServiceBox.communicator.deleteData(context.slug, id, 'car');
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				parent.find('.car-wash-content-holder').html('');
				parent.find('.car-wash-car-list-button').trigger('click');
				
				ServiceBox.popup.create('delete_car', 'Sterge Masina', 'Masina stearsa cu success');
				ServiceBox.popup.run();
				parent.find('.car-wash-main').show();
				parent.find('.car-wash-list').hide();
			}
			else
			{
				ServiceBox.popup.create('delete_car', 'Sterge Masina', 'Masina nu se poeate sterge');
				ServiceBox.popup.run();
				parent.find('.car-wash-main').show();
				parent.find('.car-wash-list').hide();
			}
			
			context.setListColorNumbers();
		});
		
		$('body').on('click', '.car-wash-right-menu-button', function(){
			var parent = $(this).parents(parentClass);
			
			var status = 0;
			var statusText = '';
			
			var id = parent.find('.car-wash-car-list-table tbody tr.selected').data('car_id');
			
			if ( $(this).hasClass('car-wash-start-car-button') )
			{
				status = 1;
				statusText = 'Spalarea a inceput.';
			}
			if ( $(this).hasClass('car-wash-ready-car-button') )
			{
				status = 2;
				statusText = 'Masina a fost spalata.';
			}
			if ( $(this).hasClass('car-wash-suspend-car-button') )
			{
				status = 3;
				statusText = 'Masina a fost suspendata.';
			}
			if ( $(this).hasClass('car-wash-take-car-button') )
			{
				var delegate_data = $('.car-wash-delegate-form').first().clone();
				delegate_data.find('form').append('<input type="hidden" name="car_id" id="car_id" value="'+id+'">');
				
				ServiceBox.popup.create('delegate_form', 'Delegat', delegate_data);
				ServiceBox.popup.run();
				
				$('.car-wash-delegate-form input[type="text"]').autocomplete({
					minChars : 3,
					lookup : function(query, done){
						var name_search_data = {delegate_name : query};
						var telephone_search_data = {delegate_phone : query};
						
						ServiceBox.communicator.searchData('car_wash', 'delegate', name_search_data);
						var name_response = ServiceBox.communicator.getResponse();
						name_response.data = $.map(name_response.data, function (value, key) { return value; });
						
						ServiceBox.communicator.searchData('car_wash', 'delegate', telephone_search_data);
						var tel_response = ServiceBox.communicator.getResponse();
						tel_response.data = $.map(tel_response.data, function (value, key) { return value; });
						
						var all_search = tel_response.data.concat(name_response.data);
						
						var result = {
							suggestions : $.map(all_search, function(dataItem){
								return { 'value' : dataItem.delegate_name+'('+dataItem.delegate_phone+')', 'data' : dataItem.delegate_name+'('+dataItem.delegate_phone+')', 'extra' : dataItem }
							})
						};
						
						done(result);
					},
					onSelect : function(suggestion){
						$('#delegate_form .car-wash-delegate-form #delegate_name').val(suggestion.extra.delegate_name);
						$('#delegate_form .car-wash-delegate-form #delegate_phone').val(suggestion.extra.delegate_phone);
						
						$('#delegate_form .car-wash-delegate-form form').append('<input type="hidden" name="delegate_id" id="delegate_id" value="'+suggestion.extra.id+'">');
					}
				});
			}
			
			if ( status > 0 )
			{	
				ServiceBox.communicator.updateData(context.slug, id, 'car', {status : status});
				var response = ServiceBox.communicator.getResponse();
				
				if ( response.success )
				{
					parent.find('.car-wash-content-holder').html('');
					parent.find('.car-wash-car-list-button').trigger('click');
					
					ServiceBox.popup.create('start_car', 'Spalare Masina', statusText);
					ServiceBox.popup.run();
					parent.find('.car-wash-main').show();
					parent.find('.car-wash-list').hide();
				}
				else
				{
					ServiceBox.popup.create('start_car', 'Spalare Masina', 'Cerere nereusita, incercati din nou.');
					ServiceBox.popup.run();
				}
			}
			
			context.setListColorNumbers();
		});
		
		$('body').on('click', '.car-wash-add-car-form .add-car-form .big-input-button', function(){
			if ( $(this).hasClass('selected') )
			{
				$(this).children('input').val(0);
				$(this).removeClass('selected');
			}
			else
			{
				$(this).children('input').val(1);
				$(this).addClass('selected');
			}
		});
		
		$('body').on('submit', '#delegate_form .car-wash-delegate-form form', function(e){
			e.preventDefault();
			
			var car_id = $(this).find('#car_id').val();
			var response = '';
			if ( $(this).find('#delegate_id').length > 0 )
			{
				var delegate_id = $(this).find('#delegate_id').val();
				
				ServiceBox.communicator.updateData(context.slug, car_id, 'car', {status : 9, delegate_id : delegate_id});
				response = ServiceBox.communicator.getResponse();
			}
			else
			{
				var form_data = $(this).serializeArray();
				var obj = {};
				for (var i = 0, l = form_data.length; i < l; i++) {
					obj[form_data[i].name] = form_data[i].value;
				}
				form_data = obj;
				
				ServiceBox.communicator.insertData(context.slug, 'delegate', form_data);
				
				var delegate_response = ServiceBox.communicator.getResponse();
				
				if ( delegate_response.success )
				{
					var delegate_id = delegate_response.data;
					ServiceBox.communicator.updateData(context.slug, car_id, 'car', {status : 9, delegate_id : delegate_id});
					response = ServiceBox.communicator.getResponse();
				}
				else
				{
					response = delegate_response;
				}
			}
			
			if ( response.success )
			{
				$(this).parents('#delegate_form').remove();
				$('.car-wash-car-list-button').trigger('click');
				
				ServiceBox.popup.create('start_car', 'Spalare Masina', 'Plata reusita');
				ServiceBox.popup.run();
			}
			else
			{
				ServiceBox.popup.create('start_car', 'Spalare Masina', 'Cerere nereusita, incercati din nou.');
				ServiceBox.popup.run();
			}
		});
		
		$('body').on('click', '.car-wash-back-home', function(){
			var parent = $(this).parents(parentClass);
			
			parent.find('.car-wash-body').hide();
			parent.find('.car-wash-main').show();
		});
		
		$(window).resize(function(){
			if ( $( window ).width() < 754 )
			{
				$('#car-wash-right-menu').collapse('hide');
			}
			else
			{
				if ( !$('#car-wash-right-menu').is(':visible') )
				{
					$('#car-wash-right-menu').collapse('show');
				}
			}
		});
	},
	
	startClock : function()
	{
		var d = new Date();
		
		var hour = d.getHours();
		hour = (hour < 10)? '0' + hour : hour;
		
		var minutes = d.getMinutes();
		minutes = (minutes < 10)? '0' + minutes : minutes;
		
		var time = hour+' : '+minutes;
		
		$('.car-wash-header-time').html(time);
		$('.car-wash-current-time').html(time);
	},
	
	getCurrentTimeinDateTimeFormat : function()
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd
		} 
		if(mm<10){
			mm='0'+mm
		} 
		
		return yyyy+'-'+mm+'-'+dd;
	},
	
	initCarsAutocomplete : function() 
	{
		var context = this;
		
		$('.add-car-form #car_make').autocomplete({
			minChars : 3,
			lookup : function(query, done){
				var search_data = {type : 'make', q : query};
				
				ServiceBox.communicator.performCustomAction('car_wash', 'SearchCars', search_data);
				
				var response = ServiceBox.communicator.getResponse();
				var result = {
					suggestions : $.map(response.data, function(dataItem){
						return { 'value' : dataItem.name, 'data' : dataItem.name, 'extra' : dataItem }
					})
				};
				
				done(result);
			},
			onSelect: function (suggestion) {
				context.selectedCarMake = suggestion.extra.id;
			}
		});
		
		$('body').on('change', '.add-car-form #car_make', function(){
			if ( $(this).val() == 0 ) delete context.selectedCarMake;
		});
		
		$('.add-car-form #car_type').autocomplete({
			minChars : 3,
			lookup : function(query, done){
				var search_data = {type : 'model', q : query};
				
				if ( typeof context.selectedCarMake != undefined )
				{
					search_data.makeID = context.selectedCarMake;
				}
				
				ServiceBox.communicator.performCustomAction('car_wash', 'SearchCars', search_data);
				
				var response = ServiceBox.communicator.getResponse();
				var result = {
					suggestions : $.map(response.data, function(dataItem){
						return { 'value' : dataItem.name, 'data' : dataItem.name, 'extra' : dataItem }
					})
				};
				
				done(result);
			}
		});
	},
	
	setListColorNumbers : function()
	{
		$('.car-wash-right-menu-legend .car-counter').remove();
		$('.car-wash-right-menu-legend .legend-text').each(function(){
			$(this).append(' <span class="car-counter">('+parseInt($('.car-wash-car-list-table tr.'+$(this).data('color_type')).length)+')</span>');
		});
	}
}