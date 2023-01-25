$(document).ready(()=>
{
    const id = window.location.href.split('/').pop();
    const array_respostas = [];
    //Funções responsaveis por carregar a página das perguntas
        
        $.ajax(
        {
            url: `${_URL}/avasis/questionario/${id}`,
            type: 'GET',
        }
        ).done(function(response)
        {
            // console.log(response)
        }).fail((jqXHR, textStatus)=> {
            console.log("Request failed: " + textStatus);
        }).always();    

        //Funções responsaveis por salvar as respostas
        $('.full').on('click', function(){

            var idCollapse = ($($(this).parents()[5]).attr("id")).substring(8);
            idCollapse = parseInt(idCollapse);
            
            $("#collapse"+idCollapse).collapse('hide');
            $("#collapse"+(++idCollapse)).collapse('show');
            location.href = location.href.indexOf("#") ? 
                (location.href.split("#")[0])+"#collapse"+(idCollapse-1) :
                (location.href+"#collapse"+(idCollapse-1));
            

            const inp = $(this).prev();
            const quest_id = $(this).parent().parent().prev().attr('id');
            const avaluation = $(this).prev().attr('value');

            if(array_respostas.length == 0) array_respostas.push({question_id: quest_id, answer: avaluation, id: id});
            else if(array_respostas.some((el) => {
                return el.question_id == quest_id;
            })){
                array_respostas.forEach(element => {
                    if(element.question_id == quest_id)
                        element.answer = avaluation;
                });
            }
            else array_respostas.push({question_id: quest_id, answer: avaluation, id: id});
            
            $(inp).prop("checked", true);

        });

        //ativa o modal e envia as respostas
        $('.submit-avaluation').on('click', function(){
            function enviar(){
                Swal.fire({
                    icon: 'success',
                    title: 'Avaliação enviada com sucesso!',
                    text: 'Agradecemos o seu contato.',
                    confirmButtonText: 'Ok',
                    timer: 1500
                }).then((result) => {
                    $.ajax({
                        url: `${_URL}/avasis/enviarQuestionario`,
                        type: 'POST',
                        data: {array_respostas}
                    }).done(function(response) {
                        location.href = `${_URL}/avasis`;
                    }).fail((jqXHR, textStatus)=>{
                        console.log("Request failed: " + textStatus);
                    }).always();
                })
            }

            if($(".accordion-item").length == array_respostas.length)
            {
                Swal.fire({
                    icon: 'info',
                    title: 'Deseja fazer observações ?',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    denyButtonColor: '#d33',
                    confirmButtonText: 'Sim',
                    denyButtonText: 'Não'
                }).then((result) => {
                    //Se sim dispara o modal e pega as observações
                    if (result.value) {
                        $('#modalObs').modal('show');
                        $('#sub').on('click', function(){
                            let name = $('#nome').val();
                            let contato1 = $('#cont_1').val();
                            let contato2 = $('#cont_2').val();
                            let obs = $('#observacao').val();
                            array_respostas.push({name, contato1, contato2, obs});
                            enviar();
                        });
                    } else 
                    {
                        enviar();
                    }
                    
                });

            } else 
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Perguntas faltando!',
                    text: 'Preencha todas as perguntas para continuar',
                  });
            }
        });
    }
)