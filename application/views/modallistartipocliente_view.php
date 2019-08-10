<form role="form" id="listartipoclienteform" class="contenidomodalview">
	<div class="form-group">
		<select class="form-control" id="registrostipocliente">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdTipoCliente);$i++){
					echo '<option value="'.$nIdTipoCliente[$i].'">'.$sNombreTipoCliente[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistrotipocliente"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>
