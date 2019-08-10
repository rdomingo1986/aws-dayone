<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dibujo extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		//$this->load->library('encrypt');
		$this->load->helper('url');
		$this->load->library('session');
	}
	
	public function sesion(){
		if($this->session->userdata('nIdUsuario')==false){
			redirect(base_url(), "refresh");		
		}
	}
	
	public function index() {
		$this->sesion();
		
		$this->load->view('cabecera_view');
		//$this->load->view('menu_view',$datos);
		$this->load->view('dibujo_view');
		$this->load->view('pie_view');
	}
}
?>