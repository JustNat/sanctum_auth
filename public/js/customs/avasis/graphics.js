$(document).ready(function () { 
    $('#tipos').change(function () {
        var optionVal = $("#tipos option:selected").val();
        var graphicPoints = [];
        var select = $("#tipos");
        var removableDiv = $('#removable');
       
        
        if (optionVal == '1') {
        $.ajax({
            url: _URL + '/avasis/graphics',
            type: "POST",
            data: {
                tipo: optionVal, 
            },
            dataType: "html"
        }).done(function (resposta) {
            removableDiv.html(null)
            $(removableDiv).append('<label class="mt-2" for="perguntas">Pergunta</label>');
            $(removableDiv).append(resposta);
            $('#select-pergunta').change(getPerguntaData);
        }).fail(function (jqXHR, textStatus) {
            console.log("Request failed: " + textStatus);
        }).always(function () { });

            
            
        }else if (optionVal == '2') {
            $.ajax({
                url: _URL + '/avasis/getSetores',
                type: "POST",
                dataType: "html",
            }).done(function (resposta){
                removableDiv.html(null);
                $(removableDiv).append('<label class="mt-2" for="setores">Setor</label>');
                $(removableDiv).append(resposta);
                $('#select-setor').change(function (){
                    let unidade_id = $('#select-setor option:selected').val();
                    getSetorPerguntas(unidade_id);  
                }) 

            }).fail(function (jqHRX, textStatus){
                console.log("Request failed: " + textStatus);
            }).always();
        
        } else if (optionVal == '3') {
            $.ajax({
                url: _URL + '/avasis/topTen',
                type: "POST",
                dataType: "json"
            }).done(function (resposta) {
                resposta.forEach(function (item) {
                    if (item.label){
                        graphicPoints.push({label: item.label, y: parseFloat(item.y)});
                    }
                });

                var chart = new CanvasJS.Chart("removable", {
                    title:{
                        text: "Top 10 setores",
                        fontFamily: "tahoma"
                    },
                    data: [{
                        type: "column",
                        dataPoints: graphicPoints
                    }]
                });
        
                chart.render();
            }).fail(function (jqXHR, textStatus) {
                console.log("Request failed: " + textStatus);
            }).always(function () { });
            }

            
    });

    //Retorna os dados baseados na pergunta selecionada na opção "respostas por pergunta"
    function getPerguntaData(){
        let graphicPoints = [];
        let pergunta = $('#select-pergunta option:selected').text();
        let pergunta_id = $('#select-pergunta option:selected').val();

        $.ajax({
            url: _URL + '/avasis/getPerguntas',
            type: "POST",
            dataType: 'json',
            data: {
                pergunta_id: pergunta_id
            }
        }).done(function (res){
            graphicPoints.push(
                {label: '5', y: 0},
                {label: '4', y: 0},
                {label: '3', y: 0},
                {label: '2', y: 0},
                {label: '1', y: 0}
            );

            if (res.length > 0){
                graphicPoints.forEach(function (item, index) {
                    let graphicColumn_y = typeof res[index] !== 'undefined' ?  res[index]['quantidade'] : 0
                    item.label += ' ⭐';
                    if(typeof res[index] === 'undefined' || parseInt(item.label) == res[index]['resposta']){
                        item.y += graphicColumn_y;
                    }
                });
                
                console.log(graphicPoints)
                
                var divChart = document.createElement("div");
                $(divChart).attr("id", "divCanvas").addClass("mt-4");
                $("#removable").append(divChart);
    
                var chart = new CanvasJS.Chart("divCanvas", {
                    title:{
                        text: "Número de respostas",
                        fontFamily: "tahoma"
                    },
                    data: [{
                        type: "bar",
                        dataPoints: graphicPoints
                    }]
                });
        
                chart.render();
            } else {
                Swal.fire({
                    title: 'Nenhuma resposta encontrada',
                    text: 'Não existe nenhuma resposta para esta pergunta',
                    icon: 'info',
                    confirmButtonText: 'Ok'
                })
                $("#divCanvas").html(null);
            }
            

        }).fail(function (jqXHR, textStatus){
            console.log("Request failed: " + textStatus);
        }).always(function () { });
    }

    //Retorna os dados baseados na pergunta selecionada na opção "respostas por setor"
    function getSetorPerguntas(id_setor){
        $.ajax({
            url: _URL + '/avasis/getPerguntasBySetor',
            type: "POST",
            dataType: 'html',
            data: {
                id_setor: id_setor
            }
        }).done(function (resposta){
            $('.perguntas-setor').remove();
            $('#removable').append('<div class="perguntas-setor"></div>');
            $('.perguntas-setor').append('<label class="mt-2" for="setores">Perguntas do setor</label>');
            $('.perguntas-setor').append(resposta);
            $('#select-pergunta-setor').change(function (){
                let pergunta_id = $('#select-pergunta-setor option:selected').val();
                let setor_id = $('#select-setor option:selected').val();
                getQuantidadeRespostasBySetor(pergunta_id, setor_id)
            });
        }).fail(function (jqHRX, textStatus){
            console.log("Request failed: " + textStatus);
        }).always(function () { })
        
    }

    function getQuantidadeRespostasBySetor(pergunta_id, setor_id){
        $.ajax({
            url: _URL + '/avasis/getQuantidadeRespostasBySetor',
            type: "POST",
            dataType: 'json ',
            data: {
                pergunta_id: pergunta_id,
                setor_id: setor_id
            }
        }).done(function (resposta){
            let pergunta = $(".select-pergunta-setor option:selected").text();
            $('#divCanvasPerguntasSetor').remove();
            $('.perguntas-setor').append('<div id="divCanvasPerguntasSetor" class="mt-4"></div>')
            var chart = new CanvasJS.Chart("divCanvasPerguntasSetor", {
                title:{
                    text: pergunta,
                    fontFamily: "tahoma"
                },
                data: [{
                    type: "bar",
                    indexLabel: "{y} Respsosta(s) ⭐",
                    tooTipContent: "{y} Respsosta(s)",
                    dataPoints: resposta
                }]
            });
    
            chart.render();
        }).fail(function (jqHRX, textStatus){
            console.log("Request failed: " + textStatus);
        }).always(function () { })
    }
});