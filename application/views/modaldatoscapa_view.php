<form role="form" id="vercapaform" class="contenidomodalview">
  <input type="hidden" id="idcapa" value="<?php echo $nIdCapa;?>">
  <div class="form-group">
		<label for="grupocapa">Grupo Capa:</label>
		<select class="form-control" id="grupocapa" disabled data-valoractual="<?php echo $nIdGrupocapa;?>">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($SELECTnIdGrupocapa);$i++){
          $seleccionado = ($SELECTnIdGrupocapa[$i]==$nIdGrupocapa) ? 'selected' : '';
					echo '<option value="'.$SELECTnIdGrupocapa[$i].'" data-numero-hijos="'.$SELECTnHijos[$i].'" '.$seleccionado.'>'.$SELECTsNombreGrupocapa[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<label for="subgrupocapa">Sub-Grupo Capa:</label>
		<select class="form-control" id="subgrupocapa" disabled data-valoractual="<?php echo $nIdSubgrupocapa;?>">
			<?php
				if(count($SELECTSubnIdGrupocapa) > 0){
					echo '<option value="0">Seleccione un Registro</option>';
					for($i=0;$i<count($SELECTSubnIdGrupocapa);$i++){
						$seleccionado = ($SELECTSubnIdGrupocapa[$i]==$nIdSubgrupocapa) ? 'selected' : '';
						echo '<option value="'.$SELECTSubnIdGrupocapa[$i].'" '.$seleccionado.'>'.$SELECTSubsNombreGrupocapa[$i].'</option>';
					}
				}
			?>
		</select>
	</div>
  <div class="form-group">
    <label for="nombre">Nombre Capa:</label>
    <input disabled type="text" autocomplete="off" class="form-control" id="nombre" data-valoractual="<?php echo $sNombreCapa;?>" value="<?php echo $sNombreCapa;?>" maxlength="255" style="text-transform:uppercase;">
  </div>
  <div class="form-group">
    <label for="color">Color Capa:</label>
    <input disabled type="color" class="form-control" id="color" data-valoractual="<?php echo $sColorCapa;?>" value="<?php echo $sColorCapa;?>">
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="button" class="btn btn-default" id="editarcapaactual"><span class="glyphicon glyphicon-pencil"></span>&nbsp;Editar</button>
      <button type="button" class="btn btn-default" id="eliminarcapaactual"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>
      <button type="button" class="btn btn-default" id="cerrarvercapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>
<br />
<h2 class="text-center">OPERACIONES MASIVAS</h2>
<form role="form" id="operacionmasivaform" class="contenidomodalview">
	<div class="form-group">
		<label for="grupocapa">Vendedor:</label>
		<select class="form-control" id="vendedor">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($SELECTnIdVendedor);$i++){
					echo '<option value="'.$SELECTnIdVendedor[$i].'">'.$SELECTsNombreVendedor[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
    <label for="frecuencia">Frecuencia:</label>
    <select class="form-control" id="frecuencia">
      <option value="-1">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($SELECTnIdFrecuencia);$i++){
          echo '<option value="'.$SELECTnIdFrecuencia[$i].'">'.$SELECTnNumeroFrecuencia[$i].'</option>';
        }
      ?>
    </select>
  </div>
	<div class="form-group">
    <label for="frecuencia">Dia de Visita:</label>
    <select class="form-control" id="diavisita">
      <option value="0">Seleccione una Opción</option>
			<option value="L">Lunes</option>
      <option value="M">Martes</option>
			<option value="X">Miercoles</option>
			<option value="J">Jueves</option>
			<option value="V">Viernes</option>
			<option value="S">Sabado</option>
			<option value="D">Domingo</option>
    </select>
  </div>
	<center>
    <div class="form-group botonesformulario2">
      <button type="button" class="btn btn-default" id="cambiarclientes"><span class="glyphicon glyphicon-pencil"></span>&nbsp;Cambiar</button>
      
    </div>
  </center>
</form>