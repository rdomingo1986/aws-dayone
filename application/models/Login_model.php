<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function ValidarUsuarioClave($usuario,$clave) {
		$this->db->from('t_usuario');
		$this->db->like('UPPER(sLoginUsuario)', strtoupper($usuario));
		$this->db->like('sContrasenaUsuario', md5($clave));
		return $this->db->get();
	}
	
	function ConsultarDatosUsuario($id) {
		$this->db->from('t_usuario');
		$this->db->where('nIdUsuario', $id);
		return $this->db->get();
	}
}
?>