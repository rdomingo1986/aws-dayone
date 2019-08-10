<form role="form" id="listarcapaform" class="contenidomodalview">
  <div class="form-group">
		<select class="form-control" id="registroscapa">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdCapa);$i++){
					echo '<option value="'.$nIdCapa[$i].'" data-codigocolor="'.$sColorCapa[$i].'">'.$sNombreCapa[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistrocapa"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>