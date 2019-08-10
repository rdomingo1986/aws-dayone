<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Prueba_model extends CI_Model {
	private $variable1;
	public $variable2;
	
	function __construct(){
		parent::__construct();
		$this->variable2 = 3;
	}
	
	public function inicializar($var){
		$this->variable1 = $var;
	}
	
	public function sumar(){
		return $this->variable1 + $this->variable2;
	}
	
}
?>