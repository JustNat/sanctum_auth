jQuery.extend(jQuery.validator.messages, {
  required: "Este campo Ã© obrigatÃ³rio",
});

$.fn.dataTableExt.ofnSearch["html-input"] = function (value) {
  return $(value).find("select").find(":selected").text();
};

$.fn.dataTable.ext.order["dom-text"] = function (settings, col) {
  return this.api()
    .column(col, {
      order: "index",
    })
    .nodes()
    .map(function (td, i) {
      return $("input[type=text]", td).val();
    });
};

$.fn.dataTable.ext.order["dom-option"] = function (settings, col) {
  return this.api()
    .column(col, {
      order: "index",
    })
    .nodes()
    .map(function (td, i) {
      return $("select", td).find(":selected").text();
    });
};

$.fn.dataTable.ext.order["dom-check"] = function (settings, col) {
  return this.api()
    .column(col, {
      order: "index",
    })
    .nodes()
    .map(function (td, i) {
      return +$("input[type=checkbox]", td).prop("checked");
    });
};

var table = $("#table-questionarios").DataTable({
  responsive: true,
  order: [
    [0, "desc"],
    [2, "asc"],
  ],
  language: {
    paginate: {
      first: "Primeiro",
      last: "Ultimo",
      next: "Próximo",
      previous: "Anterior",
    },
    decimal: "",
    emptyTable: "A tabela está vazia.",
    info: "Exibindo _END_ de um total de _TOTAL_ elementos",
    infoEmpty: "Exibindo um total de 0 elementos",
    infoFiltered: "(Filtrando um total de _MAX_ elementos)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "Exibir _MENU_ elementos",
    loadingRecords: "Carregando...",
    processing: "Processando...",
    search: "Pesquisar:",
    zeroRecords: "Sem resultado...",
  },
  columnDefs: [
    {
      orderable: true,
      orderDataType: "dom-check",
      targets: [0],
      orderData: [0, 0],
    },
    {
      searchable: true,
      orderable: true,
      orderDataType: "dom-text",
      type: "string",
      targets: [1],
      orderData: [1, 0],
    },
    {
      searchable: true,
      orderable: true,
      orderDataType: "dom-text",
      type: "html-input",
      targets: [2],
      orderData: [2, 0],
    },
    {
      searchable: true,
      orderable: false,
      orderDataType: "dom-option",
      type: "html-input",
      targets: [3],
      orderData: [3, 0],
    },
  ],
});

// $(".toolbar-questionario").html(
//   "<button type='button' name='submit' class='btn d-flex btn-primary btn-add-questionario'><span>Adicionar</span><div class='icon ml-2'><i class='fal fa-plus'></i></div></button>"
// );

$(document).ready(function () {
  $("#table-questionarios").on("change", "input, select", function () {
    var ctnComida = $(this).closest("tr");
    ctnComida.find("input[type=text]").addClass("changed");
    ctnComida.find("input[type=hidden]").addClass("changed");
    ctnComida.find("select").addClass("changed");
  });
  var tablex = null;
  var table = null;
});

$(".perguntas").click(function () {
  $.post(
    _URL + "/avasis/showPerguntas",
    {
      id_questionario: $(this).attr("data-id"),
    },
    function (data) {
      $("#divQuestionario").empty();
      $("#divQuestionario").append(data);
      $("#showPerguntas").modal("show");
    }
  );
});

$(".form-questionario").on("click", ".btn-add-questionario", function (e) {
  e.preventDefault();
  $.post(_URL + "/avasis/modalAddQuestionario", function (data) {
    $("#divQuestionario").append(data);
    $("#createQuestionario").modal("show");
  });
});

