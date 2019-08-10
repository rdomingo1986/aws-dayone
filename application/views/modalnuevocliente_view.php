<form role="form" id="nuevoclienteform" class="contenidomodalview">
  <div class="form-group">
    <label for="tipocliente">Tipo Cliente:</label>
    <select class="form-control" id="tipocliente">
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($nIdTipoCliente);$i++){
          echo '<option value="'.$nIdTipoCliente[$i].'">'.$sNombreTipoCliente[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="vendedor">Vendedor:</label>
    <select class="form-control" id="vendedor">
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($nIdVendedor);$i++){
          echo '<option value="'.$nIdVendedor[$i].'">'.$sNombreVendedor[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="pareto">Pareto:</label>
    <select class="form-control" id="pareto">
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($nIdPareto);$i++){
          echo '<option value="'.$nIdPareto[$i].'">'.$sNombrePareto[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="frecuencia">Frecuencia:</label>
    <select class="form-control" id="frecuencia">
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($nIdFrecuencia);$i++){
          echo '<option value="'.$nIdFrecuencia[$i].'">'.$nNumeroFrecuencia[$i].'</option>';
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
  <div class="form-group">
    <label for="rif">RIF:</label>
    <input type="text" autocomplete="off" class="form-control" id="rif" maxlength="10" style="text-transform:uppercase;">
  </div>
  <div class="form-group">
    <label for="nombre">Nombre:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" maxlength="255" style="text-transform:uppercase;">
  </div>
  <center>
    <div class="form-group">
      <button type="submit" class="btn btn-default" id="registrarnuevocliente"><span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Registrar</button>
      <button type="button" class="btn btn-default" id="cancelarnuevocliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
  <input type="hidden" class="form-control" id="latitud" value="<?php echo $_POST['latitud'];?>" readonly>
  <input type="hidden" class="form-control" id="longitud" value="<?php echo $_POST['longitud'];?>" readonly>
  <input type="hidden" class="form-control" id="cadenaPunto" value="<?php echo $_POST['cadenaPunto'];?>" readonly>
</form>