"use client";

import React, { useState } from 'react';
// Importando o nosso "motor" criado na pasta lib
import { supabase } from '../../../lib/supabase';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Variáveis para mostrar mensagens na tela
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Função que roda quando clicamos no botão
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    setCarregando(true);
    setMensagem('Conectando ao banco de dados...');

    // A mágica acontece aqui: enviando os dados para o Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha,
      options: {
        data: {
          nome_completo: nome,
        }
      }
    });

    if (error) {
      setMensagem('❌ Erro: ' + error.message);
    } else {
      setMensagem('✅ Sucesso! Conexão perfeita. Verifique o painel do Supabase!');
    }
    
    setCarregando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans py-12">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Criar Conta Autor</h1>
          <p className="text-gray-500 text-sm mt-2">Configure seu perfil para publicar artigos</p>
        </div>

        {/* O formulário agora chama a função handleCadastro */}
        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900 bg-white"
              placeholder="Juraci Tito Neto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900 bg-white"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha (Mínimo 6 caracteres)</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900 bg-white"
              placeholder="••••••••"
            />
          </div>

          {/* Exibe a mensagem de sucesso ou erro na tela */}
          {mensagem && (
            <div className={`p-3 rounded text-sm font-bold ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {mensagem}
            </div>
          )}

          <button 
            type="submit" 
            disabled={carregando}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition mt-4 ${carregando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'}`}
          >
            {carregando ? 'Conectando...' : 'Registrar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já possui uma conta? <a href="/admin" className="text-blue-600 hover:underline font-semibold">Faça Login</a>
          </p>
        </div>

      </div>
    </div>
  );
}