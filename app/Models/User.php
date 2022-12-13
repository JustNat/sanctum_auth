<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // quais colunas podem ser atribuidas valores
    protected $fillable = [
        'nome',
        'sobrenome',
        'cpf',
        'email',
        'senha',
        'status',
        'matricula'
    ];

    // quais colunas não podem ser mostradas em respostas
    protected $hidden = [
        'senha',
    ];

    // informa ao laravel a tabela que o model se refere
    protected $table = 'usuario';

    // diz ao laravel não criar as colunas created_at e updaded_at
    public $timestamps = false;

    // informa que nos métodos da classe Auth se utilize 'senha' ao invés de 'password'
    public function getAuthPassword()
    {
        return $this->senha;
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
