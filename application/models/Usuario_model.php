<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Usuario_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_usuario');
		$this->db->order_by('sLoginUsuario', 'ASC');
		return $this->db->get();
	}
	
	function ValidarExiste($id,$nombre) {
		if($id == null){
			$this->db->from('t_usuario');
			$this->db->like('UPPER(sLoginUsuario)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_usuario');
			$this->db->where('nIdUsuario !=', $id);
			$this->db->like('UPPER(sLoginUsuario)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function Registrar($nombre,$perfil) {
		$datos = array(
			'sLoginUsuario' => strtoupper($nombre),
			'sContrasenaUsuario' => md5(strtolower($nombre)),
			'nPerfilUsuario' => $perfil,
		);
		if($this->db->insert('t_usuario', $datos)){
			return $this->db->insert_id();
		}
		else{
			return false;
		}
	}
	
	function Modificar($id,$nombre,$perfil){
		$datos = array(
			'sLoginUsuario' => strtoupper($nombre),
			'nPerfilUsuario' => $perfil,
		);
		$this->db->where('nIdUsuario', $id);
		return $this->db->update('t_usuario', $datos);
	}
	
	function Eliminar($id){
		$this->db->where('nIdUsuario', $id);
		return $this->db->delete('t_usuario');
	}
	
	function ValidarClaveActual($id,$actual){
		$this->db->from('t_usuario');
		$this->db->like('sContrasenaUsuario',md5($actual));
		$this->db->where('nIdUsuario',$id);
		return $this->db->get();
	}
	
	function CambiarClave($id,$nueva){
		$datos = array(
			'sContrasenaUsuario' => md5($nueva),
		);
		$this->db->where('nIdUsuario',$id);
		return $this->db->update('t_usuario',$datos);
	}
}
?>
