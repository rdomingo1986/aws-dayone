<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Frecuencia_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_frecuencia');
		$this->db->order_by('nNumeroFrecuencia', 'ASC');
		return $this->db->get();
	}
}
?>
