<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tipocliente extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Tipocliente_model', 'tipocliente_model');
		$this->load->helper('url');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function ModuloTipoCliente(){
		$this->load->view("modalnuevotipocliente_view");
	}
	
	public function BuscadorTipoCliente(){
		$resultado = $this->tipocliente_model->Listar();
		foreach($resultado->result() as $registros){
			$tipoclientes['nIdTipoCliente'][] = $registros->nIdTipoCliente;
			$tipoclientes['sNombreTipoCliente'][] = $registros->sNombreTipoCliente;
		}
		$this->load->view("modallistartipocliente_view",$tipoclientes);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function ObtenerTipoClientes(){
		header("Content-type: text/javascript");
		$resultado = $this->tipocliente_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$tipoclientes[$i]["nIdTipoCliente"]=$registros->nIdTipoCliente;
			$tipoclientes[$i]["sNombreTipoCliente"]=$registros->sNombreTipoCliente;
			$i++;
		}
		echo json_encode($tipoclientes);
	}
	
	public function RegistrarTipoCliente(){
		header("Content-type: text/javascript");
		$resultado = $this->tipocliente_model->ValidarExiste(null,$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->tipocliente_model->Registrar($_POST['nombre']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EditarTipoCliente(){
		header("Content-type: text/javascript");
		$resultado = $this->tipocliente_model->ValidarExiste($_POST['id'],$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->tipocliente_model->Modificar($_POST['id'],$_POST['nombre']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EliminarTipoCliente(){
		header("Content-type: text/javascript");
		echo json_encode($this->tipocliente_model->Eliminar($_POST['id']));
	}
}
?>
