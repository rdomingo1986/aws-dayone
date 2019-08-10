<form role="form" id="nuevogrupocapaform" class="contenidomodalview">
  <div class="form-group">
		<label for="nivelgrupocapa">Nivel Grupo Capa:</label>
		<select class="form-control" id="nivelgrupocapa">
			<option value="1">Nivel 1</option>
			<option value="2">Nivel 2</option>
		</select>
	</div>
	<div class="form-group">
		<label for="grupocapapadre">Grupo Capa:</label>
		<select class="form-control" id="grupocapapadre" disabled>
		</select>
	</div>
	<div class="form-group">
    <label for="nombre">Nombre Grupo Capa:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" maxlength="255" style="text-transform:uppercase;">
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="submit" class="btn btn-default" id="registrarnuevogrupocapa"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarnuevogrupocapa" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>