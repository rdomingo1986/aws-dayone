<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tipocliente_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_tipocliente');
		$this->db->order_by('sNombreTipoCliente', 'ASC');
		return $this->db->get();
	}	
	
	function ValidarExiste($id,$nombre) {
		if($id == null){
			$this->db->from('t_tipocliente');
			$this->db->like('UPPER(sNombreTipoCliente)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_tipocliente');
			$this->db->where('nIdTipoCliente !=', $id);
			$this->db->like('UPPER(sNombreTipoCliente)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function Registrar($nombre) {
		$datos = array(
			'sNombreTipoCliente' => strtoupper($nombre)
		);
		if($this->db->insert('t_tipocliente', $datos)){
			return $this->db->insert_id();
		}
		else{
			return false;
		}
	}
	
	function Modificar($id,$nombre){
		$datos = array(
			'sNombreTipoCliente' => strtoupper($nombre)
		);
		$this->db->where('nIdTipoCliente', $id);
		return $this->db->update('t_tipocliente', $datos);
	}
	
	function ValidarRelacion($id){
		$this->db->from('t_cliente');
		$this->db->where('nIdTipoCliente',$id);
		return $this->db->get();
	}
	
	function Eliminar($id){
		$resultado = $this->ValidarRelacion($id);
		if($resultado->num_rows() == 0){
			$this->db->where('nIdTipoCliente', $id);
			return $this->db->delete('t_tipocliente');
		}else{
			return false;
		}
	}
}
?>
