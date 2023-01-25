$(document).ready(() => {
	var historicoTable = null;

	$("#filtros").click(function () {
		$(this).parent().first().CardWidget("toggle");
	});

	$("#armarios, #matriculas").selectize({
		plugins: ["remove_button"],
		create: false,
		maxItems: null,
		delimiter: ",",
		persist: false
	});

	$("#matriculas-selectized").on("keypress", function(event){
		$(this).val($(this).val().replace(/[^\d].+/, ""));
		if ((event.which < 48 || event.which > 57)) {
		  event.preventDefault();
		}
	});

	historicoTable = $("#tableHistorico").DataTable({
		processing: true,
		serverSide: true,
		serverMethod: "post",
		ajax: {
			url: _URL + "/chaves/getHistorico",
			type: "POST",
			data: function (obj) {
				obj.lockers = $("#armarios").val();
				obj.funcionarios = $("#matriculas").val();

				obj.movimentacao = [];
				$("input[name='type_movimentacao']:checked").each(function() {
					obj.movimentacao.push($(this).val());	
				});

				obj.initialInterval = $("#initialInterval").val();
				obj.finalInterval = $("#finalInterval").val();
			}
			// ,dataSrc: function (teste) {
			//     console.log(teste);
			// }
		},
		rowCallback: function (row, data) {
			var badge = document.createElement("span");
			$(badge).text(data.MOVIMENTACAO);

			if (data.MOVIMENTACAO == "EMPRESTIMO")
				$(badge).addClass("badge bg-danger");

			else
				$(badge).addClass("badge bg-success");

			$("td:eq(3)", row).html(badge);
		},
		columns: [
			{
				data: "ID",
				searchable: false,
			},
			{
				data: "DTHR_ACTION",
				searchable: false,
			},
			{
				data: "NUMERO_ARMARIO",
				searchable: false,
			},
			{
				data: "MOVIMENTACAO",
				searchable: false,
			},
			{
				data: "MATRICULA",
				searchable: false,
			},
			{
				data: "FUNCIONARIO",
				searchable: true,
			},
		],
		language: ptBrDataTable,
		order: [
			[1, "desc"],
			[5, "asc"],
		]
	});

	$("#armarios, input[name='type_movimentacao'], #matriculas").change(function(){
		historicoTable.ajax.reload();
	});

	$("#initialInterval").change(function(){
		$("#finalInterval").attr("min", $(this).val());
		historicoTable.ajax.reload();
	});
	$("#finalInterval").change(function(){
		$("#initialInterval").attr("max", $(this).val());
		historicoTable.ajax.reload();
	});
})