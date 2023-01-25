var tablePrincipal = $('#tableSistemas').dataTable({
    order: [
        [0, "asc"]
    ],
    columnDefs: [{
        name: "nome",
        orderable: true,
        searchable: true,
        orderDataType: "dom-text",
        targets: [0],
    }, {
        name: "status",
        orderable: false,
        searchable: true,
        orderDataType: "dom-text",
        targets: [1],
    }],
    language: ptBrDataTable
});