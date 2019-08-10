<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Grupocapa extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Grupocapa_model', 'grupocapa_model');
		$this->load->helper('url');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function ModuloGrupoCapa(){
		$this->load->view("modalnuevogrupocapa_view");
	}
	
	public function BuscadorGrupoCapa(){
		$resultado = $this->grupocapa_model->Listar();
		foreach($resultado->result() as $registros){
			$grupocapa['nIdGrupocapa'][] = $registros->nIdGrupocapa;
			$grupocapa['sNombreGrupocapa'][] = $registros->sNombreGrupocapa;
			$grupocapa['nPadreGrupocapa'][] = $registros->nPadreGrupocapa;
		}
		$this->load->view("modallistargrupocapa_view",$grupocapa);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function ObtenerGrupoCapas(){
		header("Content-type: text/javascript");
		if(isset($_POST['nivelgrupocapa'])){
			$resultado = $this->grupocapa_model->Listar($_POST);
		}else{
			$resultado = $this->grupocapa_model->Listar();
		}
		$i=0;
		foreach($resultado->result() as $registros){
			$grupocapa[$i]["nIdGrupocapa"]=$registros->nIdGrupocapa;
			$grupocapa[$i]["sNombreGrupocapa"]=$registros->sNombreGrupocapa;
			$grupocapa[$i]['nPadreGrupocapa'] = $registros->nPadreGrupocapa;
			$i++;
		}
		echo json_encode($grupocapa);
	}
	
	public function RegistrarGrupoCapa(){
		header("Content-type: text/javascript");
		$resultado = $this->grupocapa_model->ValidarExiste(null,$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->grupocapa_model->Registrar($_POST));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EditarGrupoCapa(){
		header("Content-type: text/javascript");
		$resultado = $this->grupocapa_model->ValidarExiste($_POST['id'],$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->grupocapa_model->Modificar($_POST));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EliminarGrupoCapa(){
		header("Content-type: text/javascript");
		echo json_encode($this->grupocapa_model->Eliminar($_POST['id']));
	}
}
?>
