var calendarMonExm = flatpickr('#startDateMonexm', {
    enableTime: true,
    time_24hr: true,
    allowInput: true,
    dateFormat: "d/m/Y H:i",
    defaultDate: [new Date().fp_incr(-3), new Date()],
    position: "below center",
    disableMobile: "true",
    locale: ptBr,
    "plugins": [new rangePlugin({ input: "#endDateMonexm" })],
    onReady(selectedDates, value, datepicker) {
    },
    onOpen(selectedDates, value, datepicker) {
        calendarMonExm.set('maxDate', false)
        calendarMonExm.set('minDate', false)
    },
    onChange(selectedDates, value, datepicker) {
        if (value != '') {
            calendarMonExm.set('maxDate', selectedDates[0].fp_incr(60));
            calendarMonExm.set('minDate', selectedDates[0].fp_incr(-60))
        }
    }
});

var tablePrincipal = $('#tableOS').dataTable({
    order: [
        [0, "desc"], [1, "desc"]
    ],
    columnDefs: [{
        name: "OS_SERIE",
        orderable: true,
        searchable: true,
        orderDataType: "dom-text",
        targets: [0],
    }, {
        name: "LANCAMENTO",
        orderable: true,
        searchable: true,
        orderDataType: "dom-text",
        targets: [1],
    }, {
        name: "RECEBIDOS",
        orderable: true,
        searchable: false,
        orderDataType: "dom-text-numeric",
        targets: [2],
    }, {
        name: "NRECEBIDOS",
        orderable: true,
        searchable: false,
        orderDataType: "dom-text-numeric",
        targets: [3],
    }, {
        name: "STATUS",
        orderable: false,
        searchable: false,
        orderDataType: "dom-text",
        targets: [4],
    }],
    language: ptBr,
    drawCallback: function (settings) {
        $('#tableOS tbody tr').each(function(){
            if($._data($(this)[0], "events") == undefined)
                $(this).click(getOSModal);
        });
    }
});

$("#sectors").selectize();

$("#search-calendar-monxem").click(triggerGetOS);
$("#sectors").change(triggerGetOS);

function triggerGetOS() {

    if ($('#startDateMonexm').length === 0) return;
    $('.table-responsive').empty();
    var dataInicio = calendarMonExm.selectedDates[0] ? formatDate(calendarMonExm.selectedDates[0]) : null;
    var dataFim = calendarMonExm.selectedDates[1] ? formatDate(calendarMonExm.selectedDates[1]) : null;
    var setor = $("#sectors").val();


    $.ajax({
        url: _URL + `/check_os/getOs`,
        type: "POST",
        data: {
            dataInicio: dataInicio,
            dataFim: dataFim
        },
        dataType: "html",
        async: false
    }).done((response) => {

        $(".table-responsive").html(response);

        tablePrincipal = $('#tableOS').dataTable({
            order: [
                [0, "desc"], [1, "desc"]
            ],
            columnDefs: [{
                name: "OS_SERIE",
                orderable: true,
                searchable: true,
                orderDataType: "dom-text",
                targets: [0],
            }, {
                name: "LANCAMENTO",
                orderable: true,
                searchable: true,
                orderDataType: "dom-text",
                targets: [1],
            }, {
                name: "RECEBIDOS",
                orderable: true,
                searchable: false,
                orderDataType: "dom-text-numeric",
                targets: [2],
            }, {
                name: "NRECEBIDOS",
                orderable: true,
                searchable: false,
                orderDataType: "dom-text-numeric",
                targets: [3],
            }],
            language: ptBr,
            drawCallback: function (settings) {
                $('#tableOS tbody tr').each(function(){
                    if($._data($(this)[0], "events") == undefined)
                        $(this).click(getOSModal);
                });
            }
        });

    }).fail((jqXHR, textStatus) => {
        console.log("Request failed: " + textStatus);
    });
}


function getOSModal(e) {
    var os = $(this).children().first().text();
    var os_serie = (os.split("-")[0]).trim();
    var os_numero = os.split("-").pop().trim();

    $.ajax({
        url: _URL + '/check_os/getOSModal',
        type: "POST",
        data: {
            os_serie: os_serie,
            os_numero: os_numero
        },
        dataType: "html",
        async: false
    }).done((response) => {

        $("#divModal").html(response);
        $("#osModal").modal('show');
        
        ($('#osModal')[0]).addEventListener('hide.bs.modal', function (event) {
            $('#divModal').empty();
        });

        ($('#osModal')[0]).addEventListener('hidden.bs.modal', function (event) {
            $('#divModal').empty();
        });
        $("#divModal button").click({os: os}, verifyOS);
        

    }).fail((jqXHR, textStatus) => {
        console.log("Request failed: " + textStatus);
    });
}

function verifyOS(e){
    Swal.fire({
        title: "Você tem certeza que quer verificar a OS?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        confirmButtonColor: "#5cb85c"
    }).then((result) => {
        if(result.isConfirmed){
            let os = e.data.os;
            var os_serie = (os.split("-")[0]).trim();
            var os_numero = os.split("-").pop().trim();

            $.ajax({
                url: _URL + '/check_os/verifyOS',
                type: "POST",
                data: {
                    os_serie: os_serie,
                    os_numero: os_numero
                },
                dataType: "json",
                async: false
            }).done((response) => {

                if(response.success){
                    Swal.fire({
                        title: response.title,
                        icon: "success",
                        confirmButtonText: "Ok"
                    }).then(() => {
                        window.location.reload();
                    });
                }
                else{
                    Swal.fire({
                        title: response.title,
                        icon: "error",
                        confirmButtonText: "Ok"
                    });
                }

            }).fail((jqXHR, textStatus) => {
                Swal.fire({
                    title: "Algo deu errado...",
                    text: textStatus,
                    icon: "error",
                    confirmButtonText: "Ok"
                });
            });
        }
        return;
    });
}