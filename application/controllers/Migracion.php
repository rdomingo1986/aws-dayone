<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Migracion extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Cliente_model', 'cliente_model');
		$this->load->helper('url');
		$this->load->library('session');
		//$this->load->library('encrypt');
	}
	
	public function clientes(){
		$this->db->select('nIdCliente, nLatCliente, nLngCliente');
		$this->db->from('t_cliente');
		$this->db->order_by('nIdCliente','ASC');
		$resultado = $this->db->get();
		foreach($resultado->result() as $registros){
			$this->db->set('bPuntoCliente','GeomFromText(\'POINT('.$registros->nLatCliente.' '.$registros->nLngCliente.')\')',false);
			$this->db->where('nIdCliente',$registros->nIdCliente);
			$this->db->update('t_cliente');
		}
	}

	public function capas(){
		$this->db->select('nIdCapa, sJsonCapa');
		$this->db->from('t_capa');
		$this->db->order_by('nIdCapa','ASC');
		$resultado = $this->db->get();
		foreach($resultado->result() as $registros){
			$array = array();
			$array = json_decode($registros->sJsonCapa);
			$cadenaPoligono = 'POLYGON((';
			for($i = 0; $i < count($array); $i++){
				$cadenaPoligono .= $array[$i]->lat .' '. $array[$i]->lng .',';
			}
			$cadenaPoligono .= $array[0]->lat .' '. $array[0]->lng .'))';
			$this->db->set('bPoligonoCapa','GeomFromText(\''.$cadenaPoligono.'\')',false);
			$this->db->where('nIdCapa',$registros->nIdCapa);
			$this->db->update('t_capa');
			unset($cadenaPoligono);
		}
	}
}
?>