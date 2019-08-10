<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cliente extends CI_Controller {
	public function __construct() {
		parent::__construct();
		//cargar librerias, helpers, bases de datos y modelos
		$this->load->database();
		$this->load->model('Cliente_model', 'cliente_model');
		$this->load->model('Tipocliente_model', 'tipocliente_model');
		$this->load->model('Grupocapa_model', 'grupocapa_model');
		$this->load->model('Capa_model', 'capa_model');
		$this->load->model('Vendedor_model', 'vendedor_model');
		$this->load->model('Pareto_model', 'pareto_model');
		$this->load->model('Frecuencia_model', 'frecuencia_model');
		$this->load->helper('url');
		$this->load->library('session');
		$this->load->library('PHPExcel');
	}
	
	/*public function index() {
		
	}*/
	
	/*
	#################################################
	# Funciones para cargar vistas en cajas modales #
	#################################################
	*/
	public function FormularioNuevoCliente(){
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
		$this->load->view('modalnuevocliente_view',$datos);
	}
	
	public function FormularioVerCliente(){
		$resultado = $this->tipocliente_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdTipoCliente'][] = $registros->nIdTipoCliente;
			$datos['SELECTsNombreTipoCliente'][] = $registros->sNombreTipoCliente;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->vendedor_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdVendedor'][] = $registros->nIdVendedor;
			$datos['SELECTsNombreVendedor'][] = $registros->sNombreVendedor;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->pareto_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdPareto'][] = $registros->nIdPareto;
			$datos['SELECTsNombrePareto'][] = $registros->sNombrePareto;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->frecuencia_model->Listar();
		foreach($resultado->result() as $registros){
			$datos['SELECTnIdFrecuencia'][] = $registros->nIdFrecuencia;
			$datos['SELECTnNumeroFrecuencia'][] = $registros->nNumeroFrecuencia;
		}
		$resultado->free_result();
		unset($registros);
		$resultado = $this->cliente_model->Consultar($_POST['id']);
		$registro = $resultado->row();
		$datos['nIdCliente'] = $registro->nIdCliente;
		$datos['nIdTipoCliente'] = $registro->nIdTipoCliente;
		$datos['nIdVendedor'] = $registro->nIdVendedor;
		$datos['nIdPareto'] = $registro->nIdPareto;
		$datos['nIdFrecuencia'] = $registro->nIdFrecuencia;
		$datos['cDiaVisita'] = $registro->cDiaVisita;
		$datos['sRifCliente'] = $registro->sRifCliente;
		$datos['sNombreCliente'] = $registro->sNombreCliente;
		/*$datos['nLatCliente'] = $registro->nLatCliente;
		$datos['nLngCliente'] = $registro->nLngCliente;*/
		$this->load->view('modaldatoscliente_view',$datos);
	}
	
	/*
	#################################################
	# Funciones llamadas de forma asincrona         #
	#################################################
	*/
	public function exportarClientes(){
		$resultado = $this->cliente_model->Exportar();
		$resultado2 = $this->grupocapa_model->ListarPadres();
		$numeroGrupoCapas = $resultado2->num_rows();
		$letraCelda = ['H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA'];
		$j=0;

		foreach($resultado2->result() as $registros){
			$idGrupoCapas[] = $registros->nIdGrupocapa;
		}
		unset($registros);
		
		date_default_timezone_set('America/Caracas');
		$objPHPExcel = new PHPExcel();

		$objPHPExcel->setActiveSheetIndex(0)
								->setCellValue('A1', 'ID')
								->setCellValue('B1', 'RIF')
								->setCellValue('C1', 'NOMBRE')
								->setCellValue('D1', 'TIPO CLIENTE')
								->setCellValue('E1', 'VENDEDOR')
								->setCellValue('F1', 'PARETO')
								->setCellValue('G1', 'FRECUENCIA');

		for($k = 0; $k < $numeroGrupoCapas; $k++){
			$objPHPExcel->setActiveSheetIndex(0)
								->setCellValue($letraCelda[$j].'1', 'GRUPO #'.($k+1))
								->setCellValue($letraCelda[$j+1].'1', 'SUBGRUPO #'.($k+1))
								->setCellValue($letraCelda[$j+2].'1', 'CAPA #'.($k+1));
			$j += 3;
		}

		$i = 2;
		$j = 0;
		foreach($resultado->result() as $registros){
			$objPHPExcel->setActiveSheetIndex(0)
									->setCellValue('A'.$i, $registros->nIdCliente)
									->setCellValue('B'.$i, $registros->sRifCliente)
									->setCellValue('C'.$i, $registros->sNombreCliente)
									->setCellValue('D'.$i, $registros->sNombreTipoCliente)
									->setCellValue('E'.$i, $registros->sNombreVendedor)
									->setCellValue('F'.$i, $registros->sNombrePareto)
									->setCellValue('G'.$i, $registros->nNumeroFrecuencia);
			$resultado3 = $this->capa_model->ObtenerCapasContenidas($registros->nIdCliente);
			$cantCapasContenidas = $resultado3->num_rows();
			if($cantCapasContenidas == 0){
				for($k = 0; $k < $numeroGrupoCapas; $k++){
					$objPHPExcel->setActiveSheetIndex(0)
										->setCellValue($letraCelda[$j].$i, '- - -')
										->setCellValue($letraCelda[$j+1].$i, '- - -')
										->setCellValue($letraCelda[$j+2].$i, '- - -');
					
					
					$j += 3;
				}
			}else{
				$x = 0;
				foreach($resultado3->result() as $registros2){
					$capasContenidas[$x]['nIdGrupocapa'] = $registros2->nIdGrupocapa;
					$capasContenidas[$x]['nIdSubgrupocapa'] = $registros2->nIdSubgrupocapa;
					$capasContenidas[$x]['sNombreCapa'] = $registros2->sNombreCapa;
					$x++;
				}
				for($k = 0; $k < $numeroGrupoCapas; $k++){
					$encontrado = false;
					for($l = 0; $l < $cantCapasContenidas; $l++){
						if($idGrupoCapas[$k] == $capasContenidas[$l]['nIdGrupocapa']){
							$nombreGrupoCapa = $this->grupocapa_model->ConsultarNombre($capasContenidas[$l]['nIdGrupocapa']);
							$nombreSubGrupoCapa = $this->grupocapa_model->ConsultarNombre($capasContenidas[$l]['nIdSubgrupocapa']);
							$objPHPExcel->setActiveSheetIndex(0)
										->setCellValue($letraCelda[$j].$i, $nombreGrupoCapa)
										->setCellValue($letraCelda[$j+1].$i, $nombreSubGrupoCapa)
										->setCellValue($letraCelda[$j+2].$i, $capasContenidas[$l]['sNombreCapa']);
							unset($nombreGrupoCapa);
							unset($nombreSubGrupoCapa);
							$encontrado = true;
							break;
						}
					}
					if($encontrado == false){
						$objPHPExcel->setActiveSheetIndex(0)
									->setCellValue($letraCelda[$j].$i, '- - -')
									->setCellValue($letraCelda[$j+1].$i, '- - -')
									->setCellValue($letraCelda[$j+2].$i, '- - -');
						
					}
					$j += 3;
				}
				unset($capasContenidas);
				//break;
			}
			$j = 0;
			$i++;
			unset($registros2);
			$resultado3->free_result();
		}
		
		$objPHPExcel->getActiveSheet()->setTitle('Clientes');


		
		$objPHPExcel->setActiveSheetIndex(0);


		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename="clientes-'.date('d-m-Y').'.xlsx"');
		header('Cache-Control: max-age=0');
		
		header('Cache-Control: max-age=1');

		
		header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // 
		header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); 
		header ('Cache-Control: cache, must-revalidate'); 
		header ('Pragma: public'); 

		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');
		exit;
	}
	
	public function ObtenerClientes(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->Listar();
		$i=0;
		foreach($resultado->result() as $registros){
			$clientes[$i]['nIdCliente'] = $registros->nIdCliente;
			$clientes[$i]['nIdTipoCliente'] = $registros->nIdTipoCliente;
			$clientes[$i]['nIdVendedor'] = $registros->nIdVendedor;
			$resultado2 = $this->vendedor_model->Consultar($registros->nIdVendedor);
			$registros2 = $resultado2->row();
			$clientes[$i]['sColorVendedor'] = $registros2->sColorVendedor;
			$resultado2->free_result();
			$clientes[$i]['nIdPareto'] = $registros->nIdPareto;
			$clientes[$i]['nIdFrecuencia'] = $registros->nIdFrecuencia;
			$clientes[$i]['sRifCliente'] = $registros->sRifCliente;
			$clientes[$i]['sNombreCliente'] = $registros->sNombreCliente;
			$clientes[$i]['nLatCliente'] = $registros->nLatCliente;
			$clientes[$i]['nLngCliente'] = $registros->nLngCliente;
			$i++;
		}
		echo json_encode($clientes);
	}
	
	public function RegistrarCliente(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->ValidarExisteRif(null,$_POST['rif']);
		$validar['ExisteRif'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->cliente_model->ValidarExisteNombre(null,$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->cliente_model->ValidarExisteLatLng(null,$_POST['latitud'],$_POST['longitud']);
		$validar['ExisteCoordenadas'] = $resultado->num_rows();
		$resultado->free_result();
		if($validar['ExisteRif'] == 0 && $validar['ExisteNombre'] == 0 && $validar['ExisteCoordenadas'] == 0){
			$resultado = $this->cliente_model->Registrar($_POST);
			$registro = $resultado->row();
			$cliente['nIdCliente'] = $registro->nIdCliente;
			$cliente['nIdTipoCliente'] = $registro->nIdTipoCliente;
			$cliente['nIdVendedor'] = $registro->nIdVendedor;
			$resultado2 = $this->vendedor_model->Consultar($registro->nIdVendedor);
			$registro2 = $resultado2->row();
			$cliente['sColorVendedor'] = $registro2->sColorVendedor;
			$cliente['nIdPareto'] = $registro->nIdPareto;
			$cliente['nIdFrecuencia'] = $registro->nIdFrecuencia;
			$cliente['sRifCliente'] = $registro->sRifCliente;
			$cliente['sNombreCliente'] = $registro->sNombreCliente;
			$cliente['nLatCliente'] = $registro->nLatCliente;
			$cliente['nLngCliente'] = $registro->nLngCliente;
			echo json_encode($cliente);
		}else{
			echo json_encode($validar);
		}
	}
	
	public function ModificarCliente(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->ValidarExisteRif($_POST['id'],$_POST['rif']);
		$validar['ExisteRif'] = $resultado->num_rows();
		$resultado->free_result();
		$resultado = $this->cliente_model->ValidarExisteNombre($_POST['id'],$_POST['nombre']);
		$validar['ExisteNombre'] = $resultado->num_rows();
		$resultado->free_result();
		/*$resultado = $this->cliente_model->ValidarExisteLatLng($_POST['id'],$_POST['latitud'],$_POST['longitud']);
		$validar['ExisteCoordenadas'] = $resultado->num_rows();*/
		$resultado->free_result();
		if($validar['ExisteRif'] == 0 && $validar['ExisteNombre'] == 0 /*&& $validar['ExisteCoordenadas'] == 0*/){
			$resultado = $this->cliente_model->Modificar($_POST['id'],$_POST['tipocliente'], $_POST['vendedor'], $_POST['pareto'], $_POST['frecuencia'], $_POST['diavisita'], $_POST['rif'], $_POST['nombre']/*, $_POST['latitud'], $_POST['longitud']*/);
			$registro = $resultado->row();
			$cliente['nIdCliente'] = $registro->nIdCliente;
			$cliente['nIdTipoCliente'] = $registro->nIdTipoCliente;
			$cliente['nIdVendedor'] = $registro->nIdVendedor;
			$resultado2 = $this->vendedor_model->Consultar($registro->nIdVendedor);
			$registro2 = $resultado2->row();
			$cliente['sColorVendedor'] = $registro2->sColorVendedor;
			$cliente['nIdPareto'] = $registro->nIdPareto;
			$cliente['nIdFrecuencia'] = $registro->nIdFrecuencia;
			$cliente['sRifCliente'] = $registro->sRifCliente;
			$cliente['sNombreCliente'] = $registro->sNombreCliente;
			$cliente['nLatCliente'] = $registro->nLatCliente;
			$cliente['nLngCliente'] = $registro->nLngCliente;
			echo json_encode($cliente);
		}else{
			echo json_encode($validar);
		}
	}
	
	public function ModificarCoordenadasCliente(){
		header('Content-type: text/javascript');
		echo json_encode($this->cliente_model->ModificarLatLng($_POST['id'],$_POST['latitud'],$_POST['longitud'],$_POST['cadenaPunto']));
	}
	
	public function EliminarClienteSeleccionado(){
		header('Content-type: text/javascript');
		if(!$this->cliente_model->Eliminar($_POST['id'])){
			echo json_encode('ERROR');
		}
		else{
			echo json_encode('OK');
		}
	}
	
	//PARA HACER LOS FILTROS POR BASE DE DATOS
	public function AplicarFiltroClientes(){
		header('Content-type: text/javascript');
		$resultado = $this->cliente_model->ListadoClienteFiltrado($_POST['tipocliente'],$_POST['vendedor'],$_POST['pareto'],$_POST['frecuencia']);
		$i=0;
		foreach($resultado->result() as $registros){
			$clientes[$i]['nIdCliente'] = $registros->nIdCliente;
			$clientes[$i]['nIdTipoCliente'] = $registros->nIdTipoCliente;
			$clientes[$i]['nIdVendedor'] = $registros->nIdVendedor;
			$resultado2 = $this->vendedor_model->Consultar($registros->nIdVendedor);
			$registros2 = $resultado2->row();
			$clientes[$i]['sColorVendedor'] = $registros2->sColorVendedor;
			$resultado2->free_result();
			$clientes[$i]['nIdPareto'] = $registros->nIdPareto;
			$clientes[$i]['nIdFrecuencia'] = $registros->nIdFrecuencia;
			$clientes[$i]['sRifCliente'] = $registros->sRifCliente;
			$clientes[$i]['sNombreCliente'] = $registros->sNombreCliente;
			$clientes[$i]['nLatCliente'] = $registros->nLatCliente;
			$clientes[$i]['nLngCliente'] = $registros->nLngCliente;
			$i++;
		}
		echo json_encode($clientes);
	}
}
?>