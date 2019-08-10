<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Usuario extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Usuario_model', 'usuario_model');
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
	public function ModuloUsuario(){
		$this->load->view("modalnuevousuario_view");
	}
	
	public function BuscadorUsuario(){
		$resultado = $this->usuario_model->Listar();
		foreach($resultado->result() as $registros){
			$usuarios['nIdUsuario'][] = $registros->nIdUsuario;
			$usuarios['sLoginUsuario'][] = $registros->sLoginUsuario;
			$usuarios['nPerfilUsuario'][] = $registros->nPerfilUsuario;
		}
		$this->load->view("modallistarusuario_view",$usuarios);
	}
	
	public function ModuloContrasena(){
		$this->load->view("modalcambiocontrasena_view");
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function ObtenerUsuarios(){
		header("Content-type: text/javascript");
		$resultado = $this->usuario_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$usuarios[$i]["nIdUsuario"]=$registros->nIdUsuario;
			$usuarios[$i]["sLoginUsuario"]=$registros->sLoginUsuario;
			$usuarios[$i]["nPerfilUsuario"]=$registros->nPerfilUsuario;
			$i++;
		}
		echo json_encode($usuarios);
	}
	
	public function RegistrarUsuario(){
		header("Content-type: text/javascript");
		$resultado = $this->usuario_model->ValidarExiste(null,$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->usuario_model->Registrar($_POST['nombre'],$_POST['perfil']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EditarUsuario(){
		header("Content-type: text/javascript");
		$resultado = $this->usuario_model->ValidarExiste($_POST['id'],$_POST['nombre']);
		if($resultado->num_rows()==0){
			echo json_encode($this->usuario_model->Modificar($_POST['id'],$_POST['nombre'],$_POST['perfil']));
		}else{
			echo json_encode(false);	
		}
	}
	
	public function EliminarUsuario(){
		header("Content-type: text/javascript");
		echo json_encode($this->usuario_model->Eliminar($_POST['id']));
	}
	
	public function CambiarContrasena(){
		header("Content-type: text/javascript");
		$resultado = $this->usuario_model->ValidarClaveActual($this->session->userdata('nIdUsuario'),$_POST['actual']);
		if($resultado->num_rows()==0){
			echo json_encode(false);
		}else{
			echo json_encode($this->usuario_model->CambiarClave($this->session->userdata('nIdUsuario'),$_POST['nueva']));
		}
	}
}
?>
