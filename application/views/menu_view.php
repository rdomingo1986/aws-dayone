<section class="container-fluid" style="padding:0;">
	<nav class="navbar navbar-default" style="z-index:1000">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span> 
				</button>
				<a class="navbar-brand" href="#"><span class="glyphicon glyphicon-globe"></span></a>
			</div>
			<div class="collapse navbar-collapse" id="myNavbar">
				<ul class="nav navbar-nav">
					<?php
						if($this->session->userdata('nPerfilUsuario')==1)
						{
					?>
							<li class="dropdown">
								<a class="dropdown-toggle" data-toggle="dropdown" href="#">Administrar Sistema
								<span class="caret"></span></a>
								<ul class="dropdown-menu">
									<li id="nuevotipocliente"><a href="#">Tipo Cliente</a></li>
									<li id="nuevovendedor"><a href="#">Vendedor</a></li>
									<li id="nuevopareto"><a href="#">Pareto</a></li>
									<li id="nuevogrupocapa"><a href="#">Grupo Capas</a></li>
									<li id="nuevousuario"><a href="#">Usuario</a></li>
									<li><a href="<?php echo base_url('Cliente/exportarClientes/');?>" target="_blank">Exportar a Excel</a></li>
									<li><a href="<?php echo base_url('Mapa/respaldo/');?>" target="_blank">Respaldar BD</a></li>
								</ul>
							</li>
					<?php
						}
					?>
					<li class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Filtrar por cliente
						<span class="caret"></span></a>
						<ul class="dropdown-menu" id="ulfiltroclientes">
							<li><a href="#"><input type="checkbox" class="filtro todosfiltrocliente" value="0" checked="checked" />TODOS</a></li>
						<?php 
							for($i=0;$i<count($nIdTipoCliente);$i++){
								echo '<li>';
								echo '<a href="#"><input type="checkbox" class="filtro filtrocliente" value="'.$nIdTipoCliente[$i].'" checked="checked" />'.$sNombreTipoCliente[$i].'</a>';
								echo '</li>';
							}
						?>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Filtrar por vendedor
						<span class="caret"></span></a>
						<ul class="dropdown-menu" id="ulfiltrovendedores">
							<li><a href="#"><input type="checkbox" class="filtro todosfiltrovendedor" value="0" checked="checked" />TODOS</a></li>
						<?php 
							for($i=0;$i<count($nIdVendedor);$i++){
								echo '<li>';
								echo '<a href="#"><input type="checkbox" class="filtro filtrovendedor" value="'.$nIdVendedor[$i].'" checked="checked" /> '.$sNombreVendedor[$i].'</a>';
								echo '</li>';
							}
						?>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Filtrar por pareto
						<span class="caret"></span></a>
						<ul class="dropdown-menu" id="ulfiltroparetos">
							<li><a href="#"><input type="checkbox" class="filtro todosfiltropareto" value="0" checked="checked" />TODOS</a></li>
						<?php 
							for($i=0;$i<count($nIdPareto);$i++){
								echo '<li>';
								echo '<a href="#"><input type="checkbox" class="filtro filtropareto" value="'.$nIdPareto[$i].'" checked="checked" /> '.$sNombrePareto[$i].'</a>';
								echo '</li>';
							}
						?>
						</ul>
					</li>
					<li class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Filtrar por frecuencia
						<span class="caret"></span></a>
						<ul class="dropdown-menu" id="ulfiltrofrecuencia">
							<li><a href="#"><input type="checkbox" class="filtro todosfiltrofrecuencia" value="0" checked="checked" />TODOS</a></li>
						<?php 
							for($i=0;$i<count($nIdFrecuencia);$i++){
								echo '<li>';
								echo '<a href="#"><input type="checkbox" class="filtro filtrofrecuencia" value="'.$nIdFrecuencia[$i].'" checked="checked" /> '.$nNumeroFrecuencia[$i].'</a>';
								echo '</li>';
							}
						?>
						</ul>
					</li>
					<li class="dropdown" id="licapas">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Capas
						<span class="caret"></span></a>
						<ul class="dropdown-menu" id="ulcapas">
							<!--<li><a href="#"><input type="checkbox" class="capa todosfiltrofrecuencia" value="0" checked="checked" />TODOS</a></li>-->
						<?php 
							for($i=0;$i<count($nIdGrupocapa);$i++){
								echo '<li>';
								echo '<a href="#"><input type="checkbox" class="capa" value="'.$nIdGrupocapa[$i].'" data-padre-grupocapa="'.$nPadreGrupocapa[$i].'" /> '.$sNombreGrupocapa[$i].'</a>';
								echo '</li>';
							}
						?>
						</ul>
					</li> 
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="glyphicon glyphicon-user"></span> <?php echo $sLoginUsuario;?>
						<span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li id="cambiarcontrasena"><a href="#">Cambiar Contraseña</a></li>
							<li><a href="<?php echo base_url().'Login/salir/';?>">Salir</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>