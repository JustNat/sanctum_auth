//MADE BY MATHEUS AUGUSTO - ©Copyright 2022
$(document).ready(function () {
  jQuery.validator.addMethod(
    "checkTwoInputs",
    function (value, element, params) {
      const input = $(element);
      const select = input.closest("div").find("select");

      let validate = true;

      if (!$(select).val() || !$(input).val()) validate = false;

      return validate;
    },
    "Os campos abaixo precisam estar preenchidos."
  );

  const selectizePerfil = $("#select-perfis").selectize({
    sortField: "text",
  });

  const calendarCardapios = $("#calendar-cardapios").flatpickr({
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "j/m/Y",
    position: "below center",
    mode: "range",
    defaultDate: [new Date(), new Date().fp_incr(6)],
    locale: ptBr,
    onReady(selectedDates, value, instance) {
      changeCalendar(selectedDates);
    },
    onOpen(selectedDates, value, instance) {
      instance.set("maxDate", false);
      instance.set("minDate", false);
      dataFormatada = instance.altInput.value.replace("to", "até");
      instance.altInput.value = dataFormatada;
    },
    onChange(selectedDates, value, instance) {
      if (value != "") {
        instance.set("maxDate", selectedDates[0].fp_incr(30));
        instance.set("minDate", selectedDates[0].fp_incr(-30));
        if (selectedDates.length === 2) {
          changeCalendar(selectedDates);
        }
      }
    },
  });

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  const cardTools = `<div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>`;

  var defaultData = [];

  function changeCalendar(selectedDates) {
    const firstDate = formatDate(selectedDates[0]);
    const lastDate = formatDate(selectedDates[1]);
    const profileId = $("#select-perfis").val();

    if (profileId) {
      $.ajax({
        url: `cardapio_perfil/${profileId}`,
        type: "POST",
        data: `dataInicial=${firstDate.date}&dataFinal=${lastDate.date}`,
        dataType: "html",
      })
        .done((response) => {
          $(".container-cardapio-semana").html(response);

          $(".container-cardapio-semana .list-group a[data-bs-toggle='popover']").each(function() {
            $(this).popover({
              placement: 'top',
              trigger: 'hover',
              html: true,
              content: "<h1>template</h1>",
              delay: {
                show: 500,
                hide: 0
              }
            });
            $(this).on('show.bs.popover', null, {obj: $(this)[0]}, getSimpleCardapio);
          });

        })
        .fail((jqXHR, textStatus) => {
          console.log("Request failed: " + textStatus);
        })
        .always();
    }
  }

  function getSimpleCardapio(e){
    var objOfPopover = e.data.obj;
    const menuId = $(objOfPopover).data("id");
    const menuDate = $(objOfPopover).closest(".card").data("date");
    const profileId = $("#select-perfis").val();
    const principalEvent = e;

    $.ajax({
      url: `getSimpleCardapio/${menuId}`,
      type: "GET",
      data: `date=${menuDate}&profileId=${profileId}`,
      dataType: "html",
      async: false
    }).done(function (response) {
      if(response == '') {
        principalEvent.preventDefault();
        return;
      }
      (bootstrap.Popover.getInstance($(objOfPopover)[0]))._config.content = response;
    }).fail(function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });
  }


  $(".select-perfis").on("change", () => {
    const today = new Date();
    const nextWeek = new Date().fp_incr(6);

    calendarCardapios.clear();
    calendarCardapios.setDate([today, nextWeek]);
    changeCalendar([today, nextWeek]);
  });

  $("#divItemCardapio").on("change", "input, select", function () {
    const currentData = getData($("#modalItemCardapio"));

    const JSONDefaultData = JSON.stringify({ defaultData });
    const JSONCurrentData = JSON.stringify({ currentData });

    if (JSONDefaultData !== JSONCurrentData)
      $(".btn-save").removeClass("disabled");
    else $(".btn-save").addClass("disabled");
  });

  $(".container-cardapio-semana").on("click", ".cardapio-list", function () {
    const menuId = $(this).data("id");
    const menuDate = $(this).closest(".card").data("date");
    const profileId = $("#select-perfis").val();

    $.ajax({
      url: `editItemCardapio/${menuId}`,
      type: "GET",
      data: `date=${menuDate}&profileId=${profileId}`,
      dataType: "html",
    })
      .done(function (response) {
        $("#divItemCardapio").html(response);
        $("#modalItemCardapio").on("hidden.bs.modal", () =>
          $("#modalItemCardapio").remove()
        );
        defaultData = getData($("#modalItemCardapio"));
        $("#modalItemCardapio").modal("show");
        $("#calendar-copy").length &&
          $("#calendar-copy").flatpickr({
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "j/m/Y",
            minDate: new Date().fp_incr(1),
            mode: "multiple",
            position: "above right",
            maxDate: new Date().fp_incr(30),
            conjunction: ", ",
            locale: ptBr,
            onOpen: function (selectedDates, value, instance) {
              $("#modalItemCardapio").removeAttr("tabindex");
            },
            onClose: function (selectedDates, value, instance) {
              $("#modalItemCardapio").attr("tabindex", -1);
            },
          });
        let c = 1;
        $(".light-card .cardapio-title").each(function () {
          $(this).text("Opção " + c.toString());
          c = c + 1;
        });
        // SELECTIZE QUE N FUNCIONA
        // $("[name='opcao[]']").selectize({
        //     persist: false,
        //     create: false,
        // });

        $(".grupo-cardapio").length >= 2 &&
          $(".grupo-cardapio .grupo-header").append(cardTools);
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always();
  });

  $("#divItemCardapio").on(
    "removed.lte.cardwidget",
    ".btn-tool",
    async function () {
      const menuGroups = $("#divItemCardapio").find(".grupo-cardapio");
      const card = $(this).closest(".card");

      if (menuGroups.length > 1) {
        await $(card)
          .promise()
          .done(function () {
            $(this).remove();
          });
      }

      $("#divItemCardapio").find(".grupo-cardapio").length === 1 &&
        ($("#divItemCardapio").find(".grupo-cardapio").CardWidget("expand"),
          $("#divItemCardapio").find(".grupo-header .card-tools").remove());
    }
  );

  function validForm(form) {
    $(form).validate({
      errorElement: "span",
      ignore:
        ":hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input",
      errorClass: "text-danger error d-block mb-1",
      validClass: "success d-none",
      rules: {
        "opcao[]": {
          required: true,
        },
        "porcao[]": {
          required: true,
        },
        "quantidade-grupo": {
          required: true,
        },
      },
      messages: {
        "opcao[]": {
          required: "É necessário selecionar uma opção.",
        },
        "porcao[]": {
          required: "É necessário inserir uma quantidade de porção.",
        },
        "opcao-grupo": {
          required: "É necessário inserir uma descrição.",
        },
        "quantidade-grupo": {
          required: "É necessário inserir um limite de porções",
        },
      },
      errorPlacement: function (error, element) {
        console.log(error);
        var placement = $(element).closest(".item-cardapio");
        $(placement).before(error);
      },
      highlight: function (element, errorClass, validClass) {
        const placement = $(element).closest(".item-cardapio");
        $(placement)
          .find(".error")
          .addClass(errorClass)
          .removeClass(validClass);
      },
      unhighlight: function (element, errorClass, validClass) {
        const placement = $(element).closest(".item-cardapio");
        $(placement)
          .find(".error")
          .removeClass(errorClass)
          .addClass(validClass);
      },
    });

    let selectValid = $(form).find("select").valid();
    let inputValid = $(form).find("input").valid();

    if (selectValid && inputValid) return true;

    return false;
  }

  function deleteMenu(menuId, menuDate) {
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não podera reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `deleteItemCardapio/${menuId}`,
          type: "POST",
          data: { date: menuDate },
        })
          .done(function (response) {
            if (response.success) {
              $(
                `.card[data-date="${menuDate}"] .cardapio-list[data-id="${menuId}"] span`
              ).html('<i class="fas fa-times-circle"></i>');
              $(
                `.card[data-date="${menuDate}"] .cardapio-list[data-id="${menuId}"]`
              )
                .addClass("text-danger")
                .removeClass("text-success");

              showError(response.message, "success");
            } else if (!response.success) {
              showError(response.message);
            }
            $(".modal").modal("hide");
          })
          .fail(function (jqXHR, textStatus) {
            console.log("Request failed: " + textStatus);
          })
          .always();
      }
    });
  }

  $("#divItemCardapio").on("click", ".btn-delete", function () {
    const modal = $(this).closest(".modal");

    const menuId = $(modal).data("cardapio");
    const menuDate = $(modal).data("data");

    deleteMenu(menuId, menuDate);
  });

  function getData(modal) {
    const fieldsets = $(modal).find("fieldset");
    const data = [];

    $(fieldsets).each(function (index, element) {
      const groupId = $(element).data("id");
      const group = {
        id: groupId ?? null,
        limit: 0,
        description: "",
        items: [],
      };

      $(element)
        .find("input, select")
        .map(function (index, element) {
          if ($(element).attr("name") === "opcao-grupo") {
            group.description = $(element).val();
          }

          if ($(element).attr("name") === "quantidade-grupo") {
            group.limit = $(element).val();
          }

          if ($(element).attr("name") === "opcao[]") {
            group.items.push({
              id: $(element).val(),
              quantity: $(element)
                .closest(".item-cardapio")
                .find('input[name="porcao[]"]')
                .val(),
            });
            return;
          }
        });

      data.push(group);
    });
    return data;
  }

  function saveMenu(modal, selectedDates, isCopy = false) {
    const menuId = $(modal).data("cardapio");
    const form = $(modal).find("form");

    let data = [];
    if (validForm(form)) data = getData(modal);
    if (data.length > 0) {
      selectedDates.forEach((date) => {
        $.ajax({
          url: `insertItemCardapio/${menuId}`,
          type: "POST",
          data: {
            date,
            data,
            isCopy,
          },
        })
          .done(function (response) {
            if (response.success) {
              $(".modal").modal("hide");
              $(
                `.card[data-date="${date}"] .cardapio-list[data-id="${menuId}"] span`
              ).html('<i class="fas fa-check-circle"></i>');

              $(
                `.card[data-date="${date}"] .cardapio-list[data-id="${menuId}"]`
              )
                .addClass("text-success")
                .removeClass("text-danger");
              showError(response.message, "success");
            } else if (!response.success) {
              showError(response.message);
            }
          })
          .fail(function (jqXHR, textStatus) {
            console.log("Request failed: " + textStatus);
          })
          .always();
      });
    }
  }

  $("body").on("click", ".edit-cardapio-link", function (e) {
    const fieldSet = $(this).closest("fieldset");
    const modal = $(this).closest(".modal");

    const groupId = $(fieldSet).data("id");
    const data = $(modal).data("data");
    const menuId = $(modal).data("cardapio");

    $.ajax({
      url: `editGroup`,
      type: "POST",
      dataType: "html",
      data: {
        date: data,
        menuId: menuId,
        groupId: groupId,
      },
    })
      .done(function (response) {
        const content = $.parseHTML(response);
        const option = $(fieldSet).find(".cardapio-title").text();
        $(content).find(".cardapio-title").text(option);
        $(fieldSet).replaceWith(content);
        $(".btn-save").removeClass("disabled");
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always();
  });

  $("#divItemCardapio").on("click", ".btn-save", function () {
    const modal = $(this).closest(".modal");
    const menuDate = $(modal).data("data");

    saveMenu(modal, [menuDate]);
  });

  $("#divItemCardapio").on("click", ".btn-add-option", function () {
    const modalBody = $(this).closest(".modal-body");
    const form = $(modalBody).find("form");
    const carousel = $(modalBody).find(".caroul");
    const width = $(modalBody).find(".card").width();

    $.ajax({
      url: "addGroup",
      type: "GET",
      dataType: "html",
    })
      .done(function (response) {
        console.log(response);
        const responseHTML = $.parseHTML(response);
        $(responseHTML).find(".cardapio-title").text("Nova opção");
        $(responseHTML).find("select, input").rules("add", {
          required: true,
        });
        $(form).append(responseHTML);
        $(".card-header.grupo-header").each(function (index, element) {
          !$(element).find(".card-tools").length &&
            $(element).append(cardTools);
        });
        $(carousel).animate(
          {
            scrollLeft: "+=" + width,
          },
          1
        );
        // SELECTIZE QUE N FUNCIONA
        // $("[name='opcao[]']").selectize({
        //     persist: false,
        //     create: false,
        // });
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      })
      .always();
  });

  $("#divItemCardapio").on("click", ".btn-add-item", function () {
    const containerItens = $(this).closest(".container-item-cardapio");
    const selectsCount = $(containerItens).find(".item-cardapio").length;
    const buttonAddItem = $(this);
    if (selectsCount < 10) {
      $.ajax({
        url: "addItemCardapio",
        type: "GET",
        dataType: "html",
      })
        .done(function (response) {
          const item = $.parseHTML(response);
          $(item).addClass("not-saved");
          buttonAddItem.closest("div").find(".table-rows").append(item);
          // SELECTIZE QUE N FUNCIONA
          // $("[name='opcao[]']").selectize({
          //     persist: false,
          //     create: false,
          // });
        })
        .fail(function (jqXHR, textStatus) {
          console.log("Request failed: " + textStatus);
        })
        .always();
    }
  });

  $("#divItemCardapio").on("click", ".btn-remove-item", function () {
    const btnRemove = $(this);
    const itemMenu = btnRemove.closest(".item-cardapio");
    const itemsMenu = btnRemove.closest("fieldset").find(".item-cardapio");
    if (itemsMenu.length > 1) {
      itemMenu.remove();
      return;
    }
    $(itemMenu).find("input, select").val("");
  });

  $("#divItemCardapio").on("click", ".btn-copy", function () {
    const calendarCopy = $("#calendar-copy");
    const selectedDates = $("#calendar-copy").val().split(", ");

    const showAlert = (text) => {
      const alertEmpty = $("<span></span>")
        .addClass("text-danger d-block my-2 mt-3 alertCopy")
        .text(text);

      calendarCopy.closest("div").after(alertEmpty);
    };

    $(".alertCopy").remove();

    if (selectedDates[0] === "") {
      showAlert(
        "É necessário selecionar pelo menos um dia para realizar uma cópia."
      );
      return;
    }

    if ($(".modal").find(".not-saved").length > 0) {
      showAlert(
        "É necessário salvar todas as alterações antes de realizar uma cópia."
      );
      return;
    }

    const modal = $(this).closest(".modal");
    const menuId = $(modal).data("cardapio");

    $.ajax({
      url: `getCheckedCardapiosDays/${menuId}`,
      type: "POST",
      data: { selectedDates },
    })
      .done((response) => {
        if (response.success) {
          showError(response.message, "success");
          saveMenu(modal, selectedDates, true);
        } else {
          let text = "Os cardápios dos dias: ";
          let filledDates = response.dates;

          for (i = 0; i < filledDates.length; i++) {
            dateSplit = filledDates[i].replace(" 00:00:00", "").split("-");
            text += dateSplit[2] + ", ";
          }

          text = text.replace(
            /,\s*$/,
            " já possuem itens\nDeseja sobrescrever?"
          );

          Swal.fire({
            title: "Tem certeza?",
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, copiar!",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              saveMenu(modal, selectedDates, true);
            } else {
              showError("A cópia dos cardápios foi cancelada!", "success");
            }
          });
        }
      })
      .fail(function (jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      });
  });
});
