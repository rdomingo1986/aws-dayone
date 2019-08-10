<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mapa extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Login_model', 'login_model');
		$this->load->model('Tipocliente_model', 'tipocliente_model');
		$this->load->model('Vendedor_model', 'vendedor_model');
		$this->load->model('Pareto_model', 'pareto_model');
		$this->load->model('Frecuencia_model', 'frecuencia_model');
		$this->load->model('Admin_model', 'admin_model');
		$this->load->model('Grupocapa_model', 'grupocapa_model');
		$this->load->helper('url');
		$this->load->library('session');
		//$this->load->library('encrypt');
	}
	
	public function sesion(){
		if($this->session->userdata('nIdUsuario')==false){
			redirect(base_url(), "refresh");		
		}
	}
	
	public function index() {
		$this->sesion();
		$resultado = $this->tipocliente_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['nIdTipoCliente'][] = $registros->nIdTipoCliente;
			$datos['sNombreTipoCliente'][] = $registros->sNombreTipoCliente;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->vendedor_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['nIdVendedor'][] = $registros->nIdVendedor;
			$datos['sNombreVendedor'][] = $registros->sNombreVendedor;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->pareto_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['nIdPareto'][] = $registros->nIdPareto;
			$datos['sNombrePareto'][] = $registros->sNombrePareto;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->frecuencia_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['nIdFrecuencia'][] = $registros->nIdFrecuencia;
			$datos['nNumeroFrecuencia'][] = $registros->nNumeroFrecuencia;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->grupocapa_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['nIdGrupocapa'][] = $registros->nIdGrupocapa;
			$datos['sNombreGrupocapa'][] = $registros->sNombreGrupocapa;
			$datos['nPadreGrupocapa'][] = $registros->nPadreGrupocapa;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->login_model->ConsultarDatosUsuario($this->session->userdata('nIdUsuario'));
		$registro = $resultado->row();
		$datos['sLoginUsuario'] = $registro->sLoginUsuario;
		$this->load->view('cabecera_view');
		$this->load->view('menu_view',$datos);
		$this->load->view('mapa_view');
		$this->load->view('pie_view');
	}
	
	public function respaldo(){
		header('Content-Type: application/octet-stream');
		header("Content-Transfer-Encoding: Binary"); 
		header("Content-disposition: attachment; filename=db-backup-".date('d-m-Y',time()).".sql");
		echo $this->admin_model->respaldarTablas();
	}
}
?>