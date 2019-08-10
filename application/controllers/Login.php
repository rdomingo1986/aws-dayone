<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Login_model', 'login_model');
		$this->load->helper('url');
		$this->load->library('session');
		//$this->load->library('encrypt');
	}
	
	public function index() {
		if($this->session->userdata('nIdUsuario')==true){
			redirect(base_url()."Mapa/", "refresh");		
		}
		$this->load->view('login_view');
	}
	
	public function ValidarLogin(){
		header("Content-type: text/javascript");
		$resultado = $this->login_model->ValidarUsuarioClave($_POST['usuario'],$_POST['clave']);
		if($resultado->num_rows()===1){
			$registro = $resultado->row();
			$datosusuario['nIdUsuario'] = $registro->nIdUsuario;
			$datosusuario['nPerfilUsuario'] = $registro->nPerfilUsuario;
			$this->session->set_userdata($datosusuario);
		}
		echo json_encode($resultado->num_rows());
	}
	
	public function salir(){
		$this->session->sess_destroy();
		redirect(base_url(), "refresh");
	}
	/*public function ObtenerParetos(){
		header("Content-type: text/javascript");
		$resultado = $this->pareto_model->ListadoParetoActivo();
		$i=0;
		foreach($resultado->result() as $registros){
			$pareto[$i]['nIdPareto'] = $registros->nIdPareto;
			$pareto[$i]['sNombrePareto'] = $registros->sNombrePareto;
			$i++;
		}
		echo json_encode($pareto);
	}
	
	public function FormularioNuevoPareto(){
		$this->load->view("modalnuevopareto_view");
	}
	
	public function RegistrarParetos(){
		header("Content-type: text/javascript");
		$resultado = $this->pareto_model->RegistrarNuevoPareto($_POST['nombre']);
		if($resultado===false){
			echo json_encode('ERROR');	
		}else{
			echo json_encode($resultado);
		}
	}*/
}
?>