$("#divQuestionario").on("click", ".btn-create-questionario", function (e) {
  var nome = $("#pergunta-nome").val();

  $.ajax({
    url: _URL + "/avasis/addQuestionario",
    type: "POST",
    data: "nome=" + nome + "&tipo=" + $("#pergunta-tipo").val(),
    dataType: "html",
  })
    .done(function (resposta) {
      if (resposta == "true") {
        alert("Questionario foi adicionado!");
        window.location.reload();
      }
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {});
});

$(".form-questionario").on("click", ".btn-edit", function (e) {
  e.preventDefault();
  $.post(
    "editQuestionario.php",
    {
      id: $(this).attr("data-id"),
    },
    function (data) {
      $("#divQuestionario").empty();
      $("#divQuestionario").append(data);
      $("#editQuestionario").modal("show");
    }
  );
});

$("#divQuestionario").on("click", ".btn-edit", function (e) {
  $.ajax({
    url: "App/controller.php",
    type: "POST",
    data:
      "func=editQuestionario&id=" +
      $("#addQuest").attr("data-id") +
      "&nome=" +
      $("#pergunta-nome").val() +
      "&tipo=" +
      $("#pergunta-tipo").val(),
    dataType: "html",
  })
    .done(function (resposta) {
      if (resposta == "true") {
        alert("Questionario foi editado!");
        window.location.reload();
      } else console.log(2);
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {});
});

$(".change-status-questionario").change(function () {
  var checked = $(this).prop("checked");
  var ctnQuestionario = $(this).closest("tr");
  var idQuestionario = ctnQuestionario.find("input[type=hidden]").val();
  let button = $(this);

  if (checked) {
    var status = 1;
    var text = "Questionario foi ativado";
    var bool = true;
  } else if (!checked) {
    var status = 0;
    var text = "Questionario foi desativado";
    var bool = false;
  }

  $.ajax({
    url: _URL + "/avasis/changeStatus",
    type: "POST",
    data: {
      table: "questionario",
      id_questionario: idQuestionario,
      status: status,
    },
    dataType: "html",
  })
    .done(function (resposta) {
      $(button).prop("checked", bool);
      Swal.fire({
        title: "Sucesso!",
        icon: "success",
        text: text,
        confirmButtonText: "OK",
      });
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {});
});

$("#table-questionarios").on("click", ".btn-cancel-questionario", function (e) {
  var line = $(this).closest("tr");
  $(line)
    .find(".form-control")
    .each(function () {
      $(this).prop("disabled", false);
    });

  $(this).addClass("bg-success btn-active-questionario");
  $(this).removeClass("btn-cancel-questionario bg-danger");
  $(this).children("i").removeClass("fas fa-lock");
  $(this).children("i").addClass("fas fa-unlock");
});

$("#table-questionarios").on("click", ".btn-active-questionario", function (e) {
  $(
    "#table-questionarios.input[type=text]:not(.changed), #table-questionarios.input[type=hidden]:not(.changed), #table-questionarios.select:not(.changed)"
  ).prop("disabled", true);
  var line = $(this).closest("tr");
  var formControl = $(line).find(".form-control");
  var inputValues = () => {
    var values = [];
    $(formControl).each(function () {
      values.push($(this).val());
    });
    return values;
  };

  $.ajax({
    url: _URL + "/avasis/editQuestionario",
    type: "POST",
    data: {
      tipo: "questionario",
      id: inputValues()[0],
      nome: inputValues()[1],
      date: inputValues()[2],
      tipo_questionario: inputValues()[3],
    },
    dataType: "html",
  })
    .done(function (resposta) {
      console.log(resposta);
      if (resposta) {
        Swal.fire({
          title: "Sucesso!",
          text: "Questionario atualizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    })
    .fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    })
    .always(function () {});

  $(line)
    .find(".form-control")
    .each(function () {
      $(this).prop("disabled", true);
    });

  $(this).addClass("btn-cancel-questionario bg-danger");
  $(this).removeClass("bg-success btn-active-questionario");
  $(this).children("i").removeClass("fas fa-unlock");
  $(this).children("i").addClass("fas fa-lock");
});
