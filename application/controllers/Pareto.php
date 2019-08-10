<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pareto extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Pareto_model', 'pareto_model');
		$this->load->helper('url');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function ModuloPareto(){
		$this->load->view("modalnuevopareto_view");
	}
	
	public function BuscadorPareto(){
		$resultado = $this->pareto_model->Listar();
		foreach($resultado->result() as $registros){
			$paretos['nIdPareto'][] = $registros->nIdPareto;
			$paretos['sNombrePareto'][] = $registros->sNombrePareto;
		}
		$this->load->view("modallistarpareto_view",$paretos);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function ObtenerParetos(){
		header("Content-type: text/javascript");
		$resultado = $this->pareto_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$paretos[$i]["nIdPareto"]=$registros->nIdPareto;
			$paretos[$i]["sNombrePareto"]=$registros->sNombrePareto;
			$i++;
		}
		echo json_encode($paretos);
	}
	
	public function RegistrarPareto(){
		header("Content-type: text/javascript");
		$resultado = $this->pareto_model->ValidarExiste(null,$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->pareto_model->Registrar($_POST['nombre']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EditarPareto(){
		header("Content-type: text/javascript");
		$resultado = $this->pareto_model->ValidarExiste($_POST['id'],$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->pareto_model->Modificar($_POST['id'],$_POST['nombre']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EliminarPareto(){
		header("Content-type: text/javascript");
		echo json_encode($this->pareto_model->Eliminar($_POST['id']));
	}
}
?>
