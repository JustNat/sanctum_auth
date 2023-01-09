<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator =  Validator::make($request->all(), [
            'nome' => 'required',
            'sobrenome' => 'required',
            'cpf' => ['required', 'numeric'],
            'email' => ['email', 'unique:usuario,email', 'required'],
            'senha' => [
                'required', 'confirmed',
                // senha deve haver letras maiusculas e minusculas, letras, numeros, simbolos e ao menos 8 caracteres
                Password::min(8)
                    ->mixedCase()
                    ->numbers()->letters()->symbols()
            ],
            'matricula' => ['nullable', 'numeric']
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $user = User::create([
                'nome' => $request->nome,
                'sobrenome' => $request->sobrenome,
                'cpf' => $request->cpf,
                'email' => $request->email,
                'senha' => Hash::make($request->senha),
                'matricula' => $request->matricula
            ]);
            return response()->json(['message' => 'Usuário cadastrado', 'user' => $user], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Não foi possível realizar a operação',
                'error' => $e
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'senha' => [
                'required',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()->letters()->symbols()
            ]
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        // tentativa de login 
        if (Auth::attempt(['email' => $request->email, 'password' => $request->senha])) {
            // pega o usuário autenticado
            $user = Auth::user();
            // se o usuário for admin, essa querry o retornará
            $isAdmin = DB::table('usuario_permissao')->select('*')
                ->join('usuario', 'usuario.id', '=', 'usuario_permissao.id_usuario')
                ->join('permissao', 'permissao.id', '=', 'usuario_permissao.id_permissao')
                ->where('permissao.id', '=', '5')->where('usuario.id', '=', $user['id'])->get();

            // se a querry estiver vazia, usuário não é admin
            if ($isAdmin->isEmpty()) {
                $token = $user->createToken('JWT');
                return response()->json([
                    'message' => 'Login efetuado',
                    'user' => $user,
                    'isAdmin' => false,
                    'token' => $token
                ], 200);

                // senão estiver, seu token terá a habilidade de admin
            } else {
                $token = $user->createToken('JWT', ['server:admin']);
                return response()->json([
                    'message' => 'Login efetuado',
                    'user' => $user,
                    'isAdmin' => true,
                    'token' => $token
                ], 200);
            }
        }

        return response()->json(['message' => 'Credenciais incorretas'], 401);
    }
    public function logout()
    {
        try {
            auth()->user()->tokens()->delete();
            return response()->json([], 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Não foi possível realizar a operação', 'errors' => $e], 500);
        }
    }
    // a rota só pode ser acessada por um token válido, quando acessada ela retorna true para authenticated
    public function verify()
    {
        return response()->json(['authenticated' => true], 200);
    }

    public function matheus()
    {
        return response()->json(['session' => $_SESSION['usuario']], 200);
    }
}
