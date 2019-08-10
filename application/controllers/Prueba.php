<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Prueba extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Prueba_model', 'prueba_model');
	}
	
	public function index() {
		$objeto = new $this->prueba_model();
		$objeto->inicializar(5);
		echo $objeto->sumar().'<br />';
		//$objeto->variable1 = 4;
	}
}
?>