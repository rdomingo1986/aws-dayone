(function ($) {
	$.fn.estaVacio = function() {
		return (this.val().trim().length == 0) ? true : false;
	};
	
	$.fn.opcionComboEsCero = function() {
		return (this.val() == 0) ? true : false;
	};
	
	$.fn.validarExpReg = function (exp) {
		return exp.test(this.val().toUpperCase().trim());
	};
	
	$.fn.bloquearElemento = function () {
		this.attr('disabled','true');
		return this;
	}
	
	$.fn.desbloquearElemento = function () {
		this.removeAttr('disabled');
		return this;
	}
}(jQuery));