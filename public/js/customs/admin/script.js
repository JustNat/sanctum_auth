$(document).ready(() => {
  var tabelaUsuario = new TableDataTable('#table-admin', {
    drawCallback: function (settings) {
      $('#table-admin_wrapper tbody .admin-view-usuario-info').each(function(){
          if($._data($(this)[0], "events") == undefined)
            $(this).click(viewUser);
      });
    }
  });
  
  $('.admin-user').on('click', (e) => {
    let label = $(e.target);
    let input = $(`#${label.prop('for')}`);
    let checkPermissoes = $(label).closest('ul').find('.admin-permissao-check');
    if (input.val() === 'all') checkPermissoes.prop('checked', true);
    else if (input.val() === 'nothing') checkPermissoes.prop('checked', false);
    let containerSwitch = $(input).closest('.accordion-admin-user');
    checkPermissioesAccordion(containerSwitch);
  })

  $('.admin-permissao-check').on('change', (e) => {
    let listaPermissoes = $(e.target).closest('ul');
    return checkPermissioesAccordion(listaPermissoes);
  });

  function checkPermissioesAccordion(element) {
    let checkPermissoes = $(element).find('.admin-permissao-check');
    let checkedPermissoes = $(element).find('.admin-permissao-check:checked');
    let uncheckedPermissoes = $(element).find(".admin-permissao-check:not(:checked)");
    if (checkPermissoes.length === checkedPermissoes.length) {
      $(element).find('.accordion-button').removeClass('text-dark');
      return $(element).find('.tri-switch-option3').prop('checked', true);
    }
    if (checkPermissoes.length === uncheckedPermissoes.length) {
      $(element).find('.accordion-button').addClass('text-dark');
      return $(element).find('.tri-switch-option1').prop('checked', true)
    }
    $(element).find('.accordion-button').removeClass('text-dark');
    return $(element).find('.tri-switch-option2').prop('checked', true);
  }
  $('.accordion-admin-user').each((key, element) => {
    checkPermissioesAccordion(element);
  })

  function checkPermissionByPerfil(perfis) {
    let containersPermission = $(`.admin-permissao-check`).closest('.accordion-admin-user');
    $(`.admin-permissao-check`).prop('checked', false);
    $(containersPermission).each((key, element) => {
      checkPermissioesAccordion(element);
    })
    if (perfis.length >= 1) {
      perfis.forEach(element => {
        let checkbox = $(`#permissao-${element}`).prop('checked', true);
        let containerPermission = $(checkbox).closest('.accordion-admin-user');
        checkPermissioesAccordion(containerPermission);
      });
    }
  }

  new SelectSelectize('#admin-usuario-perfil', {
    maxItems: null,
    plugins: ["remove_button"],
    persist: false,
    onChange: function (value) {
      $.ajax({
        url: `edit/perfil/getPermissao`,
        type: "POST",
        data: `perfil=${value}`,
      }).done((responseText) => {
        console.log(responseText);
        checkPermissionByPerfil(responseText);
      }).fail((jqXHR, textStatus) => {
        console.log("Request failed: " + textStatus);
      }).always(() => {
      });
    }
  }, false);

  new SelectSelectize('#admin-permissao-sistema', {
    create: false,
    sortField: "text",
    persist: false,
  }, false);
  var selectPermissaoSistema = new SelectSelectize('#admin-permissao-edit-sistema', {
    create: false,
    sortField: "text",
    persist: false,
  }, false);

  $('#admin-create-usuario').on('click', (e) => {
    let form = $((e).target).closest('.modal').find('form');
    $(form).validate({
      ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
      rules: {
        cpf: {
          checkCPF: true,
        },
        cargo: {
          selectize: true,
        }
      },
      messages: {
        email: {
          email: "Por favor, insira um email válido"
        }
      }
    });
    if ($(form).valid()) {
      let serializedForm = $(form).serialize();
      $.ajax({
        url: "usuario/novo",
        type: "POST",
        data: serializedForm,
        beforeSend: () => {
          $('.loader-div').show();
        },
      }).done(function (responseText) {
        console.log(responseText);
        if (responseText.success) {
          $('#admin-novo-usuario').modal('hide');
          showError(responseText.message, 'success');
          setTimeout(function () { window.location.reload() }, 1500);
        }
        else if (!responseText.success) {
          showError(responseText.message);
        }
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      }).always(() => {
        $('.loader-div').hide();
      });
    }
  })

  $('#admin-edit-usuario').on('click', (e) => {
    let form = $(e.target).closest('form');
    $(form).validate({
      ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
      rules: {
        cpf: {
          checkCPF: true,
        },
        cargo: {
          selectize: true,
        }
      },
      messages: {
        email: {
          email: "Por favor, insira um email válido"
        }
      }
    });
    if ($(form).valid()) {
      let serializedForm = $(form).serialize();
      $.ajax({
        type: "POST",
        data: serializedForm
      }).done(function (responseText) {
        if (responseText.success) {
          showError(responseText.message, 'success');
          return;
        }
        showError(responseText.message);
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      }).always(() => {
      });
    }
  })

  $('.table-usuario').on('click', '.admin-edit-usuario-status', (e) => {
    const icon = $(e.target);
    const line = icon.closest('tr');
    const iconStatus = $(line).find('.status-usuario-icon');
    const idUsuario = $(line).data('usuario');
    const status = $(line).find('.status-usuario-icon').parent().text().trim();
    Swal.fire({
      title: "Você tem certeza que quer "+(status == 'Ativo' ? 'desativar' : 'ativar')+" o usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      confirmButtonColor: "#bd0000",
      focusCancel: true
    }).then((result) => {
      if(result.isConfirmed){
        $.ajax({
          url: `usuario/${idUsuario}/updateStatus`,
          type: "POST",
        }).done(function (responseText) {
          if (responseText.success) {
            showError(responseText.message, 'success');
            icon.removeClass().addClass(responseText.icon).toggleClass('text-success').toggleClass('text-danger');
            iconStatus.toggleClass('text-success').toggleClass('text-danger');
            iconStatus.parent().html(`${iconStatus.prop("outerHTML")} ${responseText.status}`);
            return;
          }
          showError(responseText.message);
        }).fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        });
      }
      return;
    });
  });

  $("#admin-usuario-informacoes").on('click', '.admin-edit-usuario-status', (e) => {

    const partsOfLink = $('.admin-edit-usuario-status').parents().find('form.form-horizontal').attr('action').split('/');
    const idUsuario = partsOfLink[partsOfLink.length-2];
    const status = $(e.target).data('status');

    Swal.fire({
      title: "Você tem certeza que quer "+(status == 'A' ? 'desativar' : 'ativar')+" o usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      confirmButtonColor: "#bd0000",
      focusCancel: true
    }).then((result) => {
      if(result.isConfirmed){
        $.ajax({
          url: _URL+`/admin/usuario/${idUsuario}/updateStatus`,
          type: "POST",
          dataType: "json"
        }).done(function (responseText) {
          if (responseText.success) {
            Swal.fire({
              title: responseText.message,
              icon: 'success',
              confirmButtonText: "Ok"
            }).then(() => {
              location.reload();
            });
          }
          else showError(responseText.message);
        }).fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        });
      }
      return;
    });
  });

  $('#admin-edit-usuario-permissao').on('click', (e) => {
    let form = $(e.target).closest('form');
    let serializedForm = form.serialize();
    $.ajax({
      url: 'edit/permissao',
      type: "POST",
      data: serializedForm
    }).done(function (responseText) {
      if (responseText.success) {
        showError(responseText.message, 'success');
        return;
      }
      showError(responseText.message);
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    }).always(() => {
    });
  })

  $('#admin-create-permissao').on('click', (e) => {
    let form = $((e).target).closest('.modal').find('form');
    $(form).validate({
      ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
    });
    if ($(form).valid()) {
      let serializedForm = $(form).serialize();
      $.ajax({
        url: _URL+"/admin/permissao/novo",
        type: "POST",
        data: serializedForm,
      }).done(function (responseText) {
        if (responseText.success) {
          $('#admin-nova-permissao').modal('hide');
          $('#admin-nova-permissao').modal('dispose');
          showError(responseText.message, 'success');
          setTimeout(function () { window.location.reload() }, 1500);
        }
        else {
          showError(responseText.message);
          console.log(responseText);
        }
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      }).always(() => {
      });
    }
  })

  $('.table-usuario').on('click', '.admin-edit-permissao', (e) => {
    const id = $(e.target).closest('tr').data('id');

    $.ajax({
      url: `permissao/${id}/edit`,
      type: "GET"
    }).done(function (responseText) {
      if (responseText.success) {
        const codigo = $('#admin-editar-permissao').find('#codigo-edit');
        const descricao = $('#admin-editar-permissao').find('#descricao-edit');

        $('#admin-editar-permissao').

          find('#admin-edit-permissao').data('id', responseText.permissao.id);
        descricao.text(responseText.permissao.descricao);
        codigo.val(responseText.permissao.codigo).prop('disabled', true);
        selectPermissaoSistema.setValue(responseText.permissao.id_sistema, false);
        $('#admin-editar-permissao').modal('show');
      }
      else {
        showError(responseText.message);
      }
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    }).always(() => {
    });
  })

  $('#admin-edit-permissao').on('click', (e) => {
    let id = $(e.target).data('id');
    let form = $((e).target).closest('.modal').find('form');
    $(form).validate({
      ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
    });
    if ($(form).valid()) {
      let serializedForm = $(form).serialize();
      $.ajax({
        url: `permissao/${id}/edit`,
        type: "POST",
        data: serializedForm,
      }).done(function (responseText) {
        if (responseText.success) {
          $('#admin-editar-permissao').modal('hide');
          showError(responseText.message, 'success');
          setTimeout(function () { window.location.reload() }, 300);
        }
        else {
          showError(responseText.message);
        }
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      }).always(() => {
      });
    }
  })

  $('#admin-edit-perfil').on('click', (e) => {
    let form = $(e.target).closest('form');
    $(form).validate();
    if ($(form).valid()) {
      let serializedForm = $(form).serialize();
      $.ajax({
        type: "POST",
        data: serializedForm
      }).done(function (responseText) {
        console.log(responseText);
        if (responseText.success) {
          showError(responseText.message, 'success');
          setTimeout(function () { window.location.href = responseText.redirect }, 300);
          return;
        }
        showError(responseText.message);
      }).fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      }).always(() => {
      });
    }
  })

  $('.table-usuario').on('click', '.admin-edit-perfil-status', (e) => {
    const icon = $(e.target);
    const line = icon.closest('tr');
    const iconStatus = $(line).closest('tr').find('.status-perfil-icon');
    const idPerfil = $(line).data('perfil');

    $.ajax({
      url: `perfil/${idPerfil}/updateStatus`,
      type: "POST",
    }).done(function (responseText) {
      console.log(responseText);
      if (responseText.success) {
        showError(responseText.message, 'success');
        icon.removeClass().addClass(responseText.icon).toggleClass('text-success').toggleClass('text-danger');
        iconStatus.toggleClass('text-success').toggleClass('text-danger');
        iconStatus.parent().html(`${iconStatus.prop("outerHTML")} ${responseText.status}`);
        return;
      }
      showError(responseText.message);
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    }).always(() => {
    });
  });

  function viewUser(e){
    let idUser = $(this).data('id');
    
    $.ajax({
      url: _URL+"/admin/usuario/view/"+idUser,
      type: "POST",
      dataType: "json"
    }).done(function (response) {
      if(response.success){
        $("#modalAjax").html(response.modal);
        $("#exampleModal").modal('show');

        $("#exampleModal").on("hidden.bs.modal", function(){
          $(this).remove();
        });
      }
      else{
        Swal.fire({
          title: response.text,
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });
  }


  $(".admin-reset-usuario-pass").click(function(e){
    $(".btn").prop('disabled', true);
    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...');

    Swal.fire({
      title: "Você tem certeza que quer resetar a senha?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      confirmButtonColor: "#bd0000",
      focusCancel: true
    }).then((result) => {
      if(result.isConfirmed){

        const partsOfLink = $('.admin-edit-usuario-status').parents().find('form.form-horizontal').attr('action').split('/');
        const idUsuario = partsOfLink[partsOfLink.length-2];

        $.ajax({
          url: _URL+"/admin/usuario/reset",
          type: "POST",
          data: {
            id: idUsuario
          },
          dataType: "json"
        }).done(function (response) {
          if(response.success){
            Swal.fire({
              title: "Senha resetada!",
              text: response.text,
              icon: "info",
              confirmButtonText: "Ok"
            }).then(() => {
              location.reload();
            });
          }
        }).fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        }).always(() => {
        });
      }
      else return;
    });
  });

});