<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Capa_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_capa');
		$this->db->order_by('nIdCapa', 'ASC');
		return $this->db->get();
	}
	
	function ValidarExisteNombre($id,$nombre) {
		if($id == null){
			$this->db->from('t_capa');
			$this->db->where('UPPER(sNombreCapa)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_capa');
			$this->db->where('nIdCapa !=', $id);
			$this->db->where('UPPER(sNombreCapa)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function ValidarExisteColor($parametros) {
		if(!isset($parametros['id'])){
			$this->db->from('t_capa');
			$this->db->where('nIdGrupocapa', $parametros['grupocapa']);
			$this->db->where('sColorCapa', $parametros['color']);
			return $this->db->get();
		}else{
			$this->db->from('t_capa');
			$this->db->where('nIdCapa !=', $parametros['id']);
			$this->db->where('nIdGrupocapa', $parametros['grupocapa']);
			$this->db->where('sColorCapa', $parametros['color']);
			return $this->db->get();
		}
	}
	
	function Consultar($id) {
		$this->db->from('t_capa');
		$this->db->where('nIdCapa', $id);
		return $this->db->get();
	}
	
	function Registrar($parametros) {
		$datos = array(
			'nIdGrupocapa' => $parametros['grupocapa'],
			'nIdSubgrupocapa' => (strlen(trim($parametros['subgrupocapa'])) == 0) ? 0 : $parametros['subgrupocapa'],
			'sNombreCapa' => strtoupper($parametros['nombre']),
			'sColorCapa' => $parametros['color'],
			'sJsonCapa' => $parametros['json']
		);
		$this->db->set('bPoligonoCapa','GeomFromText(\''.$parametros['cadenaPoligono'].'\')',false);
		if($this->db->insert('t_capa', $datos)){
			return $this->Consultar($this->db->insert_id());
		}
		else{
			return false;
		}
	}
	
	function Modificar($parametros){
		$datos = array(
			'sNombreCapa' => strtoupper($parametros['nombre']),
			'sColorCapa' => $parametros['color'],
			'nIdGrupocapa' => $parametros['grupocapa'],
			'nIdSubgrupocapa' => (strlen(trim($parametros['subgrupocapa'])) == 0) ? 0 : $parametros['subgrupocapa']
		);
		$this->db->where('nIdCapa', $parametros['id']);
		if($this->db->update('t_capa', $datos)){
			return $this->Consultar($parametros['id']);
		}
		else{
			return false;
		}
	}

	function Eliminar($id) {
		$this->db->where('nIdCapa', $id);
		return $this->db->delete('t_capa'); 
	}

	function ObtenerCapasContenidas($id){
		return $this->db->query('SELECT 	t_cliente.nIdCliente, 
			t_capa.nIdGrupocapa, 
			t_capa.nIdSubgrupocapa,
			t_capa.sNombreCapa 
			FROM t_capa, t_cliente 
			WHERE ST_CONTAINS(t_capa.bPoligonoCapa,t_cliente.bPuntoCliente) 
				AND t_cliente.nIdCliente='.$id.' 
			ORDER BY t_capa.nIdGrupocapa ASC');
	}
}
?>