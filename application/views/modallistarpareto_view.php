<form role="form" id="listarparetoform" class="contenidomodalview">
  <div class="form-group">
		<select class="form-control" id="registrospareto">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdPareto);$i++){
					echo '<option value="'.$nIdPareto[$i].'">'.$sNombrePareto[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistropareto"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>