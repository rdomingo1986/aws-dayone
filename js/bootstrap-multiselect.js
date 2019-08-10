$(document).ready(function (){
  $(".modal").on("click", "input#seleccionartodos", function (){
		if($(this).is(':checked')) {
      $("span#tituloopciones").text("("+$("a.multiselect-all").attr("id")+") Opciones Seleccionadas");
    	$("input.tipocliente").prop("checked",true);
      $("span#todos").text("Deseleccionar Todos");
    }else{
      $("span#tituloopciones").text("Seleccione una Opción");
    	$("input.tipocliente").prop("checked",false);
      $("span#todos").text("Seleccionar Todos");
    }  
	});
  
  $(".modal").on("click", "input.tipocliente", function (){
    var cadena = "";
    var contador = 0;
    $("input.tipocliente").each(function (){
      if($(this).prop("checked")===true){
        cadena += $(this).attr("id")+", ";
        contador++;
      }
    });
    if(contador==0){
      $("span#tituloopciones").text("Seleccione una Opción");
      $("input#seleccionartodos").prop("checked",false);
      $("span#todos").text("Seleccionar Todos");
    }
    else{
      if(contador>=1 && contador <=3){
        $("span#tituloopciones").text(cadena.substring(0,cadena.length-2));
        $("input#seleccionartodos").prop("checked",false);
        $("span#todos").text("Seleccionar Todos");
      }else{
        $("span#tituloopciones").text("("+contador+") Opciones Seleccionadas");
        if(contador>=4 && contador<$("a.multiselect-all").attr("id")){
          $("input#seleccionartodos").prop("checked",false);
          $("span#todos").text("Seleccionar Todos");
        }else{
          $("input#seleccionartodos").prop("checked",true);
          $("span#todos").text("Deseleccionar Todos");
        }
      }  
    }
  });
});