$(document).ready(function (){
	//alert(document.getElementById('#controlSearchMap').innerHTML);
	function CenterControl(controlDiv, nombre, band) {
		var controlUI = document.createElement('div');
		//controlUI.classList.add('prueba');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.cursor = 'pointer';
		if(band){
			controlUI.style.marginTop = '10px';	
		}else{
			controlUI.style.marginTop = '0px';
		}
		controlUI.style.marginRight = '10px';
		controlUI.style.padding = '0';
		controlUI.style.float = 'none';
		controlUI.style.textAlign = 'center';
		controlDiv.appendChild(controlUI);
		var controlText
		if(nombre == 'Mostrar Marcas'){
			controlText = document.createElement('i');
			controlText.classList.add('glyphicon'); 
			controlText.classList.add('glyphicon-eye-open');
			controlText.style.fontSize = '20px';
			controlText.style.padding = '5px';
			controlUI.appendChild(controlText);
		}else if(nombre == 'Ocultar Marcas'){
			controlText = document.createElement('i');
			controlText.classList.add('glyphicon'); 
			controlText.classList.add('glyphicon-eye-close');
			controlText.style.fontSize = '20px';
			controlText.style.padding = '5px';
			controlUI.appendChild(controlText);
		}else if (nombre == 'Dibujar Capas'){
			controlText = document.createElement('i'); 
			controlText.classList.add('glyphicon'); 
			controlText.classList.add('glyphicon-pencil');
			controlText.style.fontSize = '20px';
			controlText.style.padding = '5px';
			controlUI.appendChild(controlText);
		}else {
			controlText = document.createElement('i'); 
			controlText.classList.add('glyphicon'); 
			controlText.classList.add('glyphicon-search');
			controlText.style.fontSize = '20px';
			controlText.style.padding = '5px';
			controlUI.appendChild(controlText);
		}
	}
	//script para probar variables
	
	$('#vervariables').click(function (){
		console.log(new google.maps.LatLng(marcas[0].position.lat(),marcas[0].position.lng()));
		console.log(marcas[0].position);
		
	});
	
	/*
	#################################################
	# Variabales para controlar las marcas dentro   #
	# del mapa                                      #
	#################################################
	*/
	var mymap;
	var marcas = [];
	var statusmarcas = [];
	var idmarcas = [];
	var rifmarcas = [];
	var nombremarcas = [];
	var filtroclientes = [];
	var filtrovendedores = [];
	var filtroparetos = [];
	var filtrofrecuencias = [];
	var actualLatLng = null;
	var idcapas = [];
	var capas = [];
	var statuscapas = [];
	var idgrupocapas = [];
	var idsubgrupocapas = [];
	
	/*
	#################################################
	# Funciones internas del script                 #
	#################################################
	*/
	function ReiniciarMarcas(){
		for(i=0;i<marcas.length;i++){
			if(statusmarcas[i] == false){
				marcas[i].setMap(mymap);
				statusmarcas[i] = true;
			}	
		}
	}

	function ReiniciarCapas(){
		for(i=0;i<marcas.length;i++){
			if(statuscapas[i] == true){
				capas[i].setMap(null);
				statuscapas[i] = false;
			}	
		}
	}
	
	/*
	#################################################
	# Eventos para manejar las marca dentro del     #
	# mapa. Crear, ver información, eliminar        #
	#################################################
	*/
	google.maps.event.addDomListener(window, 'load', function (){
		mymap= new google.maps.Map(document.getElementById('mapid'), {
			center: new google.maps.LatLng(9.318990,-70.601921),
			zoom: 10,
			mapTypeControl:true,
			mapTypeControlOptions: {
				style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			draggableCursor: 'default'
		});
		
		var centerControlDiv = document.createElement('div');
		new CenterControl(centerControlDiv, 'Mostrar Marcas', true);
		centerControlDiv.index = 1;
		centerControlDiv.addEventListener('click', function() {
			$('#buscarRif').val('');
			ReiniciarMarcas();
			$('.filtro').prop('checked',true);
		});
		mymap.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
		
		
		
		var centerControlDiv1 = document.createElement('div');
		new CenterControl(centerControlDiv1, 'Ocultar Marcas', false);
		centerControlDiv1.index = 1;
		centerControlDiv1.addEventListener('click', function() {
			$('#buscarRif').val('');
			for(i=0;i<marcas.length;i++) {
				statusmarcas[i]=false;
    		marcas[i].setMap(null);
  		}
			$('.filtro').prop('checked',false);
		});
		mymap.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv1);
		
		
		var centerControlDiv2 = document.createElement('div');
		centerControlDiv2.appendChild($('#controlSearchMap')[0]);
		centerControlDiv2.style.marginTop = '10px';
		mymap.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv2);
		
		var drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.DEFAULT,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_CENTER,
				drawingModes: [
					google.maps.drawing.OverlayType.POLYGON
				]
			},
		});
		
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
			if(event.type == google.maps.drawing.OverlayType.POLYGON){
				//obtener las coordenadas de todos los puntos y convertir a json
				var poligono = event.overlay;
				var polygonArray = poligono.getPath().getArray();
				var json = JSON.stringify(polygonArray);
				var cadenaPoligono = 'POLYGON((';
				for (var i = 0; i <polygonArray.length; i++){
					cadenaPoligono += polygonArray[i].lat() +' '+ polygonArray[i].lng() +',';
				}
				//cadena = cadena.substring(0, cadena.length-1);
				cadenaPoligono += polygonArray[0].lat() +' '+ polygonArray[0].lng()+'))';
				
				if(confirm('¿Desea guardar la capa?')){
					$('.modal-body').load($('#base_url').val()+'Capa/ModuloCapa/',{
						'json': json,
						'cadenaPoligono': cadenaPoligono
					}, function (responseText){
						$('.modal-title').text('Administrar Capas');
						$('#myModal').modal('show');
					});
				}
				poligono.setMap(null);
				//console.log(json);
			}
		});
		
		drawingManager.setMap(mymap);
		
		
		$.getJSON($('#base_url').val()+'Cliente/ObtenerClientes/', function (data){
			var marca;
			var imagen;
			$.each(data, function (key,val) {
				marca = null;
				imagen = null;
    		imagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+val.sColorVendedor.split('#')[1],
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34)
				);
				marca = new google.maps.Marker({
					position: new google.maps.LatLng(val.nLatCliente,val.nLngCliente),
					draggable:false,
					title: val.sRifCliente+' - '+val.sNombreCliente,
					icon: imagen 
				});
				
				marca.addListener('dragstart', function (e){
					actualLatLng = this.getPosition();
				});
						
				marca.addListener('dragend', function(e) {
					var thisMark = this;
					this.setDraggable(false);
					if(confirm('¿Desea mover el cliente de posición?')){
						var url = $('#base_url').val()+'Cliente/ModificarCoordenadasCliente/';
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								'id': val.nIdCliente,
								'latitud': this.getPosition().lat(),
								'longitud': this.getPosition().lng(),
								'cadenaPunto': 'POINT('+ this.getPosition().lat() +' '+ this.getPosition().lng() +')'
							},
							dataType: 'json',
							success: function (data){
								if(data == false){
									alert('Ya existe un usuario en esas coordenadas');
									thisMark.setPosition(actualLatLng);
									actualLatLng = null;
									return false;
								}
							},
						});
						return false;
					}else {
						this.setPosition(actualLatLng);
						actualLatLng = null;
					}
				});
				
				marca.addListener('dblclick', function() {
					$('.modal-body').load($('#base_url').val()+'Cliente/FormularioVerCliente/',{
							'id': val.nIdCliente,
						}, function (){
							$('.modal-title').text('Datos del Cliente');
							$('#myModal').modal('show');
					});
				});
				
				marca.addListener('rightclick', function (e){
					var ev = this;
					this.setDraggable(true);
					setTimeout(function(){
						ev.setDraggable(false); 
					}, 3000);
				});
				
				marca.setMap(mymap);
				marcas.push(marca);
				idmarcas.push(val.nIdCliente);
				rifmarcas.push(val.sRifCliente);
				nombremarcas.push(val.sNombreCliente);
				filtroclientes.push(val.nIdTipoCliente);
				filtrovendedores.push(val.nIdVendedor);
				filtroparetos.push(val.nIdPareto);
				filtrofrecuencias.push(val.nIdFrecuencia);
				statusmarcas.push(true);
			});
		});
		
		$.getJSON($('#base_url').val()+'Capa/ObtenerCapas/', function (data){
			var capa;
			
			$.each(data, function (key,val) {
				var arrayCapas = $.parseJSON(val.sJsonCapa)	
				var capaCords = arrayCapas;
				capa = new google.maps.Polygon({
					paths: capaCords,
					clickable: true,
					strokeColor: val.sColorCapa,
					strokeOpacity: 0.8,
					strokeWeight: 3,
					fillColor: val.sColorCapa,
					fillOpacity: 0.35,
					name: val.sNombreCapa
				});
				
				capa.addListener('rightclick', function (){
					$('.modal-body').load($('#base_url').val()+'Capa/FormularioVerCapa/',{
							'id': val.nIdCapa,
						}, function (){
							$('.modal-title').text('Datos de la Capa');
							$('#myModal').modal('show');
					});
				});

				var infowindow = new google.maps.InfoWindow({
				  size: new google.maps.Size(150, 50)
				});

				capa.addListener('mouseover', function(event) {
			   	var contentString = val.sNombreCapa;
			    	infowindow.setContent(contentString);
			    	infowindow.setPosition(event.latLng);
			    	infowindow.open(mymap);
			  	});

			  	capa.addListener('mouseout', function(event) {
			    	infowindow.close(mymap);
			  	});
				
				capas.push(capa);
				idcapas.push(val.nIdCapa);
				statuscapas.push(false);
				idgrupocapas.push(val.nIdGrupocapa);
				idsubgrupocapas.push(val.nIdSubgrupocapa);
			});
		}).error(function (e){
			console.log(e);
		});
		
		google.maps.event.addListener(mymap, 'rightclick', function (event){
			$('.modal-body').load($('#base_url').val()+'Cliente/FormularioNuevoCliente/',{
					'latitud': event.latLng.lat(),
					'longitud': event.latLng.lng(),
					'cadenaPunto': 'POINT('+ event.latLng.lat() +' '+ event.latLng.lng() +')'
				}, function (){
					$('.modal-title').text('Agregar Nuevo Cliente');
					$('#myModal').modal('show');
			});
		});
	});
	
	$('.modal').on('click', '#registrarnuevocliente', function (){
		var opcion = false;
		$('#registrarnuevocliente').bloquearElemento();
		$('#cancelarnuevocliente').bloquearElemento();
		if($('#tipocliente').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#tipocliente').focus();
			$('#registrarnuevocliente').desbloquearElemento();
			$('#cancelarnuevocliente').desbloquearElemento();
			return false;
		}
		if($('#vendedor').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#vendedor').focus();
			$('#registrarnuevocliente').desbloquearElemento();
			$('#cancelarnuevocliente').desbloquearElemento();
			return false;
		}
		if($('#rif').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#rif').focus();
			$('#registrarnuevocliente').desbloquearElemento();
			$('#cancelarnuevocliente').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#registrarnuevocliente').desbloquearElemento();
			$('#cancelarnuevocliente').desbloquearElemento();
			return false;
		}
		if(!$('#rif').validarExpReg(/^[JGVE][0-9]{9}$/)){
			alert('El campo rif no tiene el formato correcto');
			$('#rif').focus();
			$('#registrarnuevocliente').desbloquearElemento();
			$('#cancelarnuevocliente').desbloquearElemento();
			return false;
		}
		if($('#pareto').opcionComboEsCero()){
			if(confirm('¡La opcion pareto esta vacia!, ¿Desea continuar?')){
				opcion = true;
			}
			if(opcion == false){
				$('#pareto').focus();
				$('#registrarnuevocliente').desbloquearElemento();
				$('#cancelarnuevocliente').desbloquearElemento();
				return false;
			}
		}
		if(!$('#pareto').opcionComboEsCero() || opcion == true){
			var url = $('#base_url').val()+'Cliente/RegistrarCliente/';
			$.ajax({
				type: 'POST',
				url: url,
				data: {
					'tipocliente': $('#tipocliente').val(),
					'vendedor': $('#vendedor').val(),
					'pareto': $('#pareto').val(),
					'frecuencia': $('#frecuencia').val(),
					'diavisita': $('#diavisita').val(),
					'rif': $('#rif').val().trim(),
					'nombre': $('#nombre').val().trim(),
					'latitud': $('#latitud').val().trim(),
					'longitud': $('#longitud').val().trim(),
					'cadenaPunto': $('#cadenaPunto').val().trim()
				},
				dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
				success: function (data){
					if(data.ExisteRif > 0){
						alert('El RIF ya se encuentra registrado');
						$('#rif').focus();
						$('#registrarnuevocliente').desbloquearElemento();
						$('#cancelarnuevocliente').desbloquearElemento();
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					if(data.ExisteNombre > 0){
						$('#nombre').focus();
						alert('El nombre de la empresa ya se encuentra registrado');
						$('#registrarnuevocliente').desbloquearElemento();
						$('#cancelarnuevocliente').desbloquearElemento();
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					if(data.ExisteCoordenadas > 0){
						alert('Ya existe un cliente en las coordenadas seleccionadas. Cierre esta venta y seleccione otro punto en el mapa');
						$('#registrarnuevocliente').desbloquearElemento();
						$('#cancelarnuevocliente').desbloquearElemento();
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					var imagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+data.sColorVendedor.split('#')[1],
						new google.maps.Size(21, 34),
						new google.maps.Point(0,0),
						new google.maps.Point(10, 34)
					);
					var marca = new google.maps.Marker({
						position: new google.maps.LatLng(data.nLatCliente,data.nLngCliente),
						draggable: true,
						title: data.sRifCliente+' - '+data.sNombreCliente,
						icon: imagen
					});
					
					marca.addListener('dragstart', function (e){
						actualLatLng = this.getPosition();
					});
					
					marca.addListener('dragend', function() {
						var thisMark = this;
						this.setDraggable(false);
						if(confirm('¿Desea mover el cliente de posición?')){
							var url = $('#base_url').val()+'Cliente/ModificarCoordenadasCliente/';
							$.ajax({
								type: 'POST',
								url: url,
								data: {
									'id': data.nIdCliente,
									'latitud': this.getPosition().lat(),
									'longitud': this.getPosition().lng(),
									'cadenaPunto': 'POINT('+ this.getPosition().lat() +' '+ this.getPosition().lng() +')'
								},
								dataType: 'json',
								success: function (data){
									if(data == false){
										alert('Ya existe un usuario en esas coordenadas');
										thisMark.setPosition(actualLatLng);
										actualLatLng = null;
										return false;
									}
								},
							});
							return false;
						} else{
							this.setPosition(actualLatLng);
						actualLatLng = null;	
						}
					});
					marca.addListener('dblclick', function() {
						$('.modal-body').load($('#base_url').val()+'Cliente/FormularioVerCliente/',{
								'id': data.nIdCliente,
							}, function (){
								$('.modal-title').text('Datos del Cliente');
								$('#myModal').modal('show');
						});
					});
					
					marca.addListener('rightclick', function (e){
						var ev = this;
						this.setDraggable(true);
						setTimeout(function(){
							ev.setDraggable(false); 
						}, 3000);
					});
					
					marca.setMap(mymap);
					marcas.push(marca);
					idmarcas.push(data.nIdCliente);
					rifmarcas.push(data.sRifCliente);
					nombremarcas.push(data.sNombreCliente);
					filtroclientes.push(data.nIdTipoCliente);
					filtrovendedores.push(data.nIdVendedor);
					filtroparetos.push(data.nIdPareto);
					filtrofrecuencias.push(data.nIdFrecuencia);
					statusmarcas.push(true);
					ReiniciarMarcas();
					$('.filtro').prop('checked',true);
					alert('Cliente Registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					$('#myModal').modal('hide');
					$('.modal-title').empty();
					$('.modal-body').empty();
				},
				error: function (err){
					console.log(err);
				}
			});
			return false;
		}
	});
	
	$('.modal').on('click', '#editarclienteactual', function (){
		$('.form-control').removeAttr("disabled");
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificarclienteactual"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminarclienteactual"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cerrarvercliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
	});
	
	$('.modal').on('click', '#modificarclienteactual', function (){
		var opcion = false;
		$('#modificarclienteactual').bloquearElemento();
		$('#eliminarclienteactual').bloquearElemento();
		$('#cerrarvercliente').bloquearElemento();
		if($('#tipocliente').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#tipocliente').focus();
			$('#modificarclienteactual').desbloquearElemento();
			$('#eliminarclienteactual').desbloquearElemento();
			$('#cerrarvercliente').desbloquearElemento();
			return false;
		}
		if($('#vendedor').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#vendedor').focus();
			$('#modificarclienteactual').desbloquearElemento();
			$('#eliminarclienteactual').desbloquearElemento();
			$('#cerrarvercliente').desbloquearElemento();
			return false;
		}
		if($('#rif').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#rif').focus();
			$('#modificarclienteactual').desbloquearElemento();
			$('#eliminarclienteactual').desbloquearElemento();
			$('#cerrarvercliente').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificarclienteactual').desbloquearElemento();
			$('#eliminarclienteactual').desbloquearElemento();
			$('#cerrarvercliente').desbloquearElemento();
			return false;
		}
		if(!$('#rif').validarExpReg(/^[JGVE][0-9]{9}$/)){
			alert('El campo rif no tiene el formato correcto');
			$('#rif').focus();
			$('#modificarclienteactual').desbloquearElemento();
			$('#eliminarclienteactual').desbloquearElemento();
			$('#cerrarvercliente').desbloquearElemento();
			return false;
		}
		if($('#pareto').opcionComboEsCero()){
			if(confirm('¡La opcion pareto esta vacia!, ¿Desea continuar?')){
				opcion = true;
			}
			if(opcion == false){
				$('#pareto').focus();
				$('#modificarclienteactual').desbloquearElemento();
				$('#eliminarclienteactual').desbloquearElemento();
				$('#cerrarvercliente').desbloquearElemento();
				return false;
			}
		}
		if(!$('#pareto').opcionComboEsCero() || opcion == true){
			var url = $('#base_url').val()+'Cliente/ModificarCliente/';
			$.ajax({
				type: 'POST',
				url: url,
				data: {
					'id': $('#idcliente').val(),
					'tipocliente': $('#tipocliente').val(),
					'vendedor': $('#vendedor').val(),
					'pareto': $('#pareto').val(),
					'frecuencia': $('#frecuencia').val(),
					'diavisita': $('#diavisita').val(),
					'rif': $('#rif').val().trim(),
					'nombre': $('#nombre').val().trim(),
					/*'latitud': $('#latitud').val().trim(),
					'longitud': $('#longitud').val().trim(),*/
				},
				dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
				success: function (data){
					if(data.ExisteRif > 0){
						alert('El RIF ya se encuentra registrado');
						$('#rif').focus();
						$('#modificarclienteactual').desbloquearElemento();
						$('#eliminarclienteactual').desbloquearElemento();
						$('#cerrarvercliente').desbloquearElemento();
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					if(data.ExisteNombre > 0){
						$('#nombre').focus();
						alert('El nombre de la empresa ya se encuentra registrado');
						$('#modificarclienteactual').desbloquearElemento();
						$('#eliminarclienteactual').desbloquearElemento();
						$('#cerrarvercliente').desbloquearElemento();
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					var posicion = idmarcas.indexOf($('#idcliente').val());
					marcas[posicion].setMap(null);
					marcas[posicion] = null;
					var imagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+data.sColorVendedor.split('#')[1],
						new google.maps.Size(21, 34),
						new google.maps.Point(0,0),
						new google.maps.Point(10, 34)
					);
					marcas[posicion] = new google.maps.Marker({
						position: new google.maps.LatLng(data.nLatCliente,data.nLngCliente),
						draggable: true,
						title: data.sRifCliente+' - '+data.sNombreCliente,
						icon: imagen
					});
					
					marcas[posicion].addListener('dragstart', function (e){
						actualLatLng = this.getPosition();
					});
					
					marcas[posicion].addListener('dragend', function() {
						var thisMark = this;
						this.setDraggable(false);
						if(confirm('¿Desea mover el cliente de posición?')){
							var url = $('#base_url').val()+'Cliente/ModificarCoordenadasCliente/';
							$.ajax({
								type: 'POST',
								url: url,
								data: {
									'id': data.nIdCliente,
									'latitud': this.getPosition().lat(),
									'longitud': this.getPosition().lng(),
									'cadenaPunto': 'POINT('+ this.getPosition().lat() +' '+ this.getPosition().lng() +')'
								},
								dataType: 'json',
								success: function (data){
									if(data == false){
										alert('Ya existe un usuario en esas coordenadas');
										thisMark.setPosition(actualLatLng);
										actualLatLng = null;
										return false;
									}
								},
							});
							return false;
						}else {
							this.setPosition(actualLatLng);
							actualLatLng = null;
						}
					});
					
					marcas[posicion].addListener('dblclick', function() {
						$('.modal-body').load($('#base_url').val()+'Cliente/FormularioVerCliente/',{
								'id': data.nIdCliente,
							}, function (){
								$('.modal-title').text('Datos del Cliente');
								$('#myModal').modal('show');
						});
					});
					
					marcas[posicion].addListener('rightclick', function (e){
						var ev = this;
						this.setDraggable(true);
						setTimeout(function(){
							ev.setDraggable(false); 
						}, 3000);
					});
					
					rifmarcas[posicion] = data.sRifCliente;
					nombremarcas[posicion] = data.sNombreCliente;
					filtroclientes[posicion] = data.nIdTipoCliente;
					filtrovendedores[posicion] = data.nIdVendedor;
					filtroparetos[posicion] = data.nIdPareto;
					filtrofrecuencias[posicion] = data.nIdFrecuencia;
					statusmarcas[posicion] = true;
					marcas[posicion].setMap(mymap);
					ReiniciarMarcas();
					$('.filtro').prop('checked',true);
					alert('Cliente Modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					$('#myModal').modal('hide');
					$('.modal-title').empty();
					$('.modal-body').empty();
				},
				error: function (err){
					console.log(err);
				}
			});
			return false;
		}
	});
	
	$('.modal').on('click', '#eliminarclienteactual', function (){
		$('#editarclienteactual').bloquearElemento();
		$('#eliminarclienteactual').bloquearElemento();
    $('#cerrarvercliente').bloquearElemento();
		if(confirm('¿Desea eliminar el cliente?')){
      var url = $('#base_url').val()+'Cliente/EliminarClienteSeleccionado/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#idcliente').val()
        },
        dataType: 'json',
        beforeSend: function (){
        		$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
        success: function (data) {
          if(data=='ERROR'){
            alert('Error al eliminar');
							$('#editarclienteactual').bloquearElemento();
							$('#eliminarclienteactual').desbloquearElemento();
	    				$('#cerrarvercliente').desbloquearElemento();
	    				$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
	            return false;
	          }
					var posicion = idmarcas.indexOf($('#idcliente').val());
					marcas[posicion].setMap(null);
					marcas.splice(posicion,1);
					idmarcas.splice(posicion,1);
					filtroclientes.splice(posicion,1);
					filtrovendedores.splice(posicion,1);
					filtroparetos.splice(posicion,1);
					filtrofrecuencias.splice(posicion,1);
					statusmarcas.splice(posicion,1);
					alert('Cliente eliminado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					$('#myModal').modal('hide');
					$('.modal-title').empty();
					$('.modal-body').empty();
        },
      });
      return false;
  	}
		$('#editarclienteactual').desbloquearElemento();
		$('#eliminarclienteactual').desbloquearElemento();
    $('#cerrarvercliente').desbloquearElemento();
	});

	/*
	#################################################
	# MODULO TIPO CLIENTE                           #
	#################################################
	*/
	$('#nuevotipocliente').click(function (){
		$('.modal-body').load($('#base_url').val()+'Tipocliente/ModuloTipoCliente/', function (){
			$('.modal-footer').load($('#base_url').val()+'Tipocliente/BuscadorTipoCliente/',function (){
				$('.modal-title').text('Administrar Tipo Clientes');
				$('#myModal').modal('show');
			});
		});
	});

	$('.modal').on('click', '#registrarnuevotipocliente', function (){
		$('#registrarnuevotipocliente').bloquearElemento();
    $('#cancelarnuevotipocliente').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#registrarnuevotipocliente').desbloquearElemento();
    	$('#cancelarnuevotipocliente').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Tipocliente/RegistrarTipoCliente/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val().trim(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Tipo cliente ya está registrado');
					$('#nombre').focus();
					$('#registrarnuevotipocliente').desbloquearElemento();
					$('#cancelarnuevotipocliente').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;

				}
				$.getJSON($('#base_url').val()+'Tipocliente/ObtenerTipoClientes/', function (data2){
					var idtipocliente = [];
					var nombretipocliente = [];
					$.each(data2, function (key,val){
						idtipocliente[key] = val.nIdTipoCliente;
						nombretipocliente[key] = val.sNombreTipoCliente;
					});
					var listatipocliente = '';
					listatipocliente += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idtipocliente.length;i++){
						listatipocliente += '<option value="'+idtipocliente[i]+'">'+nombretipocliente[i]+'</option>';
					}
					$('#registrostipocliente').empty();
					$('#registrostipocliente').html(listatipocliente);
					listatipocliente = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrofrecuencia" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idtipocliente.length;i++){
						listatipocliente += '<li>';
						listatipocliente += '<a href="#"><input type="checkbox" class="filtro filtrocliente" value="'+idtipocliente[i]+'" checked="checked" /> '+nombretipocliente[i]+'</a>';
						listatipocliente += '</li>';
					}
					$('ul#ulfiltroclientes').empty();
					$('ul#ulfiltroclientes').html(listatipocliente);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').val('');
					$('#nombre').focus();
					$('#registrarnuevotipocliente').desbloquearElemento();
					$('#cancelarnuevotipocliente').desbloquearElemento();
					alert('Tipo cliente registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});
	
	$('.modal').on('click', '#abrirregistrotipocliente', function (){
		$('#abrirregistrotipocliente').bloquearElemento();
		$('#registrostipocliente').bloquearElemento();
		$('#registrarnuevotipocliente').bloquearElemento();
		$('#cancelarnuevotipocliente').bloquearElemento();
		$('#nombre').bloquearElemento();
		if($('#registrostipocliente').opcionComboEsCero()){
			alert('Debe seleccionar un registro');
			$('#abrirregistrotipocliente').desbloquearElemento();
			$('#registrostipocliente').desbloquearElemento();
			$('#registrarnuevotipocliente').desbloquearElemento();
			$('#cancelarnuevotipocliente').desbloquearElemento();
			$('#nombre').desbloquearElemento();
			return false;
		}
		$('#nombre').val($('#registrostipocliente option:selected').text());
		$('#nombre').attr('data-valoractual',$('#registrostipocliente option:selected').text());
		$('#nombre').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificartipocliente" data-identificador="'+$('#registrostipocliente').val()+'"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminartipocliente" data-identificador="'+$('#registrostipocliente').val()+'"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cancelarmodificartipocliente"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
		return false;
	});

	$('.modal').on('click', '#modificartipocliente', function (){
		$('#modificartipocliente').bloquearElemento();
    $('#eliminartipocliente').bloquearElemento();
    $('#cancelarmodificartipocliente').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificartipocliente').desbloquearElemento();
    	$('#eliminartipocliente').desbloquearElemento();
    	$('#cancelarmodificartipocliente').desbloquearElemento();
			return false;
		}
		if($('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim()){
			alert('No se realizo ninguna modificación');
			$('#nombre').removeAttr('data-valoractual');
			$('#nombre').val('');
			$('#nombre').focus();
			$('#registrostipocliente').val('0');
			$('#registrostipocliente').desbloquearElemento();
			$('#abrirregistrotipocliente').desbloquearElemento();
			var botones = '';
			botones += '<button type="submit" class="btn btn-default" id="registrarnuevotipocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
			botones += '<button type="button" class="btn btn-default" id="cancelarnuevotipocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
			$('.botonesformulario').empty();
			$('.botonesformulario').html(botones);
			return false;
		}
		var url = $('#base_url').val()+'Tipocliente/EditarTipoCliente/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#modificartipocliente').attr('data-identificador'),
				'nombre': $('#nombre').val().trim(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Tipo cliente ya está registrado');
					$('#nombre').focus();
					$('#modificartipocliente').desbloquearElemento();
	    			$('#eliminartipocliente').desbloquearElemento();
	    			$('#cancelarmodificartipocliente').desbloquearElemento();
	    			$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
					
				}
				$.getJSON($('#base_url').val()+'Tipocliente/ObtenerTipoClientes/', function (data2){
					var idtipocliente = [];
					var nombretipocliente = [];
					$.each(data2, function (key,val){
						idtipocliente[key] = val.nIdTipoCliente;
						nombretipocliente[key] = val.sNombreTipoCliente;
					});
					var listatipocliente = '';
					listatipocliente += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idtipocliente.length;i++){
						listatipocliente += '<option value="'+idtipocliente[i]+'">'+nombretipocliente[i]+'</option>';
					}
					$('#registrostipocliente').empty();
					$('#registrostipocliente').html(listatipocliente);
					$('#registrostipocliente').desbloquearElemento();
					$('#abrirregistrotipocliente').desbloquearElemento();
					listatipocliente = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrofrecuencia" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idtipocliente.length;i++){
						listatipocliente += '<li>';
						listatipocliente += '<a href="#"><input type="checkbox" class="filtro filtrocliente" value="'+idtipocliente[i]+'" checked="checked" /> '+nombretipocliente[i]+'</a>';
						listatipocliente += '</li>';
					}
					$('ul#ulfiltroclientes').empty();
					$('ul#ulfiltroclientes').html(listatipocliente);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').removeAttr('data-valoractual');
					$('#nombre').val('');
					$('#nombre').focus();
					var botones = '';
					botones += '<button type="submit" class="btn btn-default" id="registrarnuevotipocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
					botones += '<button type="button" class="btn btn-default" id="cancelarnuevotipocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
					$('.botonesformulario').empty();
					$('.botonesformulario').html(botones);
					alert('Tipo cliente modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#eliminartipocliente', function (){
		$('#modificartipocliente').bloquearElemento();
    $('#eliminartipocliente').bloquearElemento();
    $('#cancelarmodificartipocliente').bloquearElemento();
		if(confirm('¿Desea eliminar el tipo de cliente?')){
      var url = $('#base_url').val()+'Tipocliente/EliminarTipoCliente/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#eliminartipocliente').attr('data-identificador'),
        },
        dataType: 'json',
        beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
        success: function (data) {
          if(data == false){
						alert('El tipo cliente se encuentra relacionado a uno o varios clientes. Elimine las relaciones antes de eliminar el tipo de cliente');
						$('#nombre').focus();
						$('#modificartipocliente').desbloquearElemento();
    					$('#eliminartipocliente').desbloquearElemento();
    					$('#cancelarmodificartipocliente').desbloquearElemento();
    					$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
						
					}
					
					//CUANDO VIENE VACIO SE DETIENE CUANDO EL MODO DEL FRAMEWORK ESTA EN DESARROLLO
					$.getJSON($('#base_url').val()+'Tipocliente/ObtenerTipoClientes/', function (data2){
						var idtipocliente = [];
						var nombretipocliente = [];
						$.each(data2, function (key,val){
							idtipocliente[key] = val.nIdTipoCliente;
							nombretipocliente[key] = val.sNombreTipoCliente;
						});
						var listatipocliente = '';
						listatipocliente += '<option value="0">Seleccione un Registro</option>';
						for(i=0;i<idtipocliente.length;i++){
							listatipocliente += '<option value="'+idtipocliente[i]+'">'+nombretipocliente[i]+'</option>';
						}
						$('#registrostipocliente').empty();
						$('#registrostipocliente').html(listatipocliente);
						$('#registrostipocliente').desbloquearElemento();
						$('#abrirregistrotipocliente').desbloquearElemento();
						listatipocliente = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrofrecuencia" value="0" checked="checked" />TODOS</a></li>';
						for(i=0;i<idtipocliente.length;i++){
							listatipocliente += '<li>';
							listatipocliente += '<a href="#"><input type="checkbox" class="filtro filtrocliente" value="'+idtipocliente[i]+'" checked="checked" /> '+nombretipocliente[i]+'</a>';
							listatipocliente += '</li>';
						}
						$('ul#ulfiltroclientes').empty();
						$('ul#ulfiltroclientes').html(listatipocliente);
						ReiniciarMarcas();
					}).done(function (){
						$('#nombre').val('');
						$('#nombre').focus();
						var botones = '';
						botones += '<button type="submit" class="btn btn-default" id="registrarnuevotipocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
						botones += '<button type="button" class="btn btn-default" id="cancelarnuevotipocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
						$('.botonesformulario').empty();
						$('.botonesformulario').html(botones);
						alert('Tipo cliente eliminado');
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
					});
					return false;
        },
      });
      return false;
  	}
		$('#modificartipocliente').desbloquearElemento();
    $('#eliminartipocliente').desbloquearElemento();
    $('#cancelarmodificartipocliente').desbloquearElemento();
	});

	$('.modal').on('click', '#cancelarmodificartipocliente', function (){
		$('#nombre').val('');
		$('#registrostipocliente').val('0');
		$('#registrostipocliente').desbloquearElemento();
		$('#abrirregistrotipocliente').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="registrarnuevotipocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
		botones += '<button type="button" class="btn btn-default" id="cancelarnuevotipocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
	});

	/*
	#################################################
	# MODULO VENDEDOR                               #
	#################################################
	*/
	$('#nuevovendedor').click(function (){
		$('.modal-body').load($('#base_url').val()+'Vendedor/ModuloVendedor/', function (){
			$('.modal-footer').load($('#base_url').val()+'Vendedor/BuscadorVendedor/',function (){
				$('.modal-title').text('Administrar Vendedor');
				$('#myModal').modal('show');
			});
		});
	});

	$('.modal').on('click', '#registrarnuevovendedor', function (){
		$('#registrarnuevovendedor').bloquearElemento();
    $('#cancelarnuevovendedor').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#registrarnuevovendedor').desbloquearElemento();
    	$('#cancelarnuevovendedor').desbloquearElemento();
			return false;
		}
		if($('#color').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#color').focus();
			$('#registrarnuevovendedor').desbloquearElemento();
    	$('#cancelarnuevovendedor').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Vendedor/RegistrarVendedor/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val(),
				'color': $('#color').val(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data.ExisteNombre > 0){
					alert('Vendedor ya está registrado');
					$('#nombre').focus();
					$('#registrarnuevovendedor').desbloquearElemento();
					$('#cancelarnuevovendedor').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				if(data.ExisteColor > 0){
					alert('El color ya esta asignado a otro vendedor');
					$('#color').focus();
					$('#registrarnuevovendedor').desbloquearElemento();
					$('#cancelarnuevovendedor').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false
				}
				$.getJSON($('#base_url').val()+'Vendedor/ObtenerVendedores/', function (data2){
					var idvendedor = [];
					var nombrevendedor = [];
					var colorvendedor = [];
					$.each(data2, function (key,val){
						idvendedor[key] = val.nIdVendedor;
						nombrevendedor[key] = val.sNombreVendedor;
						colorvendedor[key] = val.sColorVendedor
					});
					var listavendedor = '';
					listavendedor += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idvendedor.length;i++){
						listavendedor += '<option value="'+idvendedor[i]+'" data-codigocolor="'+colorvendedor[i]+'">'+nombrevendedor[i]+'</option>';
					}
					$('#registrosvendedor').empty();
					$('#registrosvendedor').html(listavendedor);
					listavendedor = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrovendedor" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idvendedor.length;i++){
						listavendedor += '<li>';
						listavendedor += '<a href="#"><input type="checkbox" class="filtro filtrovendedor" value="'+idvendedor[i]+'" checked="checked" /> '+nombrevendedor[i]+'</a>';
						listavendedor += '</li>';
					}
					$('ul#ulfiltrovendedores').empty();
					$('ul#ulfiltrovendedores').html(listavendedor);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').val('');
					$('#nombre').focus();
					$('#color').val('#000000');
					$('#registrarnuevovendedor').desbloquearElemento();
					$('#cancelarnuevovendedor').desbloquearElemento();
					alert('Vendedor registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#abrirregistrovendedor', function (){
		$('#abrirregistrovendedor').bloquearElemento();
		$('#registrosvendedor').bloquearElemento();
		$('#registrarnuevovendedor').bloquearElemento();
		$('#cancelarnuevovendedor').bloquearElemento();
		$('#nombre').bloquearElemento();
		$('#color').bloquearElemento();
		if($('#registrosvendedor').opcionComboEsCero()){
			alert('Debe seleccionar un registro');
			$('#abrirregistrovendedor').desbloquearElemento();
			$('#registrosvendedor').desbloquearElemento();
			$('#registrarnuevovendedor').desbloquearElemento();
			$('#cancelarnuevovendedor').desbloquearElemento();
			$('#nombre').desbloquearElemento();
			$('#color').desbloquearElemento();
			return false;
		}
		$('#nombre').val($('#registrosvendedor option:selected').text());
		$('#nombre').attr('data-valoractual',$('#registrosvendedor option:selected').text());
		$('#nombre').desbloquearElemento();
		$('#color').val($('#registrosvendedor option:selected').attr('data-codigocolor'));
		$('#color').attr('data-valoractual',$('#registrosvendedor option:selected').attr('data-codigocolor'));
		$('#color').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificarvendedor" data-identificador="'+$('#registrosvendedor').val()+'"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminarvendedor" data-identificador="'+$('#registrosvendedor').val()+'"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cancelarmodificarvendedor"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
		return false;
	});

	$('.modal').on('click', '#modificarvendedor', function (){
		$('#modificarvendedor').bloquearElemento();
    $('#eliminarvendedor').bloquearElemento();
    $('#cancelarmodificarvendedor').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificarvendedor').desbloquearElemento();
    	$('#eliminarvendedor').desbloquearElemento();
    	$('#cancelarmodificarvendedor').desbloquearElemento();
			return false;
		}
		if($('#color').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#color').focus();
			$('#modificarvendedor').desbloquearElemento();
    	$('#eliminarvendedor').desbloquearElemento();
    	$('#cancelarmodificarvendedor').desbloquearElemento();
			return false;
		}
		if($('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim() && $('#color').val().trim() == $('#color').attr('data-valoractual').trim()){
			alert('No se realizo ninguna modificación');
			$('#nombre').removeAttr('data-valoractual');
			$('#color').removeAttr('data-valoractual');
			$('#nombre').val('');
			$('#nombre').focus();
			$('#color').val('#000000');
			$('#registrosvendedor').val('0');
			$('#registrosvendedor').desbloquearElemento();
			$('#abrirregistrovendedor').desbloquearElemento();
			var botones = '';
			botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
			botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
			$('.botonesformulario').empty();
			$('.botonesformulario').html(botones);
			return false;	
		}
		var url = $('#base_url').val()+'Vendedor/EditarVendedor/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#modificarvendedor').attr('data-identificador'),
				'nombre': $('#nombre').val(),
				'color': $('#color').val(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data.ExisteNombre > 0){
					alert('Vendedor ya está registrado');
					$('#nombre').focus();
					$('#modificarvendedor').desbloquearElemento();
	    			$('#eliminarvendedor').desbloquearElemento();
	    			$('#cancelarmodificarvendedor').desbloquearElemento();
	    			$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				if(data.ExisteColor > 0){
					alert('El color ya esta asignado a otro vendedor');
					$('#color').focus();
					$('#modificarvendedor').desbloquearElemento();
	    			$('#eliminarvendedor').desbloquearElemento();
	    			$('#cancelarmodificarvendedor').desbloquearElemento();
	    			$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false
				}
				$.getJSON($('#base_url').val()+'Vendedor/ObtenerVendedores/', function (data2){
					var idvendedor = [];
					var nombrevendedor = [];
					var colorvendedor = [];
					$.each(data2, function (key,val){
						idvendedor[key] = val.nIdVendedor;
						nombrevendedor[key] = val.sNombreVendedor;
						colorvendedor[key] = val.sColorVendedor
					});
					var listavendedor = '';
					listavendedor += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idvendedor.length;i++){
						listavendedor += '<option value="'+idvendedor[i]+'" data-codigocolor="'+colorvendedor[i]+'">'+nombrevendedor[i]+'</option>';
					}
					$('#registrosvendedor').empty();
					$('#registrosvendedor').html(listavendedor);
					$('#registrosvendedor').desbloquearElemento();
					$('#abrirregistrovendedor').desbloquearElemento();
					listavendedor = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrovendedor" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idvendedor.length;i++){
						listavendedor += '<li>';
						listavendedor += '<a href="#"><input type="checkbox" class="filtro filtrovendedor" value="'+idvendedor[i]+'" checked="checked" /> '+nombrevendedor[i]+'</a>';
						listavendedor += '</li>';
					}
					$('ul#ulfiltrovendedores').empty();
					$('ul#ulfiltrovendedores').html(listavendedor);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').removeAttr('data-valoractual');
					$('#color').removeAttr('data-valoractual');
					$('#nombre').val('');
					$('#nombre').focus();
					$('#color').val('#000000');
					var botones = '';
					botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
					botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
					$('.botonesformulario').empty();
					$('.botonesformulario').html(botones);
					alert('Vendedor modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#eliminarvendedor', function (){
		$('#modificarvendedor').bloquearElemento();
    $('#eliminarvendedor').bloquearElemento();
    $('#cancelarmodificarvendedor').bloquearElemento();
		if(confirm('¿Desea eliminar el vendedor?')){
      var url = $('#base_url').val()+'Vendedor/EliminarVendedor/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#eliminarvendedor').attr('data-identificador'),
        },
        dataType: 'json',
        beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
        success: function (data) {
          if(data == false){
						alert('El vendedor se encuentra relacionado a uno o varios clientes. Elimine las relaciones antes de eliminar el vendedor');
						$('#nombre').focus();
						$('#modificarvendedor').desbloquearElemento();
    					$('#eliminarvendedor').desbloquearElemento();
    					$('#cancelarmodificarvendedor').desbloquearElemento();
    					$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					
					//CUANDO VIENE VACIO SE DETIENE CUANDO EL MODO DEL FRAMEWORK ESTA EN DESARROLLO
					$.getJSON($('#base_url').val()+'Vendedor/ObtenerVendedores/', function (data2){
						var idvendedor = [];
						var nombrevendedor = [];
						var colorvendedor = [];
						$.each(data2, function (key,val){
							idvendedor[key] = val.nIdVendedor;
							nombrevendedor[key] = val.sNombreVendedor;
							colorvendedor[key] = val.sColorVendedor;
						});
						var listavendedor = '';
						listavendedor += '<option value="0">Seleccione un Registro</option>';
						for(i=0;i<idvendedor.length;i++){
							listavendedor += '<option value="'+idvendedor[i]+'" data-codigocolor="'+colorvendedor[i]+'">'+nombrevendedor[i]+'</option>';
						}
						$('#registrosvendedor').empty();
						$('#registrosvendedor').html(listavendedor);
						$('#registrosvendedor').desbloquearElemento();
						$('#abrirregistrovendedor').desbloquearElemento();
						listavendedor = '<li><a href="#"><input type="checkbox" class="filtro todosfiltrovendedor" value="0" checked="checked" />TODOS</a></li>';
						for(i=0;i<idvendedor.length;i++){
							listavendedor += '<li>';
							listavendedor += '<a href="#"><input type="checkbox" class="filtro filtrovendedor" value="'+idvendedor[i]+'" checked="checked" /> '+nombrevendedor[i]+'</a>';
							listavendedor += '</li>';
						}
						$('ul#ulfiltrovendedores').empty();
						$('ul#ulfiltrovendedores').html(listavendedor);
						ReiniciarMarcas();
					}).done(function (){
						$('#nombre').val('');
						$('#nombre').focus();
						$('#color').val('#000000');
						var botones = '';
						botones += '<button type="submit" class="btn btn-default" id="registrarnuevovendedor"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
						botones += '<button type="button" class="btn btn-default" id="cancelarnuevovendedor" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
						$('.botonesformulario').empty();
						$('.botonesformulario').html(botones);
						alert('Vendedor eliminado');
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
					});
					return false;
        },
      });
      return false;
  	}
		$('#modificarvendedor').desbloquearElemento();
    $('#eliminarvendedor').desbloquearElemento();
    $('#cancelarmodificarvendedor').desbloquearElemento();
	});

	$('.modal').on('click', '#cancelarmodificarvendedor', function (){
		$('#nombre').val('');
		$('#color').val('#000000');
		$('#registrosvendedor').val('0');
		$('#registrosvendedor').desbloquearElemento();
		$('#abrirregistrovendedor').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="registrarnuevovendedor"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
		botones += '<button type="button" class="btn btn-default" id="cancelarnuevovendedor" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
	});
	
	/*
	#################################################
	# MODULO PARETO                                 #
	#################################################
	*/
	$('#nuevopareto').click(function (){
		$('.modal-body').load($('#base_url').val()+'Pareto/ModuloPareto/', function (){
			$('.modal-footer').load($('#base_url').val()+'Pareto/BuscadorPareto/',function (){
				$('.modal-title').text('Administrar Paretos');
				$('#myModal').modal('show');
			});
		});
	});

	$('.modal').on('click', '#registrarnuevopareto', function (){
		$('#registrarnuevopareto').bloquearElemento();
    $('#cancelarnuevopareto').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#registrarnuevopareto').desbloquearElemento();
    	$('#cancelarnuevopareto').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Pareto/RegistrarPareto/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Pareto ya está registrado');
					$('#nombre').focus();
					$('#registrarnuevopareto').desbloquearElemento();
					$('#cancelarnuevopareto').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				$.getJSON($('#base_url').val()+'Pareto/ObtenerParetos/', function (data2){
					var idpareto = [];
					var nombrepareto = [];
					$.each(data2, function (key,val){
						idpareto[key] = val.nIdPareto;
						nombrepareto[key] = val.sNombrePareto;
					});
					var listapareto = '';
					listapareto += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idpareto.length;i++){
						listapareto += '<option value="'+idpareto[i]+'">'+nombrepareto[i]+'</option>';
					}
					$('#registrospareto').empty();
					$('#registrospareto').html(listapareto);
					listapareto = '<li><a href="#"><input type="checkbox" class="filtro todosfiltropareto" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idpareto.length;i++){
						listapareto += '<li>';
						listapareto += '<a href="#"><input type="checkbox" class="filtro filtropareto" value="'+idpareto[i]+'" checked="checked" /> '+nombrepareto[i]+'</a>';
						listapareto += '</li>';
					}
					$('ul#ulfiltroparetos').empty();
					$('ul#ulfiltroparetos').html(listapareto);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').val('');
					$('#nombre').focus();
					$('#registrarnuevopareto').desbloquearElemento();
					$('#cancelarnuevopareto').desbloquearElemento();
					alert('Pareto registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#abrirregistropareto', function (){
		$('#abrirregistropareto').bloquearElemento();
		$('#registrospareto').bloquearElemento();
		$('#registrarnuevopareto').bloquearElemento();
		$('#cancelarnuevopareto').bloquearElemento();
		$('#nombre').bloquearElemento();
		if($('#registrospareto').opcionComboEsCero()){
			alert('Debe seleccionar un registro');
			$('#abrirregistropareto').desbloquearElemento();
			$('#registrospareto').desbloquearElemento();
			$('#registrarnuevopareto').desbloquearElemento();
			$('#cancelarnuevopareto').desbloquearElemento();
			$('#nombre').desbloquearElemento();
			return false;
		}
		$('#nombre').val($('#registrospareto option:selected').text());
		$('#nombre').attr('data-valoractual',$('#registrospareto option:selected').text());
		$('#nombre').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificarpareto" data-identificador="'+$('#registrospareto').val()+'"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminarpareto" data-identificador="'+$('#registrospareto').val()+'"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cancelarmodificarpareto"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
		return false;
	});

	$('.modal').on('click', '#modificarpareto', function (){
		$('#modificarpareto').bloquearElemento();
    $('#eliminarpareto').bloquearElemento();
    $('#cancelarmodificarpareto').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificarpareto').desbloquearElemento();
    	$('#eliminarpareto').desbloquearElemento();
    	$('#cancelarmodificarpareto').desbloquearElemento();
			return false;
		}
		if($('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim()){
			alert('No se realizo ninguna modificación');
			$('#nombre').removeAttr('data-valoractual');
			$('#nombre').val('');
			$('#nombre').focus();
			$('#registrospareto').val('0');
			$('#registrospareto').desbloquearElemento();
			$('#abrirregistropareto').desbloquearElemento();
			var botones = '';
			botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
			botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
			$('.botonesformulario').empty();
			$('.botonesformulario').html(botones);
			return false;
		}
		var url = $('#base_url').val()+'Pareto/EditarPareto/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#modificarpareto').attr('data-identificador'),
				'nombre': $('#nombre').val().trim(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Pareto ya está registrado');
					$('#nombre').focus();
					$('#modificarpareto').desbloquearElemento();
    				$('#eliminarpareto').desbloquearElemento();
    				$('#cancelarmodificarpareto').desbloquearElemento();
    				$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				$.getJSON($('#base_url').val()+'Pareto/ObtenerParetos/', function (data2){
					var idpareto = [];
					var nombrepareto = [];
					$.each(data2, function (key,val){
						idpareto[key] = val.nIdPareto;
						nombrepareto[key] = val.sNombrePareto;
					});
					var listapareto = '';
					listapareto += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idpareto.length;i++){
						listapareto += '<option value="'+idpareto[i]+'">'+nombrepareto[i]+'</option>';
					}
					$('#registrospareto').empty();
					$('#registrospareto').html(listapareto);
					$('#registrospareto').desbloquearElemento();
					$('#abrirregistropareto').desbloquearElemento();
					listapareto = '<li><a href="#"><input type="checkbox" class="filtro todosfiltropareto" value="0" checked="checked" />TODOS</a></li>';
					for(i=0;i<idpareto.length;i++){
						listapareto += '<li>';
						listapareto += '<a href="#"><input type="checkbox" class="filtro filtropareto" value="'+idpareto[i]+'" checked="checked" /> '+nombrepareto[i]+'</a>';
						listapareto += '</li>';
					}
					$('ul#ulfiltroparetos').empty();
					$('ul#ulfiltroparetos').html(listapareto);
					ReiniciarMarcas();
				}).done(function (){
					$('#nombre').removeAttr('data-valoractual');
					$('#nombre').val('');
					$('#nombre').focus();
					var botones = '';
					botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
					botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
					$('.botonesformulario').empty();
					$('.botonesformulario').html(botones);
					alert('Pareto modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#eliminarpareto', function (){
		$('#modificarpareto').bloquearElemento();
    $('#eliminarpareto').bloquearElemento();
    $('#cancelarmodificarpareto').bloquearElemento();
		if(confirm('¿Desea eliminar el pareto?')){
      var url = $('#base_url').val()+'Pareto/EliminarPareto/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#eliminarpareto').attr('data-identificador'),
        },
        dataType: 'json',
        beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
        success: function (data) {
          if(data == false){
						alert('El pareto se encuentra relacionado a uno o varios clientes. Elimine las relaciones antes de eliminar el pareto');
						$('#nombre').focus();
						$('#modificarpareto').desbloquearElemento();
    					$('#eliminarpareto').desbloquearElemento();
    					$('#cancelarmodificarpareto').desbloquearElemento();
    					$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					
					//CUANDO VIENE VACIO SE DETIENE CUANDO EL MODO DEL FRAMEWORK ESTA EN DESARROLLO
					$.getJSON($('#base_url').val()+'Pareto/ObtenerParetos/', function (data2){
						var idpareto = [];
						var nombrepareto = [];
						$.each(data2, function (key,val){
							idpareto[key] = val.nIdPareto;
							nombrepareto[key] = val.sNombrePareto;
						});
						var listapareto = '';
						listapareto += '<option value="0">Seleccione un Registro</option>';
						for(i=0;i<idpareto.length;i++){
							listapareto += '<option value="'+idpareto[i]+'">'+nombrepareto[i]+'</option>';
						}
						$('#registrospareto').empty();
						$('#registrospareto').html(listapareto);
						$('#registrospareto').desbloquearElemento();
						$('#abrirregistropareto').desbloquearElemento();
						listapareto = '<li><a href="#"><input type="checkbox" class="filtro todosfiltropareto" value="0" checked="checked" />TODOS</a></li>';
						for(i=0;i<idpareto.length;i++){
							listapareto += '<li>';
							listapareto += '<a href="#"><input type="checkbox" class="filtro filtropareto" value="'+idpareto[i]+'" checked="checked" /> '+nombrepareto[i]+'</a>';
							listapareto += '</li>';
						}
						$('ul#ulfiltroparetos').empty();
						$('ul#ulfiltroparetos').html(listapareto);
						ReiniciarMarcas();
					}).done(function (){
						$('#nombre').val('');
						$('#nombre').focus();
						var botones = '';
						botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
						botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
						$('.botonesformulario').empty();
						$('.botonesformulario').html(botones);
						alert('Pareto eliminado');
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
					});
					return false;
        },
      });
      return false;
  	}
		$('#modificarpareto').desbloquearElemento();
    $('#eliminarpareto').desbloquearElemento();
    $('#cancelarmodificarpareto').desbloquearElemento();
	});

	$('.modal').on('click', '#cancelarmodificarpareto', function (){
		$('#nombre').val('');
		$('#registrospareto').val('0');
		$('#registrospareto').desbloquearElemento();
		$('#abrirregistropareto').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="registrarnuevopareto"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
		botones += '<button type="button" class="btn btn-default" id="cancelarnuevopareto" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
	});

	/*
	#################################################
	# MODULO GRUPO CAPAS                            #
	#################################################
	*/
	$('#nuevogrupocapa').click(function (){
		$('.modal-body').load($('#base_url').val()+'Grupocapa/ModuloGrupoCapa/', function (){
			$('.modal-footer').load($('#base_url').val()+'Grupocapa/BuscadorGrupoCapa/',function (){
				$('.modal-title').text('Administrar Grupo Capas');
				$('#myModal').modal('show');
			});
		});
	});
	
	$('.modal').on('change', '#nivelgrupocapa', function (){
		if($(this).val() == '2'){
			var url = $('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/';
			$.ajax({
				type: 'POST',
				url: url,
				data: {
					'nivelgrupocapa': 'padres',
					'idselected': $('#registrogrupocapa option:selected').val()
				},
				dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
				success: function (data){
					var idgrupocapas = [];
					var nombregrupocapas = [];
					$.each(data, function (key,val){
						idgrupocapas[key] = val.nIdGrupocapa;
						nombregrupocapas[key] = val.sNombreGrupocapa;
					});
					var listagrupocapa = '';
					listagrupocapa += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idgrupocapas.length;i++){
						listagrupocapa += '<option value="'+idgrupocapas[i]+'">'+nombregrupocapas[i]+'</option>';
					}
					$('#grupocapapadre').empty();
					$('#grupocapapadre').html(listagrupocapa);
					$('#grupocapapadre').removeAttr('disabled');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				},
				error: function (error){
					console.log(error);
				}
			});
		}else{
			$('#grupocapapadre').empty();
			$('#grupocapapadre').attr('disabled','disabled');
		}
	});

	$('.modal').on('click', '#registrarnuevogrupocapa', function (){
		$('#registrarnuevogrupocapa').bloquearElemento();
    $('#cancelarnuevogrupocapa').bloquearElemento();
		if($('#nivelgrupocapa').val() == '2' && $('#grupocapapadre').opcionComboEsCero()){
			alert('Debe seleccionar un grupo de nivel 1');
			$('#registrarnuevogrupocapa').desbloquearElemento();
    	$('#cancelarnuevogrupocapa').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe seleccionar un nombre');
			$('#nombre').focus();
			$('#registrarnuevogrupocapa').desbloquearElemento();
    	$('#cancelarnuevogrupocapa').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Grupocapa/RegistrarGrupoCapa/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val(),
				'nivelgrupocapa': $('#nivelgrupocapa').val(),
				'grupocapapadre': $('#grupocapapadre').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Grupo capa ya está registrado');
					$('#nombre').focus();
					$('#registrarnuevogrupocapa').desbloquearElemento();
					$('#cancelarnuevogrupocapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				$.getJSON($('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/', function (data2){
					var idgrupocapas = [];
					var nombregrupocapas = [];
					var padregrupocapas = [];
					$.each(data2, function (key,val){
						idgrupocapas[key] = val.nIdGrupocapa;
						nombregrupocapas[key] = val.sNombreGrupocapa;
						padregrupocapas[key] = val.nPadreGrupocapa;
					});
					var listagrupocapa = '';
					listagrupocapa += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idgrupocapas.length;i++){
						listagrupocapa += '<option value="'+idgrupocapas[i]+'" data-id-padre="'+padregrupocapas[i]+'">'+nombregrupocapas[i]+'</option>';
					}
					$('#registrogrupocapa').empty();
					$('#registrogrupocapa').html(listagrupocapa);
					listagrupocapa = '';
					for(i=0;i<idgrupocapas.length;i++){
						listagrupocapa += '<li>';
						listagrupocapa += '<a href="#"><input type="checkbox" class="capa" value="'+idgrupocapas[i]+'" data-padre-grupocapa="'+padregrupocapas[i]+'" /> '+nombregrupocapas[i]+'</a>';
						listagrupocapa += '</li>';
					}
					$('ul#ulcapas').empty();
					$('ul#ulcapas').html(listagrupocapa);
					ReiniciarCapas();
				}).done(function (){
					
					$('#nivelgrupocapa').val('1');
					$('#grupocapapadre').empty();
					$('#grupocapapadre').attr('disabled','disabled');
					$('#nombre').val('');
					$('#nombre').focus();
					$('#registrarnuevogrupocapa').desbloquearElemento();
					$('#cancelarnuevogrupocapa').desbloquearElemento();
					alert('Grupo capa registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				}).error(function (e){
					console.log(e);
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#abrirregistrogrupocapa', function (){
		$('#abrirregistrogrupocapa').bloquearElemento();
		$('#registrogrupocapa').bloquearElemento();
		$('#registrarnuevogrupocapa').bloquearElemento();
		$('#cancelarnuevogrupocapa').bloquearElemento();
		$('#nombre').bloquearElemento();
		if($('#registrogrupocapa').opcionComboEsCero()){
			alert('Debe seleccionar un registro');
			$('#abrirregistrogrupocapa').desbloquearElemento();
			$('#registrogrupocapa').desbloquearElemento();
			$('#registrarnuevogrupocapa').desbloquearElemento();
			$('#cancelarnuevogrupocapa').desbloquearElemento();
			$('#nombre').desbloquearElemento();
			return false;
		}
		$('#nivelgrupocapa').val('1');
		$('#grupocapapadre').empty();
		$('#grupocapapadre').attr('disabled','disabled');
		var nivelgrupocapaactual = 1;
		if($('#registrogrupocapa option:selected').attr('data-id-padre') != '0'){
			var url = $('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/';
			$.ajax({
				type: 'POST',
				async: false,
				url: url,
				data: {
					'nivelgrupocapa': 'padres'
				},
				dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
				success: function (data){
					var idgrupocapas = [];
					var nombregrupocapas = [];
					$.each(data, function (key,val){
						idgrupocapas[key] = val.nIdGrupocapa;
						nombregrupocapas[key] = val.sNombreGrupocapa;
					});
					var listagrupocapa = '';
					var idpadreselected = $('#registrogrupocapa option:selected').attr('data-id-padre');
					var selected = '';
					listagrupocapa += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idgrupocapas.length;i++){
						if(idgrupocapas[i] == idpadreselected){
							selected = 'selected';
						}
						listagrupocapa += '<option value="'+idgrupocapas[i]+'" '+selected+'>'+nombregrupocapas[i]+'</option>';
						selected = '';
					}
					nivelgrupocapaactual = 2;
					$('#nivelgrupocapa').val('2');
					$('#grupocapapadre').empty();
					$('#grupocapapadre').html(listagrupocapa);
					$('#grupocapapadre').attr('data-valoractual',$('#registrogrupocapa option:selected').attr('data-id-padre'));
					$('#grupocapapadre').removeAttr('disabled');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				},
				error: function (error){
					console.log(error);
				}
			});
		}
		$('#nombre').val($('#registrogrupocapa option:selected').text());
		$('#nivelgrupocapa').attr('data-valoractual',nivelgrupocapaactual);
		$('#nombre').attr('data-valoractual',$('#registrogrupocapa option:selected').text());
		$('#nombre').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificargrupocapa" data-identificador="'+$('#registrogrupocapa').val()+'"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminargrupocapa" data-identificador="'+$('#registrogrupocapa').val()+'"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cancelarmodificargrupocapa"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
		return false;
	});

	$('.modal').on('click', '#modificargrupocapa', function (){
		$('#modificargrupocapa').bloquearElemento();
    $('#eliminargrupocapa').bloquearElemento();
    $('#cancelarmodificargrupocapa').bloquearElemento();
		if($('#nivelgrupocapa').val() == '2' && $('#grupocapapadre').opcionComboEsCero()){
			alert('Debe seleccionar un grupo de nivel 1');
			$('#modificargrupocapa').desbloquearElemento();
    	$('#eliminargrupocapa').desbloquearElemento();
    	$('#cancelarmodificargrupocapa').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificargrupocapa').desbloquearElemento();
    	$('#eliminargrupocapa').desbloquearElemento();
    	$('#cancelarmodificargrupocapa').desbloquearElemento();
			return false;
		}
		if($('#nivelgrupocapa').val() == '2'){
			if($('#nivelgrupocapa').val() == $('#nivelgrupocapa').attr('data-valoractual') && $('#grupocapapadre').val() == $('#grupocapapadre').attr('data-valoractual') && $('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim()){
				alert('No se realizo ninguna modificación');
				$('#nombre').removeAttr('data-valoractual');
				$('#nombre').val('');
				$('#nombre').focus();
				$('#registrogrupocapa').val('0');
				$('#registrogrupocapa').desbloquearElemento();
				$('#abrirregistrogrupocapa').desbloquearElemento();
				var botones = '';
				botones += '<button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
				botones += '<button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
				$('.botonesformulario').empty();
				$('.botonesformulario').html(botones);
				return false;
			}
		}else{
			if($('#grupocapapadre').val() == $('#grupocapapadre').attr('data-valoractual') && $('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim()){
				alert('No se realizo ninguna modificación');
				$('#nivelgrupocapa').removeAttr('data-valoractual');
				$('#nivelgrupocapa').val('1');
				$('#nombre').removeAttr('data-valoractual');
				$('#nombre').val('');
				$('#nombre').focus();
				$('#registrogrupocapa').val('0');
				$('#registrogrupocapa').desbloquearElemento();
				$('#abrirregistrogrupocapa').desbloquearElemento();
				var botones = '';
				botones += '<button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
				botones += '<button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
				$('.botonesformulario').empty();
				$('.botonesformulario').html(botones);
				return false;
			}
		}
		var url = $('#base_url').val()+'Grupocapa/EditarGrupoCapa/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#modificargrupocapa').attr('data-identificador'),
				'nombre': $('#nombre').val().trim(),
				'nivelgrupocapa': $('#nivelgrupocapa').val(),
				'grupocapapadre': $('#grupocapapadre').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Grupo capa ya está registrado');
					$('#nombre').focus();
					$('#modificargrupocapa').desbloquearElemento();
    			$('#eliminargrupocapa').desbloquearElemento();
    			$('#cancelarmodificargrupocapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				if(data == 'KO'){
					alert('Este grupo posee hijos por lo tanto no puede pasar a nivel 2');
					$('#nivelgrupocapa').focus();
					$('#modificargrupocapa').desbloquearElemento();
    			$('#eliminargrupocapa').desbloquearElemento();
    			$('#cancelarmodificargrupocapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				$.getJSON($('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/', function (data2){
					var idgrupocapas = [];
					var nombregrupocapas = [];
					var padregrupocapas = [];
					$.each(data2, function (key,val){
						idgrupocapas[key] = val.nIdGrupocapa;
						nombregrupocapas[key] = val.sNombreGrupocapa;
						padregrupocapas[key] = val.nPadreGrupocapa;
					});
					var listagrupocapa = '';
					listagrupocapa += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idgrupocapas.length;i++){
						listagrupocapa += '<option value="'+idgrupocapas[i]+'" data-id-padre="'+padregrupocapas[i]+'">'+nombregrupocapas[i]+'</option>';
					}
					$('#registrogrupocapa').empty();
					$('#registrogrupocapa').html(listagrupocapa);
					$('#registrogrupocapa').desbloquearElemento();
					$('#abrirregistrogrupocapa').desbloquearElemento();
					listagrupocapa = '';
					for(i=0;i<idgrupocapas.length;i++){
						listagrupocapa += '<li>';
						listagrupocapa += '<a href="#"><input type="checkbox" class="capa" value="'+idgrupocapas[i]+'" data-padre-grupocapa="'+padregrupocapas[i]+'" /> '+nombregrupocapas[i]+'</a>';
						listagrupocapa += '</li>';
					}
					$('ul#ulcapas').empty();
					$('ul#ulcapas').html(listagrupocapa);
					ReiniciarCapas();
				}).done(function (){ //
					$('#nivelgrupocapa').val('1');
					$('#nivelgrupocapa').removeAttr('data-valoractual');
					$('#grupocapapadre').empty();
					$('#grupocapapadre').attr('disabled','disabled');
					$('#grupocapapadre').removeAttr('data-valoractual');
					$('#nombre').removeAttr('data-valoractual');
					$('#nombre').val('');
					$('#nombre').focus();
					var botones = '';
					botones += '<button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
					botones += '<button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
					$('.botonesformulario').empty();
					$('.botonesformulario').html(botones);
					alert('Grupo capa modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				}).error(function (e){
					console.log(e);
				});
				return false;
			},
			error: function (e){
				console.log(e);
			}
		});
		return false;
	});

	$('.modal').on('click', '#eliminargrupocapa', function (){
		$('#modificargrupocapa').bloquearElemento();
    $('#eliminargrupocapa').bloquearElemento();
    $('#cancelarmodificargrupocapa').bloquearElemento();
		if(confirm('¿Desea eliminar el grupo capa?')){
      var url = $('#base_url').val()+'Grupocapa/EliminarGrupoCapa/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#eliminargrupocapa').attr('data-identificador'),
        },
        dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
        success: function (data) {
          if(data == false){
						alert('El grupo de capas se encuentra relacionado a una o varias capas. Elimine las relaciones antes de eliminar el grupo de capas');
						$('#nombre').focus();
						$('#modificargrupocapa').desbloquearElemento();
    				$('#eliminargrupocapa').desbloquearElemento();
    				$('#cancelarmodificargrupocapa').desbloquearElemento();
						return false;
					}
					
					//CUANDO VIENE VACIO SE DETIENE CUANDO EL MODO DEL FRAMEWORK ESTA EN DESARROLLO
					$.getJSON($('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/', function (data2){
						var idgrupocapas = [];
						var nombregrupocapas = [];
						var padregrupocapas = [];
						$.each(data2, function (key,val){
							idgrupocapas[key] = val.nIdGrupocapa;
							nombregrupocapas[key] = val.sNombreGrupocapa;
							padregrupocapas[key] = val.nPadreGrupocapa;
						});
						var listagrupocapa = '';
						listagrupocapa += '<option value="0">Seleccione un Registro</option>';
						for(i=0;i<idgrupocapas.length;i++){
							listagrupocapa += '<option value="'+idgrupocapas[i]+'" data-id-padre="'+padregrupocapas[i]+'">'+nombregrupocapas[i]+'</option>';
						}
						$('#registrogrupocapa').empty();
						$('#registrogrupocapa').html(listagrupocapa);
						$('#registrogrupocapa').desbloquearElemento();
						$('#abrirregistrogrupocapa').desbloquearElemento();
						listagrupocapa = '';
						for(i=0;i<idgrupocapas.length;i++){
							listagrupocapa += '<li>';
							listagrupocapa += '<a href="#"><input type="checkbox" class="capa" value="'+idgrupocapas[i]+'" data-padre-grupocapa="'+padregrupocapas[i]+'" /> '+nombregrupocapas[i]+'</a>';
							listagrupocapa += '</li>';
						}
						$('ul#ulcapas').empty();
						$('ul#ulcapas').html(listagrupocapa);
						ReiniciarCapas();
					}).done(function (){
						$('#nivelgrupocapa').val('1');
						$('#nivelgrupocapa').removeAttr('data-valoractual');
						$('#grupocapapadre').empty();
						$('#grupocapapadre').attr('disabled','disabled');
						$('#grupocapapadre').removeAttr('data-valoractual');
						$('#nombre').removeAttr('data-valoractual');
						$('#nombre').val('');
						$('#nombre').focus();
						var botones = '';
						botones += '<button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
						botones += '<button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
						$('.botonesformulario').empty();
						$('.botonesformulario').html(botones);
						alert('Grupo capa eliminado');
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
					}).error(function (e){
						console.log(e);
					});
					return false;
        },
				error: function (e){
					console.log(e);
				}
      });
      return false;
  	}
		$('#modificargrupocapa').desbloquearElemento();
    $('#eliminargrupocapa').desbloquearElemento();
    $('#cancelarmodificargrupocapa').desbloquearElemento();
	});

	$('.modal').on('click', '#cancelarmodificargrupocapa', function (){
		$('#nivelgrupocapa').val('1');
		$('#grupocapapadre').empty();
		$('#grupocapapadre').attr('disabled','disabled');
		$('#nombre').val('');
		$('#nombre').removeAttr('data-valoractual');
		$('#nivelgrupocapa').removeAttr('data-valoractual');
		$('#grupocapapadre').removeAttr('data-valoractual');
		$('#registrogrupocapa').val('0');
		$('#registrogrupocapa').desbloquearElemento();
		$('#abrirregistrogrupocapa').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
		botones += '<button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
	});
	
	/*
	#################################################
	# MODULO USUARIO                                #
	#################################################
	*/
	$('#nuevousuario').click(function (){
		$('.modal-body').load($('#base_url').val()+'Usuario/ModuloUsuario/', function (){
			$('.modal-footer').load($('#base_url').val()+'Usuario/BuscadorUsuario/',function (){
				$('.modal-title').text('Administrar Usuarios');
				$('#myModal').modal('show');
			});
		});
	});

	$('.modal').on('click', '#registrarnuevousuario', function (){
		$('#registrarnuevousuario').bloquearElemento();
    $('#cancelarnuevousuario').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#registrarnuevousuario').desbloquearElemento();
    	$('#cancelarnuevousuario').desbloquearElemento();
			return false;
		}
		if($('#perfil').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#perfil').focus();
			$('#registrarnuevousuario').desbloquearElemento();
    	$('#cancelarnuevousuario').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Usuario/RegistrarUsuario/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val().trim(),
				'perfil': $('#perfil').val(),
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Usuario ya está registrado');
					$('#nombre').focus();
					$('#registrarnuevousuario').desbloquearElemento();
					$('#cancelarnuevousuario').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				$.getJSON($('#base_url').val()+'Usuario/ObtenerUsuarios/', function (data2){
					var idusuario = [];
					var nombreusuario = [];
					var perfilusuario = [];
					$.each(data2, function (key,val){
						idusuario[key] = val.nIdUsuario;
						nombreusuario[key] = val.sLoginUsuario;
						perfilusuario[key] = val.nPerfilUsuario;
					});
					var listausuario = '';
					listausuario += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idusuario.length;i++){
						listausuario += '<option value="'+idusuario[i]+'" data-perfilusuario="'+perfilusuario[i]+'">'+nombreusuario[i]+'</option>';
					}
					$('#registrosusuario').empty();
					$('#registrosusuario').html(listausuario);
				}).done(function (){
					$('#nombre').val('');
					$('#nombre').focus();
					$('#perfil').val('0');
					$('#registrarnuevousuario').desbloquearElemento();
					$('#cancelarnuevousuario').desbloquearElemento();
					alert('Usuario registrado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#abrirregistrousuario', function (){
		$('#abrirregistrousuario').bloquearElemento();
		$('#registrosusuario').bloquearElemento();
		$('#registrarnuevousuario').bloquearElemento();
		$('#cancelarnuevousuario').bloquearElemento();
		$('#nombre').bloquearElemento();
		$('#perfil').bloquearElemento();
		if($('#registrosusuario').opcionComboEsCero()){
			alert('Debe seleccionar un registro');
			$('#abrirregistrousuario').desbloquearElemento();
			$('#registrosusuario').desbloquearElemento();
			$('#registrarnuevousuario').desbloquearElemento();
			$('#cancelarnuevousuario').desbloquearElemento();
			$('#nombre').desbloquearElemento();
			$('#perfil').desbloquearElemento();
			return false;
		}
		$('#nombre').val($('#registrosusuario option:selected').text());
		$('#perfil').val($('#registrosusuario option:selected').attr('data-perfilusuario'));
		$('#nombre').attr('data-valoractual',$('#registrosusuario option:selected').text());
		$('#perfil').attr('data-valoractual',$('#registrosusuario option:selected').attr('data-perfilusuario'));
		$('#nombre').desbloquearElemento();
		$('#perfil').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificarusuario" data-identificador="'+$('#registrosusuario').val()+'"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminarusuario" data-identificador="'+$('#registrosusuario').val()+'"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cancelarmodificarusuario"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
		return false;
	});

	$('.modal').on('click', '#modificarusuario', function (){
		$('#modificarusuario').bloquearElemento();
    $('#eliminarusuario').bloquearElemento();
    $('#cancelarmodificarusuario').bloquearElemento();
		if($('#nombre').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#nombre').focus();
			$('#modificarusuario').desbloquearElemento();
    	$('#eliminarusuario').desbloquearElemento();
    	$('#cancelarmodificarusuario').desbloquearElemento();
			return false;
		}
		if($('#perfil').opcionComboEsCero()){
			alert('Debe llenar todos los campos del formulario');
			$('#perfil').focus();
			$('#modificarusuario').desbloquearElemento();
    	$('#eliminarusuario').desbloquearElemento();
    	$('#cancelarmodificarusuario').desbloquearElemento();
			return false;
		}
		if($('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim() && $('#perfil').val() == $('#perfil').attr('data-valoractual')){
			alert('No se ha realizado ninguna modificación');
			$('#nombre').removeAttr('data-valoractual');
			$('#perfil').removeAttr('data-valoractual');
			$('#nombre').val('');
			$('#perfil').val('0');
			$('#nombre').focus();
			$('#registrosusuario').val('0');
			$('#registrosusuario').desbloquearElemento();
			$('#abrirregistrousuario').desbloquearElemento();
			var botones = '';
			botones += '<button type="submit" class="btn btn-default" id="registrarnuevotipocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
			botones += '<button type="button" class="btn btn-default" id="cancelarnuevotipocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
			$('.botonesformulario').empty();
			$('.botonesformulario').html(botones);
			return false;
		}
		var url = $('#base_url').val()+'Usuario/EditarUsuario/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#modificarusuario').attr('data-identificador'),
				'nombre': $('#nombre').val().trim(),
				'perfil': $('#perfil').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data == false){
					alert('Usuario ya está registrado');
					$('#nombre').focus();
					$('#modificarusuario').desbloquearElemento();
    				$('#eliminarusuario').desbloquearElemento();
    				$('#cancelarmodificarusuario').desbloquearElemento();
    				$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				$.getJSON($('#base_url').val()+'Usuario/ObtenerUsuarios/', function (data2){
					var idusuario = [];
					var nombreusuario = [];
					var perfilusuario = [];
					$.each(data2, function (key,val){
						idusuario[key] = val.nIdUsuario;
						nombreusuario[key] = val.sLoginUsuario;
						perfilusuario[key] = val.nPerfilUsuario;
					});
					var listausuario = '';
					listausuario += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idusuario.length;i++){
						listausuario += '<option value="'+idusuario[i]+'" data-perfilusuario="'+perfilusuario[i]+'">'+nombreusuario[i]+'</option>';
					}
					$('#registrosusuario').empty();
					$('#registrosusuario').html(listausuario);
					$('#registrosusuario').desbloquearElemento();
					$('#abrirregistrousuario').desbloquearElemento();
				}).done(function (){
					$('#nombre').val('');
					$('#perfil').val('0');
					$('#nombre').focus();
					var botones = '';
					botones += '<button type="submit" class="btn btn-default" id="registrarnuevousuario"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
					botones += '<button type="button" class="btn btn-default" id="cancelarnuevousuario" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
					$('.botonesformulario').empty();
					$('.botonesformulario').html(botones);
					alert('Usuario modificado');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				});
				return false;
			},
		});
		return false;
	});

	$('.modal').on('click', '#eliminarusuario', function (){
		$('#modificarusuario').bloquearElemento();
    $('#eliminarusuario').bloquearElemento();
    $('#cancelarmodificarusuario').bloquearElemento();
		if(confirm('¿Desea eliminar el usuario?')){
      var url = $('#base_url').val()+'Usuario/EliminarUsuario/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#eliminarusuario').attr('data-identificador'),
        },
        dataType: 'json',
        beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
        success: function (data) {
          if(data == false){
						alert('Error al eliminar');
						$('#nombre').focus();
						$('#modificarusuario').desbloquearElemento();
    					$('#eliminarusuario').desbloquearElemento();
    					$('#cancelarmodificarusuario').desbloquearElemento();
    					$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
						return false;
					}
					
					//CUANDO VIENE VACIO SE DETIENE CUANDO EL MODO DEL FRAMEWORK ESTA EN DESARROLLO
					$.getJSON($('#base_url').val()+'Usuario/ObtenerUsuarios/', function (data2){
						var idusuario = [];
						var nombreusuario = [];
						var perfilusuario = [];
						$.each(data2, function (key,val){
							idusuario[key] = val.nIdUsuario;
							nombreusuario[key] = val.sLoginUsuario;
							perfilusuario[key] = val.nPerfilUsuario;
						});
						var listausuario = '';
						listausuario += '<option value="0">Seleccione un Registro</option>';
						for(i=0;i<idusuario.length;i++){
							listausuario += '<option value="'+idusuario[i]+'" data-perfilusuario="'+perfilusuario[i]+'">'+nombreusuario[i]+'</option>';
						}
						$('#registrosusuario').empty();
						$('#registrosusuario').html(listausuario);
						$('#registrosusuario').desbloquearElemento();
						$('#abrirregistrousuario').desbloquearElemento();
					}).done(function (){
						$('#nombre').val('');
						$('#perfil').val('0');
						$('#nombre').focus();
						var botones = '';
						botones += '<button type="submit" class="btn btn-default" id="registrarnuevousuario"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
						botones += '<button type="button" class="btn btn-default" id="cancelarnuevousuario" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
						$('.botonesformulario').empty();
						$('.botonesformulario').html(botones);
						alert('Usuario eliminado');
						$('.loadingSend').remove();
						$('body').css('overflow-y','auto');
					});
					return false;
        },
      });
      return false;
  	}
		$('#modificarusuario').desbloquearElemento();
    $('#eliminarusuario').desbloquearElemento();
    $('#cancelarmodificarusuario').desbloquearElemento();
	});

	$('.modal').on('click', '#cancelarmodificarusuario', function (){
		$('#nombre').val('');
		$('#perfil').val('0');
		$('#registrosusuario').val('0');
		$('#registrosusuario').desbloquearElemento();
		$('#abrirregistrousuario').desbloquearElemento();
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="registrarnuevousuario"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>&nbsp';
		botones += '<button type="button" class="btn btn-default" id="cancelarnuevousuario" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
		$('#nombre').focus();
	});
	
	$('#cambiarcontrasena').click(function (){
		$('.modal-body').load($('#base_url').val()+'Usuario/ModuloContrasena/', function (){
			$('.modal-title').text('Cambiar Contraseña');
			$('#myModal').modal('show');
		});
	});
	
	$('.modal').on('click', '#registrarcambiocontrasena', function (){
		$('#registrarcambiocontrasena').bloquearElemento();
		$('#cancelarcambiocontrasena').bloquearElemento();
		if($('#actual').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#registrarcambiocontrasena').desbloquearElemento();
			$('#cancelarcambiocontrasena').desbloquearElemento();
			$('#actual').focus();
			return false;
		}
		if($('#nueva').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#registrarcambiocontrasena').desbloquearElemento();
			$('#cancelarcambiocontrasena').desbloquearElemento();
			$('#nueva').focus();
			return false;
		}
		if($('#nueva2').estaVacio()){
			alert('Debe llenar todos los campos del formulario');
			$('#registrarcambiocontrasena').desbloquearElemento();
			$('#cancelarcambiocontrasena').desbloquearElemento();
			$('#nueva2').focus();
			return false;
		}
		if($('#nueva').val().trim() != $('#nueva2').val().trim()){
			alert('Las nuevas contraseñas no coinciden');
			$('#registrarcambiocontrasena').desbloquearElemento();
			$('#cancelarcambiocontrasena').desbloquearElemento();
			$('#nueva').focus();
			return false;
		}
		var url = $('#base_url').val()+'Usuario/CambiarContrasena/';
    $.ajax({
			type: 'POST',
			url: url,
			data: {
				'actual': $('#actual').val().trim(),
				'nueva': $('#nueva').val().trim(),
				'nueva2': $('#nueva2').val().trim()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){if(data == false){
					alert('La contraseña actual no es correcta');
					$('#registrarcambiocontrasena').desbloquearElemento();
					$('#cancelarcambiocontrasena').desbloquearElemento();
					$('#actual').focus();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				
				
				$('.modal-title').empty();
				$('.modal-body').empty();
				alert('Contraseña actualizada con exito');
				$('.loadingSend').remove();
				$('body').css('overflow-y','auto');
				$('#myModal').modal('hide');
			},
		});
		return false;
	});
	
	/*
	#################################################
	# MODULO CAPAS                                  #
	#################################################
	*/
	$('.modal').on('change', '#grupocapa', function (){
		if(Number($('#grupocapa option:selected').attr('data-numero-hijos')) > 0){
			var url = $('#base_url').val()+'Grupocapa/ObtenerGrupoCapas/';
			$.ajax({
				type: 'POST',
				url: url,
				data: {
					'nivelgrupocapa': 'hijos',
					'idgrupocapa': $('#grupocapa').val()
				},
				dataType: 'json',
				beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
				success: function (data){
					var idgrupocapas = [];
					var nombregrupocapas = [];
					$.each(data, function (key,val){
						idgrupocapas[key] = val.nIdGrupocapa;
						nombregrupocapas[key] = val.sNombreGrupocapa;
					});
					var listagrupocapa = '';
					var selected = null;
					listagrupocapa += '<option value="0">Seleccione un Registro</option>';
					for(i=0;i<idgrupocapas.length;i++){
						selected = '';
						if($('#grupocapa').attr('data-valoractual')){
							if(idgrupocapas[i] == $('#subgrupocapa').attr('data-valoractual')){
								selected = 'selected';
							}
						}
						listagrupocapa += '<option value="'+idgrupocapas[i]+'" '+ selected +'>'+nombregrupocapas[i]+'</option>';
					}
					$('#subgrupocapa').empty();
					$('#subgrupocapa').html(listagrupocapa);
					$('#subgrupocapa').removeAttr('disabled');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
				},
				error: function (e){
					console.log(e);
				}
			});
			return false;
		}else{
			$('#subgrupocapa').empty();
			$('#subgrupocapa').attr('disabled','disabled');
		}
	});

	$('.modal').on('click', '#registrarnuevacapa', function (){
		$('#registrarnuevacapa').bloquearElemento();
    $('#cancelarnuevacapa').bloquearElemento();
		if($('#grupocapa').opcionComboEsCero()){
			alert('Debe seleccionar un grupo de capas');
			$('#grupocapa').focus();
			$('#registrarnuevacapa').desbloquearElemento();
    	$('#cancelarnuevacapa').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe introducir un nombre para la capa');
			$('#nombre').focus();
			$('#registrarnuevacapa').desbloquearElemento();
    	$('#cancelarnuevacapa').desbloquearElemento();
			return false;
		}
		if($('#color').estaVacio()){
			alert('Seleccione un color para la capa');
			$('#color').focus();
			$('#registrarnuevacapa').desbloquearElemento();
    	$('#cancelarnuevacapa').desbloquearElemento();
			return false;
		}
		if($('#json').estaVacio()){
			alert('Antes de registrar una capa debe dibujarla');
			$('#registrarnuevacapa').desbloquearElemento();
    		$('#cancelarnuevacapa').desbloquearElemento();
			return false;
		}
		if($('#cadenaPoligono').estaVacio()){
			alert('Antes de registrar una capa debe dibujarla');
			$('#registrarnuevacapa').desbloquearElemento();
    		$('#cancelarnuevacapa').desbloquearElemento();
			return false;
		}
		var url = $('#base_url').val()+'Capa/RegistrarCapa/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'nombre': $('#nombre').val().trim(),
				'color': $('#color').val().trim(),
				'json': $('#json').val(),
				'cadenaPoligono': $('#cadenaPoligono').val(),
				'grupocapa': $('#grupocapa').val(),
				'subgrupocapa': $('#subgrupocapa').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				if(data.ExisteNombre > 0){
					alert('Ya existe una capa con el mismo nombre');
					$('#nombre').focus();
					$('#registrarnuevacapa').desbloquearElemento();
					$('#cancelarnuevacapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				if(data.ExisteColor > 0){
					alert('El color ya esta asignado a otra capa del mismo grupo');
					$('#color').focus();
					$('#registrarnuevacapa').desbloquearElemento();
					$('#cancelarnuevacapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false
				}
				
				var arrayCapas = $.parseJSON(data.sJsonCapa)	
				var capaCords = arrayCapas;
				var capa = new google.maps.Polygon({
					paths: capaCords,
					strokeColor: data.sColorCapa,
					strokeOpacity: 0.8,
					strokeWeight: 3,
					fillColor: data.sColorCapa,
					fillOpacity: 0.35
				});
				
				//capa.setMap(mymap);

				capa.addListener('rightclick', function (){
					$('.modal-body').load($('#base_url').val()+'Capa/FormularioVerCapa/',{
							'id': data.nIdCapa,
						}, function (){
							$('.modal-title').text('Datos de la Capa');
							$('#myModal').modal('show');
					});
				});

				var infowindow = new google.maps.InfoWindow({
				  size: new google.maps.Size(150, 50)
				});

				capa.addListener('mouseover', function(event) {
			   	var contentString = data.sNombreCapa;
			    	infowindow.setContent(contentString);
			    	infowindow.setPosition(event.latLng);
			    	infowindow.open(mymap);
			  	});

			  	capa.addListener('mouseout', function(event) {
			    	infowindow.close(mymap);
			  	});

			  	capas.push(capa);
				idcapas.push(data.nIdCapa);
				statuscapas.push(false);
				idgrupocapas.push(data.nIdGrupocapa);
				idsubgrupocapas.push(data.nIdSubgrupocapa);

				ReiniciarCapas();
				alert('Capa registrada');
				$('.loadingSend').remove();
				$('body').css('overflow-y','auto');
				$('#myModal').modal('hide');
				
			},
			error: function (e){
				console.log(e);
			}
		});
		return false;
	});

	$('.modal').on('click', '#editarcapaactual', function (){
		$('.form-control').removeAttr("disabled");
		var botones = '';
		botones += '<button type="submit" class="btn btn-default" id="modificarcapaactual"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Modificar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="eliminarcapaactual"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>&nbsp;';
		botones += '<button type="button" class="btn btn-default" id="cerrarvercapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>';
		$('.botonesformulario').empty();
		$('.botonesformulario').html(botones);
	});
	
	$('.modal').on('click', '#modificarcapaactual', function (){
		var opcion = false;
		$('#modificarcapaactual').bloquearElemento();
		$('#eliminarcapaactual').bloquearElemento();
		$('#cerrarvercapa').bloquearElemento();
		if($('#grupocapa').opcionComboEsCero()){
			alert('Debe seleccionar un grupo de capas');
			$('#grupocapa').focus();
			$('#modificarcapaactual').desbloquearElemento();
			$('#eliminarcapaactual').desbloquearElemento();
			$('#cerrarvercapa').desbloquearElemento();
			return false;
		}
		if($('#nombre').estaVacio()){
			alert('Debe introducir un nombre para la capa');
			$('#nombre').focus();
			$('#modificarcapaactual').desbloquearElemento();
			$('#eliminarcapaactual').desbloquearElemento();
			$('#cerrarvercapa').desbloquearElemento();
			return false;
		}
		if($('#color').estaVacio()){
			alert('Seleccione un color para la capa');
			$('#color').focus();
			$('#modificarcapaactual').desbloquearElemento();
			$('#eliminarcapaactual').desbloquearElemento();
			$('#cerrarvercapa').desbloquearElemento();
			return false;
		}
		if($('#grupocapa').val() == $('#grupocapa').attr('data-valoractual') && $('#subgrupocapa').val() == $('#subgrupocapa').attr('data-valoractual') && $('#nombre').val().trim() == $('#nombre').attr('data-valoractual').trim() && $('#color').val() == $('#color').attr('data-valoractual')){
			alert('No se realizo ninguna modificación');
			$('.modal').modal('hide');
			return false;
		}
		var url = $('#base_url').val()+'Capa/ModificarCapa/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#idcapa').val(),
				'nombre': $('#nombre').val().trim(),
				'color': $('#color').val().trim(),
				'grupocapa': $('#grupocapa').val(),
				'subgrupocapa': $('#subgrupocapa').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				//console.log(data);
				if(data.ExisteNombre > 0){
					alert('Ya existe una capa con el mismo nombre');
					$('#nombre').focus();
					$('#modificarcapaactual').desbloquearElemento();
					$('#eliminarcapaactual').desbloquearElemento();
					$('#cerrarvercapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false;
				}
				if(data.ExisteColor > 0){
					alert('El color ya esta asignado a otra capa');
					$('#color').focus();
					$('#modificarcapaactual').desbloquearElemento();
					$('#eliminarcapaactual').desbloquearElemento();
					$('#cerrarvercapa').desbloquearElemento();
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					return false
				}
				

				var posicion = idcapas.indexOf($('#idcapa').val());
				capas[posicion].setMap(null);
				capas[posicion] = null;

				var arrayCapas = $.parseJSON(data.sJsonCapa)	
				var capaCords = arrayCapas;
				var capa = new google.maps.Polygon({
					paths: capaCords,
					strokeColor: data.sColorCapa,
					strokeOpacity: 0.8,
					strokeWeight: 3,
					fillColor: data.sColorCapa,
					fillOpacity: 0.35
				});
				
				//capa.setMap(mymap);
				
				capa.addListener('rightclick', function (){
					$('.modal-body').load($('#base_url').val()+'Capa/FormularioVerCapa/',{
							'id': data.nIdCapa,
						}, function (){
							$('.modal-title').text('Datos de la Capa');
							$('#myModal').modal('show');
					});
				});

				var infowindow = new google.maps.InfoWindow({
				  size: new google.maps.Size(150, 50)
				});

				capa.addListener('mouseover', function(event) {
			   	var contentString = data.sNombreCapa;
			    	infowindow.setContent(contentString);
			    	infowindow.setPosition(event.latLng);
			    	infowindow.open(mymap);
			  	});

			  	capa.addListener('mouseout', function(event) {
			    	infowindow.close(mymap);
			  	});

			  	capas[posicion] = capa;
				idcapas[posicion] = data.nIdCapa;
				statuscapas[posicion] = false;
				idgrupocapas[posicion] = data.nIdGrupocapa;
				idsubgrupocapas[posicion] = data.nIdSubgrupocapa;

				ReiniciarCapas();
				$('.capa').prop('checked',false);
				
				alert('Capa modificada');
				$('.loadingSend').remove();
				$('body').css('overflow-y','auto');
				$('#myModal').modal('hide');
			},
			error: function (e){
				console.log(e);
			}
		});
		return false;
	});
	
	$('.modal').on('click', '#eliminarcapaactual', function (){
		$('#editarcapaactual').bloquearElemento();
		$('#eliminarcapaactual').bloquearElemento();
    $('#cerrarvercapa').bloquearElemento();
		if(confirm('¿Desea eliminar la capa?')){
      var url = $('#base_url').val()+'Capa/EliminarCapaSeleccionada/';
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          'id': $('#idcapa').val()
        },
        dataType: 'json',
        beforeSend: function (){
					$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
				},
        success: function (data) {
          if(data=='ERROR'){
            alert('Error al eliminar');
						$('#editarcapaactual').bloquearElemento();
						$('#eliminarcapaactual').desbloquearElemento();
    				$('#cerrarvercapa').desbloquearElemento();
    				$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
            return false;
          }
					var posicion = idcapas.indexOf($('#idcapa').val());
					capas[posicion].setMap(null);
					capas.splice(posicion,1);
					idcapas.splice(posicion,1);
					statuscapas.splice(posicion,1);
					idgrupocapas.splice(posicion,1);
					idsubgrupocapas.splice(posicion,1);
					
					$('.modal-title').empty();
					$('.modal-body').empty();
					alert('Capa eliminada');
					$('.loadingSend').remove();
					$('body').css('overflow-y','auto');
					$('#myModal').modal('hide');
        },
				error: function (e){
					console.log(e);
				}
      });
      return false;
  	}
		$('#editarcapaactual').desbloquearElemento();
		$('#eliminarcapaactual').desbloquearElemento();
    $('#cerrarvercapa').desbloquearElemento();
	});

	$('.modal').on('click', '#cambiarclientes', function (){
		var url = $('#base_url').val()+'Capa/ModificarClientesContenidosEnCapa/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'id': $('#idcapa').val(),
				'vendedor': $('#vendedor').val(),
				'frecuencia': $('#frecuencia').val(),
				'diavisita': $('#diavisita').val()
			},
			dataType: 'json',
			beforeSend: function (){
				$('body').css('overflow-y','hidden').append('<div class="loadingSend"><div class="outer"><div class="middle"><div class="inner"><i id="loadingIcon" class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div></div></div></div>');
			},
			success: function (data){
				//console.log(data);
				for(i=0;i<marcas.length;i++){
					marcas[i].setMap(null);
				}
				marcas = [];
				idmarcas = [];
				rifmarcas = [];
				nombremarcas = [];
				filtroclientes = [];
				filtrovendedores = [];
				filtroparetos = [];
				filtrofrecuencias = [];
				statusmarcas = [];
				$.getJSON($('#base_url').val()+'Cliente/ObtenerClientes/', function (data){
					var marca;
					var imagen;
					$.each(data, function (key,val) {
						marca = null;
						imagen = null;
						imagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+val.sColorVendedor.split('#')[1],
							new google.maps.Size(21, 34),
							new google.maps.Point(0,0),
							new google.maps.Point(10, 34)
						);
						marca = new google.maps.Marker({
							position: new google.maps.LatLng(val.nLatCliente,val.nLngCliente),
							draggable:false,
							title: val.sRifCliente+' - '+val.sNombreCliente,
							icon: imagen 
						});
						
						marca.addListener('dragstart', function (e){
							actualLatLng = this.getPosition();
						});
								
						marca.addListener('dragend', function(e) {
							var thisMark = this;
							this.setDraggable(false);
							if(confirm('¿Desea mover el cliente de posición?')){
								var url = $('#base_url').val()+'Cliente/ModificarCoordenadasCliente/';
								$.ajax({
									type: 'POST',
									url: url,
									data: {
										'id': val.nIdCliente,
										'latitud': this.getPosition().lat(),
										'longitud': this.getPosition().lng(),
										'cadenaPunto': 'POINT('+ this.getPosition().lat() +' '+ this.getPosition().lng() +')'
									},
									dataType: 'json',
									success: function (data){
										if(data == false){
											alert('Ya existe un usuario en esas coordenadas');
											thisMark.setPosition(actualLatLng);
											actualLatLng = null;
											return false;
										}
									},
								});
								return false;
							}else {
								this.setPosition(actualLatLng);
								actualLatLng = null;
							}
						});
						
						marca.addListener('dblclick', function() {
							$('.modal-body').load($('#base_url').val()+'Cliente/FormularioVerCliente/',{
									'id': val.nIdCliente,
								}, function (){
									$('.modal-title').text('Datos del Cliente');
									$('#myModal').modal('show');
							});
						});
						
						marca.addListener('rightclick', function (e){
							var ev = this;
							this.setDraggable(true);
							setTimeout(function(){
								ev.setDraggable(false); 
							}, 3000);
						});
						
						marca.setMap(mymap);
						marcas.push(marca);
						idmarcas.push(val.nIdCliente);
						rifmarcas.push(val.sRifCliente);
						nombremarcas.push(val.sNombreCliente);
						filtroclientes.push(val.nIdTipoCliente);
						filtrovendedores.push(val.nIdVendedor);
						filtroparetos.push(val.nIdPareto);
						filtrofrecuencias.push(val.nIdFrecuencia);
						statusmarcas.push(true);
					});
				});
				$('.loadingSend').remove();
				$('body').css('overflow-y','auto');
				$('#myModal').modal('hide');
			},
			error: function (e){
				console.log(e);
			}
		});
	});
	
	/*
	#################################################
	# MODULO EXPORTAR EXCEL                         #
	#################################################
	*/
	
	/*$('#exportarexcel').on('click', function (){
		var url = $('#base_url').val()+'Cliente/exportarClientes/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				
			},
			dataType: 'html',
			success: function (data){
				console.log(data);
			}
		});
	});*/
	
	/*
	#################################################
	# APLICAR FILTROS A LAS MARCAS DEL MAPA         #
	#################################################
	*/
	$('body').on('click', '.filtro', function (){
		$('#buscarRif').val('');
		$('.filtro').bloquearElemento();
		if($(this).hasClass('todosfiltrocliente')){
			if($(this).prop('checked')==true){
				$('.filtrocliente').prop('checked',true);
			}else{
				$('.filtrocliente').prop('checked',false);
			}
		}
		if($(this).hasClass('todosfiltrovendedor')){
			if($(this).prop('checked')==true){
				$('.filtrovendedor').prop('checked',true);
			}else{
				$('.filtrovendedor').prop('checked',false);
			}	
		}
		if($(this).hasClass('todosfiltropareto')){
			if($(this).prop('checked')==true){
				$('.filtropareto').prop('checked',true);
			}else{
				$('.filtropareto').prop('checked',false);
			}	
		}
		if($(this).hasClass('todosfiltrofrecuencia')){
			if($(this).prop('checked')==true){
				$('.filtrofrecuencia').prop('checked',true);
			}else{
				$('.filtrofrecuencia').prop('checked',false);
			}	
		}
		var idstipocliente = [];
		var idsvendedor = [];
		var idspareto = [];
		var idsfrecuencia = [];
		var contadorfiltrocliente = 0;
		var contadorfiltrovendedor = 0;
		var contadorfiltropareto = 0;
		var contadorfiltrofrecuencia = 0;
 		$('.filtrocliente').each(function (){
			if($(this).prop('checked')==true){
				idstipocliente.push($(this).val());
				contadorfiltrocliente++;
			}
		});
		$('.filtrovendedor').each(function (){
			if($(this).prop('checked')==true){
				idsvendedor.push($(this).val()); 
				contadorfiltrovendedor++;
			}
		});
		$('.filtropareto').each(function (){
			if($(this).prop('checked')==true){
				idspareto.push($(this).val()); 
				contadorfiltropareto++;
			}
		});
		$('.filtrofrecuencia').each(function (){
			if($(this).prop('checked')==true){
				idsfrecuencia.push($(this).val()); 
				contadorfiltrofrecuencia++;
			}
		});
		var bandtipocliente = false;
		var bandvendedor = false;
		var bandpareto = false;
		var bandfrecuencia = false;
		for(i=0;i<marcas.length;i++){
			for(j=0;j<idstipocliente.length;j++){
				if(filtroclientes[i]==idstipocliente[j]){
					bandtipocliente = true;
					break;
				}
			}
			for(j=0;j<idsvendedor.length;j++){
				if(filtrovendedores[i]==idsvendedor[j]){
					bandvendedor = true;
					break;
				}
			}
			if(filtroparetos[i]=='0'){
				bandpareto = true;
			}
			else{
				for(j=0;j<idspareto.length;j++){		
					if(filtroparetos[i]==idspareto[j]){
						bandpareto = true;
						break;
					}
				}	
			}
			if(filtrofrecuencias[i]=='0'){
				bandfrecuencia = true;
			}
			else{
				for(j=0;j<idsfrecuencia.length;j++){
					if(filtrofrecuencias[i]==idsfrecuencia[j]){
						bandfrecuencia = true;
						break;
					}
				}	
			}
			if(statusmarcas[i]==false){
				if(bandtipocliente && bandvendedor && bandpareto && bandfrecuencia){
					statusmarcas[i]=true;
    			marcas[i].setMap(mymap);
				}	
			}else{
				if(!bandtipocliente || !bandvendedor || !bandpareto || !bandfrecuencia){
					statusmarcas[i]=false;
    			marcas[i].setMap(null);
				}	
			}
			bandtipocliente = false;
			bandvendedor = false;
			bandpareto = false;
			bandfrecuencia = false;
		}
		if($('.filtrocliente').length == contadorfiltrocliente){
			$('.todosfiltrocliente').prop('checked',true);
		}else{
			$('.todosfiltrocliente').prop('checked',false);
		}
		if($('.filtropareto').length == contadorfiltropareto){
			$('.todosfiltropareto').prop('checked',true);
		}else{
			$('.todosfiltropareto').prop('checked',false);
		}
		if($('.filtrovendedor').length == contadorfiltrovendedor){
			$('.todosfiltrovendedor').prop('checked',true);
		}else{
			$('.todosfiltrovendedor').prop('checked',false);
		}
		if($('.filtrofrecuencia').length == contadorfiltrofrecuencia){
			$('.todosfiltrofrecuencia').prop('checked',true);
		}else{
			$('.todosfiltrofrecuencia').prop('checked',false);
		}
		$('.filtro').desbloquearElemento();
	});
	
	/*
	#################################################
	# APLICAR CAPAS                                 #
	#################################################
	*/
	
	$('body').on('click', '.capa', function (){
		if(Number($(this).attr('data-padre-grupocapa')) == 0){
			if($(this).prop('checked')==true){
				for(var i=0; i<capas.length; i++){
					if($(this).val() == idgrupocapas[i]){
						statuscapas[i]=true;
						capas[i].setMap(mymap);
					}
				}
			}else{
				for(var i=0; i<capas.length; i++){
					if($(this).val() == idgrupocapas[i]){
						statuscapas[i]=false;
						capas[i].setMap(null);
					}
				}
			}
		}else{
			if($(this).prop('checked')==true){
				for(var i=0; i<capas.length; i++){
					if($(this).val() == idsubgrupocapas[i]){
						statuscapas[i]=true;
						capas[i].setMap(mymap);
					}
				}
			}else{
				for(var i=0; i<capas.length; i++){
					if($(this).val() == idsubgrupocapas[i]){
						statuscapas[i]=false;
						capas[i].setMap(null);
					}
				}
			}
		}
	});
	/*
	#################################################
	# Eventos adicionales                           #
	#################################################
	*/
	$('.modal').on('hidden.bs.modal', function (){
  	$('.modal-title').html('');
		$('.contenidomodalview').remove();
	});

	/*$('.modal').on('shown.bs.modal', function () {
    $('#nombre').focus();
	});*/
	
	$('#consultarRif').on('click', function (){
		$(this).bloquearElemento();
		if($('#buscarRif').val().trim().length > 0){
			for(i=0;i<marcas.length;i++){
				if(rifmarcas[i].includes($('#buscarRif').val().toString().toUpperCase())){
					marcas[i].setMap(mymap);
					statusmarcas[i] = true;
				}else if(nombremarcas[i].includes($('#buscarRif').val().toString().toUpperCase())){
					marcas[i].setMap(mymap);
					statusmarcas[i] = true;
				}else{
					marcas[i].setMap(null);
					statusmarcas[i] = false;
				}
			}
			$('.filtro').prop('checked',false);
		}
		$(this).desbloquearElemento();
	});

	$('form').on('submit',function (e){
		e.preventDefault();
		$('#consultarRif').trigger('click');
	});

