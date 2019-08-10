<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Grupocapa_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar($parametros = false) {
		if($parametros == false){
			$this->db->from('t_grupocapa');
			$this->db->order_by('sNombreGrupocapa', 'ASC');
			return $this->db->get();
		}else{
			if(isset($parametros['idselected'])){
				if($parametros['nivelgrupocapa'] == 'padres'){
					$this->db->from('t_grupocapa');
					$this->db->where('nPadreGrupocapa',0);
					$this->db->where('nIdGrupocapa !=',$parametros['idselected']);
					$this->db->order_by('sNombreGrupocapa','ASC');
					return $this->db->get();
				}else{
					/*$this->db->from('t_grupocapa');
					$this->db->where('nPadreGrupocapa',0);
					$this->db->order_by('sNombreGrupocapa','ASC');
					return $this->db->get();*/
				}
			}else{
				if($parametros['nivelgrupocapa'] == 'padres'){
					$this->db->from('t_grupocapa');
					$this->db->where('nPadreGrupocapa',0);
					$this->db->order_by('sNombreGrupocapa','ASC');
					return $this->db->get();
				}elseif($parametros['nivelgrupocapa'] == 'hijos'){
					$this->db->from('t_grupocapa');
					$this->db->where('nPadreGrupocapa',$parametros['idgrupocapa']);
					$this->db->order_by('sNombreGrupocapa','ASC');
					return $this->db->get();
				}else{
					$this->db->from('t_grupocapa');
					$this->db->where('nPadreGrupocapa',$parametros['idgrupocapa']);
					$this->db->order_by('sNombreGrupocapa','ASC');
					return $this->db->get();
				}
			}
		}
		
	}

	function ListarPadres(){
		$this->db->from('t_grupocapa');
		$this->db->where('nPadreGrupocapa',0);
		$this->db->order_by('nIdGrupocapa','ASC');
		return $this->db->get();
	}
	
	function ContarHijos($id){
		$this->db->select('nIdGrupocapa');
		$this->db->from('t_grupocapa');
		$this->db->where('nPadreGrupocapa',$id);
		return $this->db->get()->num_rows();
	}

	function ContarPadres(){
		$this->db->from('t_grupocapa');
		$this->db->where('nPadreGrupocapa',0);
		return $this->db->get()->num_rows();
	}

	function ValidarExiste($id,$nombre) {
		if($id == null){
			$this->db->from('t_grupocapa');
			$this->db->where('UPPER(sNombreGrupocapa)', strtoupper($nombre));
			return $this->db->get();
		}else{
			$this->db->from('t_grupocapa');
			$this->db->where('nIdGrupocapa !=', $id);
			$this->db->where('UPPER(sNombreGrupocapa)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function ValidarHijosGrupoCapa($id){
		$this->db->select('nIdGrupocapa');
		$this->db->from('t_grupocapa');
		$this->db->where('nPadreGrupocapa',$id);
		return ($this->db->get()->num_rows()==0) ? true : false;
	}
	
	function Registrar($parametros) {
		$datos = array(
			'sNombreGrupocapa' => strtoupper($parametros['nombre']),
			'nPadreGrupocapa' => ($parametros['nivelgrupocapa']=='1') ? 0 : $parametros['grupocapapadre'],
		);
		if($this->db->insert('t_grupocapa', $datos)){
			return $this->db->insert_id();
		}
		else{
			return false;
		}
	}
	
	//validar que si un grupo nivel 1 tiene hijos no pueda convertirse en nivel 2
	function Modificar($parametros){
		$modificar = true;
		if($parametros['nivelgrupocapa']=='2'){
			$modificar = $this->ValidarHijosGrupoCapa($parametros['id']);
		}
		if($modificar){
			$datos = array(
				'sNombreGrupocapa' => strtoupper($parametros['nombre']),
				'nPadreGrupocapa' => ($parametros['nivelgrupocapa']=='1') ? 0 : $parametros['grupocapapadre'],
			);
			$this->db->where('nIdGrupocapa', $parametros['id']);
			return $this->db->update('t_grupocapa', $datos);
		}else{
			return 'KO';
		}
	}
	
	function Consultar($id) {
		$this->db->from('t_grupocapa');
		$this->db->where('nIdGrupocapa', $id);
		return $this->db->get();
	}

	function ConsultarNombre($id) {
		if($id != 0){
			$this->db->select('sNombreGrupocapa');
			$this->db->from('t_grupocapa');
			$this->db->where('nIdGrupocapa', $id);
			return $this->db->get()->row()->sNombreGrupocapa;	
		}else{
			return '- - -';
		}
		
	}

	function ValidarRelacion($id){
		$this->db->from('t_capa');
		$this->db->where('nIdGrupocapa',$id);
		return $this->db->get();
	}
	
	function Eliminar($id){
		$resultado = $this->ValidarRelacion($id);
		if($resultado->num_rows() == 0){
			$this->db->where('nIdGrupocapa', $id);
			return $this->db->delete('t_grupocapa');
		}else{
			return false;
		}
	}
}
?>
