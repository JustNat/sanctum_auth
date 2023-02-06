<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Home</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.min.css" />

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous" />

    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />

    <!-- Flatpickr -->
    <link rel="stylesheet" href="css/flatpickr/css/flatpickr.min.css" />

    <!-- Selectize -->
    <link rel="stylesheet" href="css/selectize/css/selectize.bootstrap4.css" />

    <!-- Datatables  -->
    <link rel="stylesheet" href="css/datatables/css/jquery.dataTables.min.css" />

    <!-- Utils  -->
    <link rel="stylesheet" href="css/utils/utils.css" />

    <!-- Navbar central de serviÃ§os -->
    <link rel="stylesheet" href="css/layout/layout.css" />

    <link rel="stylesheet" href="css/adminlte/adminlte.min.css" />

    <!-- Customs -->
    <link rel="stylesheet" href="css/customs/inutri/persona-nutricao.css" />

    <link rel="stylesheet" href="css/customs/monexm/monexm.css" />

    <link rel="stylesheet" href="css/customs/avasis/avalayout.css" />

    <link rel="stylesheet" href="css/customs/monps/monps.css" />

    <link rel="stylesheet" href="css/customs/agenda/agenda.css" />

    <link rel="stylesheet" href="css/customs/sisnot/main.css" />

    <link rel="stylesheet" href="css/ionicons/css/ionicons.min.css" />

    <link rel="stylesheet" href="css/customs/gestaoleitos/persona.css" />

    <link rel="stylesheet" href="css/customs/chaves/chaves.css" />

    <link rel="stylesheet" href="css/customs/check_os/custom.css" />

</head>

<body>

    <div class="wrapper">

        <nav class="main-header navbar navbar-expand navbar-white">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link text-navy" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>

            <ul class="navbar-nav ml-auto">

                <li class="nav-item dropdown user-menu">

                    <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="img/user.svg" class="user-image img-circle elevation-2" alt="User Image">
                        <span class="d-none d-md-inline text-dark">user</span>
                    </a>

                    <ul id="cardUser" class="dropdown-menu dropdown-menu-lg dropdown-menu-right border-0 rounded elevation-2" style="left: inherit; right: 0px;">
                        <li class="user-header bg-light rounded-md mb-3">
                            <img src="/img/user.svg" class="img-circle elevation-2 mb-2" alt="User Image">
                            <h5>user</h5>
                            <small>email<br>No sistema desde date-registered</small>
                        </li>

                        <li class="user-footer rounded-bottom" style="background-color: #eeeeee;">
                            <a href="/logout" class="btn btn-navy btn-block">Sair</a>
                        </li>

                    </ul>

                </li>

            </ul>
        </nav>

        <aside class="main-sidebar sidebar-light-navy elevation-3" style="height: 100vh;">

            <a href="#" class="brand-link">
                <img src="img/Logo.png" alt="Logo do Hospital Rio Grande" class="brand-image img-circle" style="opacity: .8">
                <span class="brand-text font-weight-normal">Central de Serviços</span>
            </a>

            <div class="sidebar">

                <nav class="mt-2">

                    <ul class="nav nav-pills nav-sidebar flex-column nav-flat" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fas"></i>
                                <p>
                                    Usuario
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="#" class="nav-link text-link-navy">
                                        <i class="nav-icon"></i>
                                        <p>Meus dados</p>
                                    </a>
                                </li>
                                <li>
                                    <hr>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fas"></i>
                                <p>
                                    Administrador
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="#" class="nav-link text-link-navy">
                                        <i class="nav-icon fas fa-user"></i>
                                        <p>Gerenciar Usuarios</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class="nav-link text-link-navy">
                                        <i class="nav-icon"></i>
                                        <p>Gerenciar Perfis</p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class="nav-link text-link-navy">
                                        <i class="nav-icon"></i>
                                        <p>Gerrenciar Permissões</p>
                                    </a>
                                </li>
                                <li>
                                    <hr>
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a href="/logout" class="nav-link">
                                <i class="nav-icon fas fa-sign-out-alt"></i>
                                <p>Sair</p>
                            </a>
                        </li>
                    </ul>

                </nav>

            </div>

        </aside>

    </div>

    <!-- Jquery -->
    <script src="js/jquery/jquery.min.js"></script>

    <!-- Jquery Mask -->
    <script src="js/jquery-mask/jquery.mask.min.js"></script>

    <!-- Bootstrap -->
    <script src="js/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Script layout -->
    <script src="js/layout/layout.js"></script>

    <!-- Script AdminLTE -->
    <script src="js/adminlte/adminlte3-2.min.js"></script>

    <!-- SweetAlert2 -->
    <script src="js/sweetalert2/sweetalert2.all.min.js"></script>

    <!-- JQuery Validation -->
    <script src="js/jquery-validation/jquery.validate.min.js"></script>
    <script src="js/jquery-validation/additional-methods.min.js"></script>

    <!-- Flatpickr -->
    <script src="js/flatpickr/flatpickr.min.js"></script>
    <script src="js/flatpickr/rangePlugin.min.js"></script>

    <!-- Selectize -->
    <!-- <script src="js/selectize/js/standalone/selectize.min.js"></script> -->

    <script src="js/selectize-13-6/selectize.min.js"></script>

    <!-- Datatables -->
    <script src="js/datatables/js/jquery.dataTables.min.js"></script>

    <!-- Canvas Js -->
    <script src="js/canvasjs/canvasjs.min.js"></script>

    <!-- Customs JS -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment-with-locales.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>

    <!-- Utils -->
    <script src="js/customs/utils.js"></script>

</body>

</html>