//DE ESTA FORMA LOS FILTROS SE APLICAN A TRAVES DE CONSULTAS A BASES DE DATOS
	/*$('body').on('click', '.filtro', function (){
		$('.filtro').bloquearElemento();
		var tipocliente = '';
		var vendedor = '';
		var pareto = '';
		var frecuencia = '';
		$('.filtro').each(function (){
			if($(this).prop('checked') == true){
				if($(this).attr('class').split(' ')[1] == 'filtrocliente'){
					tipocliente += $(this).val()+',';
				}
				if($(this).attr('class').split(' ')[1] == 'filtrovendedor'){
					vendedor += $(this).val()+',';
				}
				if($(this).attr('class').split(' ')[1] == 'filtropareto'){
					pareto += $(this).val()+',';
				}
				if($(this).attr('class').split(' ')[1] == 'filtrofrecuencia'){
					frecuencia += $(this).val()+',';
				}
			}
		});
		tipocliente = tipocliente.substring(0,tipocliente.length-1);
		vendedor = vendedor.substring(0,vendedor.length-1);
		pareto = pareto.substring(0,pareto.length-1);
		frecuencia = frecuencia.substring(0,frecuencia.length-1);
		var url = $('#base_url').val()+'Cliente/AplicarFiltroClientes/';
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'tipocliente': tipocliente,
				'vendedor': vendedor,
				'pareto': pareto,
				'frecuencia': frecuencia
			},
			dataType: 'json',
		}).done(function (data){
			for(i=0;i<marcas.length;i++) {
    		marcas[i].setMap(null);
  		}
			marcas.splice(0,marcas.length);
			statusmarcas.splice(0,statusmarcas.length);
			idmarcas.splice(0,idmarcas.length);
			filtroclientes.splice(0,filtroclientes.length);
			filtrovendedores.splice(0,filtrovendedores.length);
			filtroparetos.splice(0,filtroparetos.length);
			filtrofrecuencias.splice(0,filtrofrecuencias.length);
			var marca;
			var imagen;
			$.each(data, function (key,val) {
				marca = null;
				imagen = null;
				imagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+val.sColorVendedor.split('#')[1],
        	new google.maps.Size(21, 34),
        	new google.maps.Point(0,0),
        	new google.maps.Point(10, 34)
				);
				marca = new google.maps.Marker({
					position: new google.maps.LatLng(val.nLatCliente,val.nLngCliente),
					draggable: true,
					title: val.sRifCliente+' - '+val.sNombreCliente,
					icon: imagen
				});
				marca.addListener('dragend', function() {
					if(confirm('¿Desea mover el cliente de posición?')){
						var url = $('#base_url').val()+'Cliente/ModificarCoordenadasCliente/';
						$.ajax({
							type: 'POST',
							url: url,
							data: {
								'id': val.nIdCliente,
								'latitud': this.getPosition().lat(),
								'longitud': this.getPosition().lng(),
							},
							dataType: 'json',
							success: function (data){
								if(data == false){
									alert('Ya existe un usuario en esas coordenadas');
									ReiniciarMarcas();
									return false;
								}
							},
						});
						return false;
					}
					ReiniciarMarcas();
				});
				marca.addListener('click', function() {
					$('.modal-body').load($('#base_url').val()+'Cliente/FormularioVerCliente/',{
							'id': val.nIdCliente,
						}, function (){
							$('.modal-title').text('Datos del Cliente');
							$('#myModal').modal('show');
					});
				});
				marca.setMap(mymap);
				marcas.push(marca);
				idmarcas.push(val.nIdCliente);
				filtroclientes.push(val.nIdTipoCliente);
				filtrovendedores.push(val.nIdVendedor);
				filtroparetos.push(val.nIdPareto);
				filtrofrecuencias.push(val.nIdFrecuencia);
				statusmarcas.push(true);
			});
			$('.filtro').desbloquearElemento();
		});
	});*/
});