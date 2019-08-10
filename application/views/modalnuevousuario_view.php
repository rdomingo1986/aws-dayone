<form role="form" id="nuevousuarioform" class="contenidomodalview">
  <div class="form-group">
    <label for="nombre">Nombre:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" maxlength="255" style="text-transform:uppercase;">
  </div>
	<div class="form-group">
    <label for="perfil">Perfil:</label>
    <select class="form-control" id="perfil">
      <option value="0">Seleccione una Opción</option>
      <option value="1">Administrador</option>
      <option value="2">Vendedor</option>
    </select>
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="submit" class="btn btn-default" id="registrarnuevousuario"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarnuevousuario" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>