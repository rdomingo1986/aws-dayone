<form role="form" id="listarusuarioform" class="contenidomodalview">
  <div class="form-group">
		<select class="form-control" id="registrosusuario">
			<option value="0">Seleccione un Registro</option>
			<?php
				for($i=0;$i<count($nIdUsuario);$i++){
					echo '<option value="'.$nIdUsuario[$i].'" data-perfilusuario="'.$nPerfilUsuario[$i].'">'.$sLoginUsuario[$i].'</option>';
				}
			?>
		</select>
	</div>
	<div class="form-group">
		<button type="button" class="btn btn-default" id="abrirregistrousuario"><span class="glyphicon glyphicon-folder-open"></span>&nbsp;Abrir</button>
	</div>
</form>