<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Capa extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Capa_model', 'capa_model');
		$this->load->model('Grupocapa_model', 'grupocapa_model');
		$this->load->model('Vendedor_model', 'vendedor_model');
		$this->load->model('Cliente_model', 'cliente_model');
		$this->load->model('Frecuencia_model', 'frecuencia_model');
		$this->load->helper('url');
		$this->load->library('session');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function ModuloCapa(){
		$resultado = $this->grupocapa_model->Listar(array('nivelgrupocapa' => 'padres'));
		foreach($resultado->result() as $registros){
			$grupocapas['nIdGrupocapa'][] = $registros->nIdGrupocapa;
			$grupocapas['sNombreGrupocapa'][] = $registros->sNombreGrupocapa;
			$grupocapas['nHijos'][] = $this->grupocapa_model->ContarHijos($registros->nIdGrupocapa);
		}
		$this->load->view("modalnuevacapa_view",$grupocapas);
	}
	
	public function BuscadorCapa(){
		$resultado = $this->capa_model->Listar();
		foreach($resultado->result() as $registros){
			$capas['nIdCapa'][] = $registros->nIdCapa;
			$capas['sNombreCapa'][] = $registros->sNombreCapa;
			$capas['sColorCapa'][] = $registros->sColorCapa;
		}
		$this->load->view("modallistarcapa_view",$capas);
	}
	
	public function FormularioVerCapa(){
		$resultado = $this->grupocapa_model->Listar(array('nivelgrupocapa' => 'padres'));
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdGrupocapa'][] = $registros->nIdGrupocapa;
			$datos['SELECTsNombreGrupocapa'][] = $registros->sNombreGrupocapa;
			$datos['SELECTnHijos'][] = $this->grupocapa_model->ContarHijos($registros->nIdGrupocapa);
		}
		$resultado->free_result();
		unset($registros);

		$resultado = $this->vendedor_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdVendedor'][] = $registros->nIdVendedor;
			$datos['SELECTsNombreVendedor'][] = $registros->sNombreVendedor;
		}
		$resultado->free_result();
		unset($registros);

		$resultado = $this->frecuencia_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdFrecuencia'][] = $registros->nIdFrecuencia;
			$datos['SELECTnNumeroFrecuencia'][] = $registros->nNumeroFrecuencia;
		}
		$resultado->free_result();
		unset($registros);
		
		$resultado = $this->capa_model->Consultar($_POST['id']);
		$registro = $resultado->row();
		$datos['nIdCapa'] = $registro->nIdCapa;
		$datos['nIdGrupocapa'] = $registro->nIdGrupocapa;
		$datos['nIdSubgrupocapa'] = $registro->nIdSubgrupocapa;
		$datos['sNombreCapa'] = $registro->sNombreCapa;
		$datos['sColorCapa'] = $registro->sColorCapa;
		$resultado->free_result();
		
		$resultado = $this->grupocapa_model->Listar(array('nivelgrupocapa' => 'hijos', 'idgrupocapa' => $datos['nIdGrupocapa']));
		foreach($resultado->result() as $registros){
			$datos['SELECTSubnIdGrupocapa'][] = $registros->nIdGrupocapa;
			$datos['SELECTSubsNombreGrupocapa'][] = $registros->sNombreGrupocapa;
		}
		
		$this->load->view('modaldatoscapa_view',$datos);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	
	public function ObtenerCapas(){
		header('Content-type: text/javascript');
		$resultado = $this->capa_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$capa[$i]['nIdCapa'] = $registros->nIdCapa;
			$capa[$i]['nIdGrupocapa'] = $registros->nIdGrupocapa;
			$capa[$i]['nIdSubgrupocapa'] = $registros->nIdSubgrupocapa;
			$capa[$i]['sNombreCapa'] = $registros->sNombreCapa;
			$capa[$i]['sJsonCapa'] = $registros->sJsonCapa;
			$capa[$i]['sColorCapa'] = $registros->sColorCapa;
			$i++;
		}
		echo json_encode($capa);
	}
	
	public function RegistrarCapa(){
		header("Content-type: text/javascript");
		$resultado = $this->capa_model->ValidarExisteNombre(null,$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->capa_model->ValidarExisteColor($_POST);
		$validar['ExisteColor'] = $resultado->num_rows();
		if($validar['ExisteNombre'] == 0 && $validar['ExisteColor'] == 0){
			$resultado=$this->capa_model->Registrar($_POST);
			$registro = $resultado->row();
			$capa['nIdCapa'] = $registro->nIdCapa;
			$capa['nIdGrupocapa'] = $registro->nIdGrupocapa;
			$capa['nIdSubgrupocapa'] = $registro->nIdSubgrupocapa;
			$capa['sNombreCapa'] = $registro->sNombreCapa;
			$capa['sJsonCapa'] = $registro->sJsonCapa;
			$capa['sColorCapa'] = $registro->sColorCapa;
			echo json_encode($capa);
		}else{
			echo json_encode($validar);
		}
	}
	
	public function ModificarCapa(){
		header('Content-type: text/javascript');
		$resultado = $this->capa_model->ValidarExisteNombre($_POST['id'],$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->capa_model->ValidarExisteColor($_POST);
		$validar['ExisteColor'] = $resultado->num_rows();
		if($validar['ExisteNombre'] == 0 && $validar['ExisteColor'] == 0){
			$resultado=$this->capa_model->Modificar($_POST);
			$registro = $resultado->row();
			$capa['nIdCapa'] = $registro->nIdCapa;
			$capa['nIdGrupocapa'] = $registro->nIdGrupocapa;
			$capa['nIdSubgrupocapa'] = $registro->nIdSubgrupocapa;
			$capa['sNombreCapa'] = $registro->sNombreCapa;
			$capa['sJsonCapa'] = $registro->sJsonCapa;
			$capa['sColorCapa'] = $registro->sColorCapa;
			echo json_encode($capa);
		}else{
			echo json_encode($validar);
		}
	}
	
	/*public function ModificarCoordenadasCliente(){
		header('Content-type: text/javascript');
		echo json_encode($this->cliente_model->ModificarLatLng($_POST['id'],$_POST['latitud'],$_POST['longitud']));
	}*/

	public function ModificarClientesContenidosEnCapa(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->ModificacionMasivaClientes($_POST);
		echo json_encode('OK');
	}
	
	public function EliminarCapaSeleccionada(){
		header('Content-type: text/javascript');
		if(!$this->capa_model->Eliminar($_POST['id'])){
			echo json_encode('ERROR');
		}
		else{
			echo json_encode('OK');
		}
	}
	
	//PARA HACER LOS FILTROS POR BASE DE DATOS
	/*public function AplicarFiltroClientes(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->ListadoClienteFiltrado($_POST['tipocliente'],$_POST['vendedor'],$_POST['pareto'],$_POST['frecuencia']);
		$i=0;
		foreach($resultado->result() as $registros){
			$clientes[$i]['nIdCliente'] = $registros->nIdCliente;
			$clientes[$i]['nIdTipoCliente'] = $registros->nIdTipoCliente;
			$clientes[$i]['nIdVendedor'] = $registros->nIdVendedor;
			$resultado2 = $this->vendedor_model->Consultar($registros->nIdVendedor);
			$registros2 = $resultado2->row();
			$clientes[$i]['sColorVendedor'] = $registros2->sColorVendedor;
			$resultado2->free_result();
			$clientes[$i]['nIdPareto'] = $registros->nIdPareto;
			$clientes[$i]['nIdFrecuencia'] = $registros->nIdFrecuencia;
			$clientes[$i]['sRifCliente'] = $registros->sRifCliente;
			$clientes[$i]['sNombreCliente'] = $registros->sNombreCliente;
			$clientes[$i]['nLatCliente'] = $registros->nLatCliente;
			$clientes[$i]['nLngCliente'] = $registros->nLngCliente;
			$i++;
		}
		echo json_encode($clientes);
	}*/
}
?>