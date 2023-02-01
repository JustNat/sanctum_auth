<!DOCTYPE html>
<html lang="pt-br">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap 5.3.0 -->
    {{-- <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
        crossorigin="anonymous" /> --}}
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.min.css">

    <!-- Font Awesome PRO FREE CHECK IT OUT CLICK HERE 2023 -->
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />

    <!-- Google Font: Source Roboto -->
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet" />

    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />

    <link rel="stylesheet" href="css/utils/utils.css">
    <link rel="stylesheet" href="css/adminlte/adminlte.min.css">
    <link rel="stylesheet" href="css/layout/layout.css">
    <link rel="stylesheet" href="css/customs/home/projetos.css">

    <!-- Datatables -->
    <link rel="stylesheet" href="css/datatables/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="css/sweetalert2/sweetalert2.css">

    <title>Login</title>

</head>

<body>

    <main class="vh-100">

        <div class="h-100 d-flex justify-content-center align-items-center">

            <div class="login-container mx-2" id="container">

                <div class="form-container sign-up-container col-md-6 col-12">

                    <form method="post">
                        <h1>Paciente</h1>
                        <input type="text" id="registro" name="registro" placeholder="Registro" required>
                        <input type="date" id="dataNascimento" name="dataNascimento" placeholder="Data de Nascimento"
                            required>
                        <input type="text" id="cpf" name="cpf" class="cpf" placeholder="CPF" required>
                        <input type="email" id="email" name="email" placeholder="Email" required>
                        <button class="mt-4">Entrar</button>
                        <a class="mt-4 login-agent d-md-none d-inline" href="#">Entrar como funcionário</a>
                    </form>

                </div>

                <div class="form-container sign-in-container col-md-6 col-12">

                    <form id="formLoginFuncionario" method="post">
                        @csrf
                        <h1>Funcionário</h1>
                        <input type="email" placeholder="Email" id="inputEmail" name="email" required />
                        <input type="password" placeholder="Senha" id="inputSenha" name="senha" required />
                        <a class="mb-1" href="">Esqueceu sua senha?</a>
                        <button>Entrar</button>
                        <a class="mt-4 login-patient d-md-none d-inline" href="#">Entrar como paciente</a>
                    </form>

                </div>

                <div class="overlay-container d-md-block d-none">

                    <div class="overlay">

                        <div class="overlay-panel overlay-left">
                            <h1>Olá, amigo!</h1>
                            <p>Caso seja um funcionário, realize o login pelo botão abaixo</p>
                            <button class="ghost login-agent" id="signIn">Funcionário</button>
                        </div>

                        <div class="overlay-panel overlay-right">
                            <h1>Bem vindo!</h1>
                            <p>Caso seja um paciente, realize o login pelo botão abaixo</p>
                            <button class="ghost login-patient">Paciente</button>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </main>

    <!-- Bootstrap -->
    {{-- <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
        crossorigin="anonymous">
    </script> --}}

    <script src="js/jquery/jquery.min.js"></script>
    <script src="js/jquery-mask/jquery.mask.min.js"></script>
    <!-- JQuery Validation -->
    <script src="js/jquery-validation/jquery.validate.min.js"></script>
    <script src="js/jquery-validation/additional-methods.min.js"></script>
    <!-- Bootstrap -->
    <script src="js/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- Canvas Js -->
    <script src="js/canvasjs/canvasjs.min.js"></script>
    <!-- Script AdminLTE -->
    <script src="js/adminlte/adminlte.min.js"></script>
    <!-- Datatables -->
    <script src="js/datatables/js/jquery.dataTables.min.js"></script>
    <!-- Scripts Js -->
    <script src="js/customs/utils.js"></script>
    <script src="js/layout/layout.js"></script>
    <script src="js/customs/auth/script.js"></script>
    <script src="js/customs/ouvidoria/script.js"></script>
    <script src="js/customs/home/script.js"></script>
    <script src="js/sweetalert2/sweetalert2.js"></script>

    <script>

        $(document).ready(() => {

            $('.login-patient').on('click', () => {
                $('.login-container').addClass('right-panel-active');
            })

            $('.login-agent').on('click', () => {
                $('.login-container').removeClass('right-panel-active');
            })

            $('#formLoginFuncionario').on('submit', (e) => {

                e.preventDefault();

                let email = $("#inputEmail").val();
                let senha = $("#inputSenha").val();

                $.ajax({
                    url: 'api/login',
                    type: 'POST',
                    data: {
                        "_token": "{{ csrf_token() }}",
                        email: email,
                        senha: senha
                    },
                    success: (response) => {

                        console.log(response);

                        if (response.status==200) {
                            window.location.href = '/home';
                        }


                    },
                    error: (error) => {

                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao realizar o login!',
                            text: error.responseJSON.message,
                        })
                    }
                })
            })

        })
    </script>

</body>

</html>
