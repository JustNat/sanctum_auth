$(document).ready(function () {
  var selectTransfer = $('#sosmaqueiro-select-transferencia').length > 0 && new SelectSelectize('#sosmaqueiro-select-transferencia', {
    create: false,
    sortField: "text",
    persist: false,
  });

  function updateSolicitations(data) {
    const container = $(`.sosmaqueiro-solicitacao[data-id="${data.id}"]`);
    const span = $('<span></span>').addClass(`badge ${data.status_color}`).text(data.status);
    $(container).data('status', data.status);
    $(container).find('td span.sosmaqueiro-acao').html(data.action);
    $(container).find('td.sosmaqueiro-status').html(span);
    $(container).find('td.sosmaqueiro-buttons').html(data.buttons);
  };

  $('#sosmaqueiro-abrir-chamado').on('click', (e) => {
    $.ajax({
      url: "sosmaqueiro/solicitar",
      type: "GET",
      async: false,
      dataType: "html"
    }).done(function (response) {
      $('#sosmaqueiro-container-modal').html(response);
      new SelectSelectize('#sosmaqueiro-select-paciente', {
        create: false,
        sortField: "text",
        persist: false,
      });
      new SelectSelectize('#sosmaqueiro-select-solicitante', {
        create: false,
        sortField: "text",
        persist: false,
      });
      new SelectSelectize('#sosmaqueiro-select-destino', {
        create: false,
        sortField: "text",
        persist: false,
      });
      $('#sosmaqueiro-solicitar-modal').modal('show');

    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    }).always(function () {

    });
  })

  $('#sosmaqueiro-container-modal').on('click', '#sosmaqueiro-solicitar-maqueiro', (e) => {
    let modal = $(e.target).closest('#sosmaqueiro-solicitar-modal');
    let form = $(modal).find('form');
    $(form).validate({
      ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
      rules: {
        paciente: {
          selectize: true,
        },
        setor_solicitante: {
          selectize: true,
        },
        destino: {
          selectize: true,
        },
        'recurso[]': {
          required: true,
        },
        transporte: {
          required: true,
        }
      },
      errorPlacement: function (error, element) {
        var placement = $(element).closest('.form-group');
        $(placement).append(error)
      },
      highlight: function (element, errorClass, validClass) {
        var div = $(element).closest('.form-group');
        $(div).next('.error').addClass(errorClass).removeClass(validClass);
      },
      unhighlight: function (element, errorClass, validClass) {
        var div = $(element).closest('.form-group');
        $(div).next('.error').removeClass(errorClass).addClass(validClass);
      }
    });
    const serializedForm = $(form).serialize();

    $.ajax({
      url: "sosmaqueiro/solicitar",
      type: "POST",
      dataType: "json",
      data: serializedForm,
    }).done(function (response) {
      if (response.success) {
        showError(response.message, 'success');
        $('#sosmaqueiro-solicitar-modal').modal('hide').remove();
      } else {
        showError(response.message);
      }
    }).fail(function (jqXHR, textStatus) {
      showError('Ocorreu um error inesperado, por favor, contate a TI.');
    });
  });

  $('#sosmaqueiro-chamados-tabela').on('click', '.sosmaqueiro-buttons a', async (e) => {
    const solicitationId = $(e.target).closest('.sosmaqueiro-solicitacao').data('id');
    const action = $(e.target).closest('a').data('acao');

    if (action === 'transferir' || action === 'atribuir') {
      getBearerTransfer().then((response) => {
        $.ajax({
          url: `sosmaqueiro/atender/${solicitationId}`,
          type: "POST",
          data: {
            action: action,
            user: response.user
          },
          dataType: "json"
        }).done(function (response) {
          if (response.success) {
            showError(response.message, 'success');
            updateSolicitations(response.content);
          } else {
            showError(response.message);
          }
        }).fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        }).always(function () {

        });
      }).catch((error) => error);

      return;
    }

    if (action === 'cancelar' || action === 'pausar') {
      getJustificationSolic(action).then((response) => {
        $.ajax({
          url: `sosmaqueiro/atender/${solicitationId}`,
          type: "POST",
          data: {
            action: action,
            justification: response.justification
          },
          dataType: "json"
        }).done(function (response) {
          if (response.success) {
            showError(response.message, 'success');
            updateSolicitations(response.content);
          } else {
            showError(response.message);
          }
        }).fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        });

      }).catch((error) => error);

      return;
    }

    if (action === 'info') {
      const type = $(e.target).closest('a').data('tipo');
      $.ajax({
        url: `sosmaqueiro/atender/${solicitationId}/${type}`,
        type: "GET",
      }).done(function (response) {
        $('#sosmaqueiro-container-modal').html(response);
        $('#sosmaqueiro-info-modal').modal('show');
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      });

      return;
    }

    $.ajax({
      url: `sosmaqueiro/atender/${solicitationId}`,
      type: "POST",
      data: {
        action: action,
      },
      dataType: "json"
    }).done(function (response) {
      if (response.success) {
        showError(response.message, 'success');
        updateSolicitations(response.content);
      } else {
        showError(response.message);
      }
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });
  });

  async function getBearerTransfer() {
    // Realizar uma promise que espera a resposta do usuário, caso ele cancele a transferencia retornar o catch
    // caso ele escolha um usuário e confirme, retorna o then
    return new Promise(function (resolve, reject) {
      $('#sosmaqueiro-transferir-modal').modal('show');
      selectTransfer.setValue('', false);
      $('#sosmaqueiro-transferir-modal .btn-transferir').click(function () {
        if (selectTransfer.getValue() == '') {
          showError('É necessário escolher um maqueiro para realizar a transferência.');
          return;
        }

        $('#sosmaqueiro-transferir-modal').modal('hide');

        resolve({
          user: selectTransfer.getValue()
        });
      });

      $('#sosmaqueiro-transferir-modal .btn-cancelar').click(() => reject(false));
    });
  };

  async function getJustificationSolic(action) {
    // Realizar uma promise que espera a resposta do usuário, caso ele cancele a transferencia retornar o catch
    let operation = 'do cancelamento';

    if (action === 'pausar')
      operation = 'da pausa';

    // caso ele escolha um usuário e confirme, retorna o then
    return new Promise(function (resolve, reject) {
      $('#sosmaqueiro-motivo-modal').modal('show');
      $('#sosmaqueiro-motivo-modalLabel').text(`Informe o motivo ${operation}`);
      $('#sosmaqueiro-motivo').val('');
      $('#sosmaqueiro-motivo-label').text(`Motivo ${operation}`);

      $('#sosmaqueiro-motivo-modal .btn-confirmar').click(function () {
        if ($('#sosmaqueiro-motivo').val() == '') {
          showError(`É necessário inserir o motivo ${operation}.`)
          return;
        }
        $('#sosmaqueiro-motivo-modal').modal('hide');
        resolve({
          justification: $('#sosmaqueiro-motivo').val()
        });
      });

      $('#sosmaqueiro-motivo-modal .btn-cancelar').click(() => reject(false));
    });

  };

  function ordenarSolicitacoesMaqueiro() {
    const solicitationsTable = $('#sosmaqueiro-chamados-tabela tr.sosmaqueiro-solicitacao');

    const statusType = {
      aberto: 0,
      atendimento: 1,
      pausado: 2,
      finalizado: 3,
      cancelado: 4
    }
    const tableSorted = solicitationsTable.sort(function (a, b) {
      const statusElemA = $(a).data('status').toLowerCase();
      const statusElemB = $(b).data('status').toLowerCase();
      return statusType[statusElemA] - statusType[statusElemB];
    });

    $('#sosmaqueiro-chamados-tabela tbody').html(tableSorted);
  }
  ordenarSolicitacoesMaqueiro();


});