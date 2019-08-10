<form role="form" id="verclienteform" class="contenidomodalview">
  <input type="hidden" id="idcliente" value="<?php echo $nIdCliente;?>">
  <div class="form-group">
    <label for="tipocliente">Tipo Cliente:</label>
    <select class="form-control" id="tipocliente" disabled>
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($SELECTnIdTipoCliente);$i++){
          $seleccionado = ($SELECTnIdTipoCliente[$i]==$nIdTipoCliente) ? 'selected' : '';
          echo '<option value="'.$SELECTnIdTipoCliente[$i].'" '.$seleccionado.'>'.$SELECTsNombreTipoCliente[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="vendedor">Vendedor:</label>
    <select class="form-control" id="vendedor" disabled>
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($SELECTnIdVendedor);$i++){
          $seleccionado = ($SELECTnIdVendedor[$i]==$nIdVendedor) ? 'selected' : '';
          echo '<option value="'.$SELECTnIdVendedor[$i].'" '.$seleccionado.'>'.$SELECTsNombreVendedor[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="pareto">Pareto:</label>
    <select class="form-control" id="pareto" disabled>
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($SELECTnIdPareto);$i++){
          $seleccionado = ($SELECTnIdPareto[$i]==$nIdPareto) ? 'selected' : '';
          echo '<option value="'.$SELECTnIdPareto[$i].'" '.$seleccionado.'>'.$SELECTsNombrePareto[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="frecuencia">Frecuencia:</label>
    <select class="form-control" id="frecuencia" disabled>
      <option value="0">Seleccione una Opción</option>
      <?php
        for($i=0;$i<count($SELECTnIdFrecuencia);$i++){
          $seleccionado = ($SELECTnIdFrecuencia[$i]==$nIdFrecuencia) ? 'selected' : '';
          echo '<option value="'.$SELECTnIdFrecuencia[$i].'" '.$seleccionado.'>'.$SELECTnNumeroFrecuencia[$i].'</option>';
        }
      ?>
    </select>
  </div>
  <div class="form-group">
    <label for="frecuencia">Dia de Visita:</label>
    <select class="form-control" id="diavisita" disabled>
      <option value="0" <?php echo ($cDiaVisita == NULL) ? 'selected' : '';?>>Seleccione una Opción</option>
			<option value="L" <?php echo ($cDiaVisita == 'L') ? 'selected' : '';?>>Lunes</option>
      <option value="M" <?php echo ($cDiaVisita == 'M') ? 'selected' : '';?>>Martes</option>
			<option value="X" <?php echo ($cDiaVisita == 'X') ? 'selected' : '';?>>Miercoles</option>
			<option value="J" <?php echo ($cDiaVisita == 'J') ? 'selected' : '';?>>Jueves</option>
			<option value="V" <?php echo ($cDiaVisita == 'V') ? 'selected' : '';?>>Viernes</option>
			<option value="S" <?php echo ($cDiaVisita == 'S') ? 'selected' : '';?>>Sabado</option>
			<option value="D" <?php echo ($cDiaVisita == 'D') ? 'selected' : '';?>>Domingo</option>
    </select>
  </div>
  <div class="form-group">
    <label for="rif">RIF:</label>
    <input type="text" autocomplete="off" class="form-control" id="rif" value="<?php echo $sRifCliente;?>" disabled maxlength="10" style="text-transform:uppercase;">
  </div>
  <div class="form-group">
    <label for="nombre">Nombre:</label>
    <input type="text" autocomplete="off" class="form-control" id="nombre" value="<?php echo $sNombreCliente;?>" disabled maxlength="255" style="text-transform:uppercase;">
  </div>
  <center>
    <div class="form-group botonesformulario">
      <button type="button" class="btn btn-default" id="editarclienteactual"><span class="glyphicon glyphicon-pencil"></span>&nbsp;Editar</button>
      <button type="button" class="btn btn-default" id="eliminarclienteactual"><span class="glyphicon glyphicon-floppy-remove"></span>&nbsp;Eliminar</button>
      <button type="button" class="btn btn-default" id="cerrarvercliente" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span>&nbsp;Cancelar</button>
    </div>
  </center>
  <!--<input type="hidden" class="form-control" id="longitud" value="<?php //echo $nLngCliente;?>" readonly>
  <input type="hidden" class="form-control" id="latitud" value="<?php //echo $nLatCliente;?>" readonly>-->
</form>