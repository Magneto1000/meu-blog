"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem('Verificando credenciais...');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      setMensagem('❌ Erro: E-mail ou senha incorretos.');
      setCarregando(false);
    } else {
      setMensagem('✅ Sucesso! Redirecionando...');
      router.push('/admin/dashboard');
    }
  };

  return (
    // Adicionado overflow-x-hidden para garantir que as sombras não quebrem a tela no mobile
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4 md:p-6 overflow-x-hidden">
      
      {/* Sombra e padding reduzidos no mobile, aumentando no desktop */}
      <div className="bg-white p-6 md:p-10 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mx-auto">
        
        <div className="text-center mb-8 pb-6 border-b-2 border-black">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">Acesso ao Painel</h1>
          <p className="text-gray-600 text-xs md:text-sm mt-1 font-bold">UUP Software Workspace</p>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-xl text-xs md:text-sm font-extrabold text-center border-2 border-black ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none text-black font-medium bg-white text-sm md:text-base"
              placeholder="admin@uupsoftware.com"
            />
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Senha</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none text-black font-medium bg-white text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className={`w-full text-white font-extrabold py-3.5 px-4 rounded-xl transition mt-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base ${carregando ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
          >
            {carregando ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-black text-center">
          <p className="text-[10px] md:text-xs font-bold text-gray-700">
            Voltar para a <Link href="/" className="text-black font-extrabold underline hover:text-blue-600">Página Inicial</Link>
          </p>
        </div>

      </div>
    </div>
  );
}