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
            'name' => 'required',
            'email' => ['email', 'unique:users,email', 'required'],
            'password' => [
                'required', 'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()->letters()->symbols()->uncompromised()
            ]
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
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
            'password' => [
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
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
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
            return response()->json(['message' => 'Não foi possível realizar a operação'], 500);
        }
    }
    // a rota só pode ser acessada por um token válido, quando acessada ela retorna true para authenticated
    public function verify()
    {
        return response()->json(['authenticated' => true], 200);
    }
}
