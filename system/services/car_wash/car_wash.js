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
		
		$('body').on('click', '.car-wash-add-car-button', function(){
			$('.car-wash-main').hide();
			$('.car-wash-add-car-form').show();
		});
		
		$('body').on('click', '.car-wash-car-list-button', function(){
			$('.car-wash-main').hide();
			$('.car-wash-list').show();
			$('.car-wash-car-list-table tbody').html('');
			
			$(window).trigger('resize');
			$('.car-wash-right-menu-button').hide();
			
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
					
					$('.car-wash-car-list-table tbody').append(tr);
				}
			}
		});
		
		$('body').on('click', '.car-wash-car-list-table tbody tr td', function(){
			if ( $(this).parents('tr').hasClass('selected') )
			{
				$(this).parents('tr').removeClass('selected');
				$('.car-wash-right-menu-button').hide();
			}
			else
			{
				$('.car-wash-car-list-table tbody tr').removeClass('selected');
				$('.car-wash-right-menu-button').hide();
				$(this).parents('tr').addClass('selected');
				
				var status = $(this).parents('tr').data('status_id');
				$('.car-wash-delete-car-button').show();
				if ( status == 0 )
				{
					$('.car-wash-start-car-button').show();
					$('.car-wash-suspend-car-button').show();
				}
				
				if ( status == 1 )
				{
					$('.car-wash-ready-car-button').show();
				}
				
				if ( status == 2 )
				{
					$('.car-wash-take-car-button').show();
				}
				
				if ( status == 3 )
				{
					$('.car-wash-start-car-button').show();
				}
			}
		});
		
		$('body').on('submit', '.car-wash-add-car-form .add-car-form', function(e){
			e.preventDefault();
			
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
				$('.car-wash-content-holder').html('');
				
				ServiceBox.popup.create('add_car', 'Adauga Masina', 'Masina adaugata cu success');
				ServiceBox.popup.run();
				
				$('.car-wash-main').show();
				$('.car-wash-add-car-form').hide();
			}
			else
			{
				$(this).find('.help-block').remove();
				
				$.each(response.errors, function(index, value){
					$('input[name="'+index+'"]').parents('.form-group').append('<span class="help-block" style="color:red;">'+value+'</span>');
				});
			}
		});
		
		$('body').on('click', '.car-wash-plus-button-xxl', function(){
			$('.car-wash-add-car-form .add-car-form').submit();
		});
		
		$('body').on('click', '.car-wash-delete-car-button', function(){
			var id = $('.car-wash-car-list-table tbody tr.selected').data('car_id');
			
			ServiceBox.communicator.deleteData(context.slug, id, 'car');
			var response = ServiceBox.communicator.getResponse();
			
			if ( response.success )
			{
				$('.car-wash-content-holder').html('');
				$('.car-wash-car-list-button').trigger('click');
				
				ServiceBox.popup.create('delete_car', 'Sterge Masina', 'Masina stearsa cu success');
				ServiceBox.popup.run();
				$('.car-wash-main').show();
				$('.car-wash-list').hide();
			}
			else
			{
				ServiceBox.popup.create('delete_car', 'Sterge Masina', 'Masina nu se poeate sterge');
				ServiceBox.popup.run();
				$('.car-wash-main').show();
				$('.car-wash-list').hide();
			}
		});
		
		$('body').on('click', '.car-wash-right-menu-button', function(){
			
			var status = 0;
			var statusText = '';
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
				status = 9;
				statusText = 'Masina a fost luata.';
			}
			
			if ( status > 0 )
			{
				var id = $('.car-wash-car-list-table tbody tr.selected').data('car_id');
				
				ServiceBox.communicator.updateData(context.slug, id, 'car', {status : status});
				var response = ServiceBox.communicator.getResponse();
				
				if ( response.success )
				{
					$('.car-wash-content-holder').html('');
					$('.car-wash-car-list-button').trigger('click');
					
					ServiceBox.popup.create('start_car', 'Spalare Masina', statusText);
					ServiceBox.popup.run();
					$('.car-wash-main').show();
					$('.car-wash-list').hide();
				}
				else
				{
					ServiceBox.popup.create('start_car', 'Spalare Masina', 'Cerere nereusita, incercati din nou.');
					ServiceBox.popup.run();
				}
			}
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
	}
}