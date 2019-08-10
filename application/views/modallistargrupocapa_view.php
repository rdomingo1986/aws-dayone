<form role="form" id="listargrupocapaform" class="contenidomodalview">
  <div class="form-group">
		<select class="form-control" id="registrogrupocapa">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdGrupocapa);$i++){
					echo '<option value="'.$nIdGrupocapa[$i].'" data-id-padre="'.$nPadreGrupocapa[$i].'">'.$sNombreGrupocapa[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistrogrupocapa"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>