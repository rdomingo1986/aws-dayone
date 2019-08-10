<form role="form" id="nuevacapaform" class="contenidomodalview">
  <div class="form-group">
		<label for="grupocapa">Grupo Capa:</label>
		<select class="form-control" id="grupocapa">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdGrupocapa);$i++){
					echo '<option value="'.$nIdGrupocapa[$i].'" data-numero-hijos="'.$nHijos[$i].'">'.$sNombreGrupocapa[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<label for="subgrupocapa">Sub-Grupo Capa:</label>
		<select class="form-control" id="subgrupocapa" disabled>
		</select>
	</div>
  <div class="form-group">
    <label for="nombre">Nombre Capa:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" maxlength="255" style="text-transform:uppercase;">
  </div>
  <div class="form-group">
    <label for="color">Color Capa:</label>
    <input type="color" class="form-control" id="color" >
  </div>
  <input type="hidden" class="form-control" id="json" value='<?php echo $_POST['json'];?>'>
  <input type="hidden" class="form-control" id="cadenaPoligono" value='<?php echo $_POST['cadenaPoligono'];?>'>
  <center>
    <div class="form-group botonesformulario">
      <button type="submit" class="btn btn-default" id="registrarnuevacapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarnuevacapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>