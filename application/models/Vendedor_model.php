<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Vendedor_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_vendedor');
		$this->db->order_by('sNombreVendedor', 'ASC');
		return $this->db->get();
	}
	
	function ValidarExisteNombre($id,$nombre) {
		if($id == null){
			$this->db->from('t_vendedor');
			$this->db->like('UPPER(sNombreVendedor)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_vendedor');
			$this->db->where('nIdVendedor !=', $id);
			$this->db->like('UPPER(sNombreVendedor)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function ValidarExisteColor($id,$color) {
		if($id == null){
			$this->db->from('t_vendedor');
			$this->db->like('sColorVendedor', $color);
			return $this->db->get();
		}else{
			$this->db->from('t_vendedor');
			$this->db->where('nIdVendedor !=', $id);
			$this->db->like('sColorVendedor', $color);
			return $this->db->get();
		}
	}
	
	function Consultar($id) {
		$this->db->from('t_vendedor');
		$this->db->where('nIdVendedor', $id);
		return $this->db->get();
	}
	
	function Registrar($nombre,$color) {
		$datos = array(
			'sNombreVendedor' => strtoupper($nombre),
			'sColorVendedor' => $color
		);
		if($this->db->insert('t_vendedor', $datos)){
			return $this->db->insert_id();
		}
		else{
			return false;
		}
	}
	
	function Modificar($id,$nombre,$color){
		$datos = array(
			'sNombreVendedor' => strtoupper($nombre),
			'sColorVendedor' => $color
		);
		$this->db->where('nIdVendedor', $id);
		return $this->db->update('t_vendedor', $datos);
	}
	
	function ValidarRelacion($id){
		$this->db->from('t_cliente');
		$this->db->where('nIdVendedor',$id);
		return $this->db->get();
	}
	
	function Eliminar($id){
		$resultado = $this->ValidarRelacion($id);
		if($resultado->num_rows() == 0){
			$this->db->where('nIdVendedor', $id);
			return $this->db->delete('t_vendedor');
		}else{
			return false;
		}
	}
}
?>