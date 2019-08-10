<form role="form" id="nuevovendedorform" class="contenidomodalview">
  <div class="form-group">
    <label for="nombre">Nombre Vendedor:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" maxlength="255" style="text-transform:uppercase;">
  </div>
  <div class="form-group">
    <label for="color">Color Vendedor:</label>
    <input type="color" class="form-control" id="color" >
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="submit" class="btn btn-default" id="registrarnuevovendedor"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarnuevovendedor" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
</form>