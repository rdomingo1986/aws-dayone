<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pareto_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_pareto');
		$this->db->order_by('sNombrePareto', 'ASC');
		return $this->db->get();
	}
	
	function ValidarExiste($id,$nombre) {
		if($id == null){
			$this->db->from('t_pareto');
			$this->db->like('UPPER(sNombrePareto)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_pareto');
			$this->db->where('nIdPareto !=', $id);
			$this->db->like('UPPER(sNombrePareto)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function Registrar($nombre) {
		$datos = array(
			'sNombrePareto' => strtoupper($nombre)
		);
		if($this->db->insert('t_pareto', $datos)){
			return $this->db->insert_id();
		}
		else{
			return false;
		}
	}
	
	function Modificar($id,$nombre){
		$datos = array(
			'sNombrePareto' => strtoupper($nombre)
		);
		$this->db->where('nIdPareto', $id);
		return $this->db->update('t_pareto', $datos);
	}
	
	function ValidarRelacion($id){
		$this->db->from('t_cliente');
		$this->db->where('nIdPareto',$id);
		return $this->db->get();
	}
	
	function Eliminar($id){
		$resultado = $this->ValidarRelacion($id);
		if($resultado->num_rows() == 0){
			$this->db->where('nIdPareto', $id);
			return $this->db->delete('t_pareto');
		}else{
			return false;
		}
	}
}
?>
