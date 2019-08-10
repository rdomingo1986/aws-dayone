<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vendedor extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Vendedor_model', 'vendedor_model');
		$this->load->helper('url');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function ModuloVendedor(){
		$this->load->view("modalnuevovendedor_view");
	}
	
	public function BuscadorVendedor(){
		$resultado = $this->vendedor_model->Listar();
		foreach($resultado->result() as $registros){
			$vendedores['nIdVendedor'][] = $registros->nIdVendedor;
			$vendedores['sNombreVendedor'][] = $registros->sNombreVendedor;
			$vendedores['sColorVendedor'][] = $registros->sColorVendedor;
		}
		$this->load->view("modallistarvendedor_view",$vendedores);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function ObtenerVendedores(){
		header("Content-type: text/javascript");
		$resultado = $this->vendedor_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$vendedores[$i]["nIdVendedor"]=$registros->nIdVendedor;
			$vendedores[$i]["sNombreVendedor"]=$registros->sNombreVendedor;
			$vendedores[$i]['sColorVendedor'][] = $registros->sColorVendedor;
			$i++;
		}
		echo json_encode($vendedores);
	}
	
	public function RegistrarVendedor(){
		header("Content-type: text/javascript");
		$resultado = $this->vendedor_model->ValidarExisteNombre(null,$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->vendedor_model->ValidarExisteColor(null,$_POST['color']);
		$validar['ExisteColor'] = $resultado->num_rows();
		if($validar['ExisteNombre'] == 0 && $validar['ExisteColor'] == 0){
			echo json_encode($this->vendedor_model->Registrar($_POST['nombre'],$_POST['color']));
		}else{
			echo json_encode($validar);
		}
	}
	
	public function EditarVendedor(){
		header("Content-type: text/javascript");
		$resultado = $this->vendedor_model->ValidarExisteNombre($_POST['id'],$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->vendedor_model->ValidarExisteColor($_POST['id'],$_POST['color']);
		$validar['ExisteColor'] = $resultado->num_rows();
		if($validar['ExisteNombre'] == 0 && $validar['ExisteColor'] == 0){
			echo json_encode($this->vendedor_model->Modificar($_POST['id'],$_POST['nombre'],$_POST['color']));
		}else{
			echo json_encode($validar);
		}
	}
	
	public function EliminarVendedor(){
		header("Content-type: text/javascript");
		echo json_encode($this->vendedor_model->Eliminar($_POST['id']));
	}
}
?>