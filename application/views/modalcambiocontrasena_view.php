<form role="form" id="cambiocontrasenaform" class="contenidomodalview">
  <div class="form-group">
    <label for="actual">Contraseña Actual:</label>
    <input type="password" class="form-control" id="actual" maxlength="255">
  </div>
	<div class="form-group">
    <label for="nueva">Nueva Contraseña:</label>
    <input type="password" class="form-control" id="nueva" maxlength="255">
  </div>
	<div class="form-group">
    <label for="nueva2">Repita Nueva Contraseña:</label>
    <input type="password" class="form-control" id="nueva2" maxlength="255">
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="submit" class="btn btn-default" id="registrarcambiocontrasena"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarcambiocontrasena" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>