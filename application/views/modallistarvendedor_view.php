<form role="form" id="listarvendedorform" class="contenidomodalview">
  <div class="form-group">
		<select class="form-control" id="registrosvendedor">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdVendedor);$i++){
					echo '<option value="'.$nIdVendedor[$i].'" data-codigocolor="'.$sColorVendedor[$i].'">'.$sNombreVendedor[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistrovendedor"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>