<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cliente_model extends CI_Model {
	function __construct(){
		parent::__construct();
	}
	
	function Listar() {
		$this->db->from('t_cliente');
		$this->db->order_by('nIdCliente', 'ASC');
		return $this->db->get();
	}
	
	//
	function Exportar() {
		return $this->db->query('SELECT A.nIdCliente, a.sRifCliente, a.sNombreCliente, a.nLatCliente, a.nLngCliente, b.sNombreTipoCliente, c.sNombreVendedor, d.sNombrePareto, e.nNumeroFrecuencia FROM t_cliente a, t_tipocliente b, t_vendedor c, t_pareto d, t_frecuencia e WHERE a.nIdTipoCliente=b.nIdTipoCliente AND a.nIdVendedor=c.nIdVendedor AND a.nIdPareto=d.nIdPareto AND a.nIdFrecuencia=e.nIdFrecuencia ORDER BY a.nIdCliente');
	}
	//
	
	function ValidarExisteRif($id,$rif) {
		if($id == null){
			$this->db->from('t_cliente');
			$this->db->like('UPPER(sRifCliente)', strtoupper($rif));
			return $this->db->get();	
		}
		else{
			$this->db->from('t_cliente');
			$this->db->where('nIdCliente !=', $id);
			$this->db->like('UPPER(sRifCliente)', strtoupper($rif));
			return $this->db->get();
		}
	}
	
	function ValidarExisteNombre($id,$nombre) {
		if($id == null){
			$this->db->from('t_cliente');
			$this->db->where('UPPER(sNombreCliente)', strtoupper($nombre));
			return $this->db->get();	
		}else{
			$this->db->from('t_cliente');
			$this->db->where('nIdCliente !=', $id);
			$this->db->where('UPPER(sNombreCliente)', strtoupper($nombre));
			return $this->db->get();
		}
	}
	
	function ValidarExisteLatLng($id,$latitud,$longitud){
		if($id == null){
			$this->db->from('t_cliente');
			$this->db->where('nLatCliente', $latitud);
			$this->db->where('nLngCliente', $longitud);
			return $this->db->get();	
		}else{
			$this->db->from('t_cliente');
			$this->db->where('nIdCliente !=', $id);
			$this->db->where('nLatCliente', $latitud);
			$this->db->where('nLngCliente', $longitud);
			return $this->db->get();
		}
	}
	
	function Consultar($id) {
		$this->db->from('t_cliente');
		$this->db->where('nIdCliente', $id);
		return $this->db->get();
	}
	
	function Registrar($parametros) {
		$datos = array(
			'nIdTipoCliente' => $parametros['tipocliente'],
			'nIdVendedor' => $parametros['vendedor'],
			'nIdPareto' => $parametros['pareto'],
			'nIdFrecuencia' => $parametros['frecuencia'],
			'cDiaVisita' => ($parametros['diavisita'] == '0') ? NULL : $parametros['diavisita'],
			'sRifCliente' => strtoupper($parametros['rif']),
			'sNombreCliente' => strtoupper($parametros['nombre']),
			'nLatCliente' => $parametros['latitud'],
			'nLngCliente' => $parametros['longitud']
		);
		$this->db->set('bPuntoCliente','GeomFromText(\''.$parametros['cadenaPunto'].'\')',false);
		if($this->db->insert('t_cliente', $datos)){
			return $this->Consultar($this->db->insert_id());
		}
		else{
			return false;
		}
	}
	
	function Modificar($id,$tipo,$vendedor,$pareto,$frecuencia,$diavisita,$rif,$nombre){
		$datos = array(
			'nIdTipoCliente' => $tipo,
			'nIdVendedor' => $vendedor,
			'nIdPareto' => $pareto,
			'nIdFrecuencia' => $frecuencia,
			'cDiaVisita' => ($diavisita == '0') ? NULL : $diavisita,
			'sRifCliente' => strtoupper($rif),
			'sNombreCliente' => strtoupper($nombre)
			/*'nLatCliente' => $latitud,
			'nLngCliente' => $longitud*/
		);
		$this->db->where('nIdCliente', $id);
		if($this->db->update('t_cliente', $datos)){
			return $this->Consultar($id);
		}
		else{
			return false;
		}
	}
	
	function ModificarLatLng($id,$latitud,$longitud,$cadena){
		$resultado = $this->ValidarExisteLatLng(null,$latitud,$longitud);
		if($resultado->num_rows() == 0){
			$datos = array(
				'nLatCliente' => $latitud,
				'nLngCliente' => $longitud
			);
			$this->db->set('bPuntoCliente','GeomFromText(\''.$cadena.'\')',false);
			$this->db->where('nIdCliente', $id);
			if($this->db->update('t_cliente', $datos)){
				return true;
			}else{
				return false;	
			}
		}
		else{
			return false;
		}
	}

	function ModificacionMasivaClientes($parametros){
		if($parametros['vendedor'] != 0){
			$query = 'UPDATE t_cliente 
				JOIN t_capa ON t_capa.nIdCapa="'.$parametros['id'].'"
				SET t_cliente.nIdVendedor="'.$parametros['vendedor'].'" 
				WHERE ST_CONTAINS(t_capa.bPoligonoCapa,t_cliente.bPuntoCliente)';
			$this->db->query($query);
		}
		if($parametros['frecuencia'] != -1){
			$query = 'UPDATE t_cliente 
				JOIN t_capa ON t_capa.nIdCapa="'.$parametros['id'].'"
				SET t_cliente.nIdFrecuencia="'.$parametros['frecuencia'].'" 
				WHERE ST_CONTAINS(t_capa.bPoligonoCapa,t_cliente.bPuntoCliente)';
			$this->db->query($query);
		}
		if($parametros['diavisita'] != '0'){
			$query = 'UPDATE t_cliente 
				JOIN t_capa ON t_capa.nIdCapa="'.$parametros['id'].'"
				SET t_cliente.cDiaVisita="'.$parametros['diavisita'].'" 
				WHERE ST_CONTAINS(t_capa.bPoligonoCapa,t_cliente.bPuntoCliente)';
			$this->db->query($query);
		}
	}
	
	function Eliminar($id) {
		$this->db->where('nIdCliente', $id);
		return $this->db->delete('t_cliente'); 
	}
	
	
	
	//PARA HACER LOS FILTROS POR BASE DE DATOS
	function ListadoClienteFiltrado($tipo,$vendedor,$pareto,$frecuencia) {
		return $this->db->query("SELECT * FROM t_cliente WHERE FIND_IN_SET(nIdTipoCliente, '$tipo') AND FIND_IN_SET(nIdVendedor, '$vendedor') AND FIND_IN_SET(nIdPareto, '$pareto') AND FIND_IN_SET(nIdFrecuencia, '$frecuencia')");
		/*$this->db->from('t_cliente');
		$this->db->order_by('nIdCliente', 'ASC');
		return $this->db->get();*/
	}
}
?>