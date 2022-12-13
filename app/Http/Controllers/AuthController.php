<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
            return response()->json(['error' => $validator->errors()], 400);
        }
        // tentativa de login 
        if (Auth::attempt(['email' => $request->email, 'password' => $request->senha])) {
            $user = Auth::user();
            $token = $user->createToken('JWT');
            return response()->json(['message' => 'Login efetuado', 'user' => $user, 'token' => $token], 200);
        }

        return response()->json(['message' => 'Credenciais incorretas'], 401);
    }
    public function logout()
    {
        try {
            auth()->user()->currentAccessToken()->delete();
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
}
