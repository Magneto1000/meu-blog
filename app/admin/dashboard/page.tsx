"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Adicionamos o roteador
import { supabase } from '../../../lib/supabase';

export default function Dashboard() {
  const router = useRouter(); // Inicializando o roteador para expulsar invasores
  
  const [artigos, setArtigos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [totalVisitas, setTotalVisitas] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState<'artigos' | 'comentarios'>('artigos');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. O Guarda de Segurança: Verifica se o usuário está logado
    const verificarAcessoEBuscarDados = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Se não tiver sessão (não fez login), joga de volta pro login
        router.push('/admin');
        return; // Para a execução do código aqui
      }

      // Se passou pelo guarda, carrega os dados normalmente
      buscarDadosDashboard();
    };

    verificarAcessoEBuscarDados();
  }, [router]);

  const buscarDadosDashboard = async () => {
    setCarregando(true);
    const { data: resArtigos } = await supabase.from('artigos').select('*');
    if (resArtigos) setArtigos(resArtigos);

    const { data: resComentarios } = await supabase.from('comentarios').select('*, artigos(titulo)');
    if (resComentarios) setComentarios(resComentarios);

    const { data: resMetricas } = await supabase.from('metricas_visitas').select('contador');
    if (resMetricas) {
      const soma = resMetricas.reduce((acc, curr) => acc + (curr.contador || 0), 0);
      setTotalVisitas(soma);
    }
    setCarregando(false);
  };

  const handleExcluirArtigo = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este artigo e todos os dados associados?")) return;
    const { error } = await supabase.from('artigos').delete().eq('id', id);
    if (!error) setArtigos(artigos.filter(a => a.id !== id));
    else alert("Erro ao excluir: " + error.message);
  };

  const handleExcluirComentario = async (id: string) => {
    if (!window.confirm("Deseja apagar este comentário?")) return;
    const { error } = await supabase.from('comentarios').delete().eq('id', id);
    if (!error) setComentarios(comentarios.filter(c => c.id !== id));
    else alert("Erro ao excluir comentário: " + error.message);
  };

  const handleSair = async () => {
    await supabase.auth.signOut(); // Desloga de verdade no Supabase
    router.push('/admin');
  };

  const totalPublicados = artigos.filter(a => a.status === 'Publicado').length;
  const totalRascunhos = artigos.filter(a => a.status !== 'Publicado').length;

  // Se estiver carregando (verificando a segurança), mostra uma tela branca pra não vazar nada
  if (carregando) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className="w-64 bg-black text-white flex flex-col justify-between hidden md:flex border-r-2 border-black">
        <div>
          <div className="p-6 border-b-2 border-gray-800">
            <h2 className="text-xl font-extrabold tracking-wider text-white">UUP Software</h2>
            <p className="text-gray-400 text-xs mt-1 uppercase font-bold">Painel Administrativo</p>
          </div>
          <nav className="p-4 space-y-2">
            <button onClick={() => setAbaAtiva('artigos')} className={`w-full text-left px-4 py-2.5 rounded-lg font-extrabold transition border-2 border-black ${abaAtiva === 'artigos' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'bg-black text-gray-300 border-transparent hover:bg-gray-900'}`}>📝 Meus Artigos</button>
            <button onClick={() => setAbaAtiva('comentarios')} className={`w-full text-left px-4 py-2.5 rounded-lg font-extrabold transition border-2 border-black ${abaAtiva === 'comentarios' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'bg-black text-gray-300 border-transparent hover:bg-gray-900'}`}>💬 Comentários ({comentarios.length})</button>
            <Link href="/" target="_blank" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-900 rounded-lg transition font-bold">🌐 Ver Site Público</Link>
          </nav>
        </div>
        <div className="p-4 border-t-2 border-gray-800">
          <button onClick={handleSair} className="w-full block px-4 py-2.5 text-black bg-gray-200 hover:bg-white rounded-lg transition font-extrabold text-center border border-black">
            Sair (Logout)
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-x-auto">
        <header className="flex justify-between items-center mb-10 border-b-2 border-black pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-black">Painel de Autoria e Métricas</h1>
            <p className="text-gray-700 text-sm font-medium">Monitore acessos, engajamento e publicações.</p>
          </div>
          <Link href="/admin/editor" className="bg-black text-white px-6 py-3 rounded-xl font-extrabold hover:bg-gray-800 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black inline-flex items-center gap-2">
            <span>+</span> Novo Artigo
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-gray-600 text-xs font-extrabold uppercase tracking-wider mb-1">Publicados</h3>
            <p className="text-4xl font-extrabold text-black">{totalPublicados}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-gray-600 text-xs font-extrabold uppercase tracking-wider mb-1">Rascunhos</h3>
            <p className="text-4xl font-extrabold text-black">{totalRascunhos}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-gray-600 text-xs font-extrabold uppercase tracking-wider mb-1">Comentários</h3>
            <p className="text-4xl font-extrabold text-black">{comentarios.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-gray-600 text-xs font-extrabold uppercase tracking-wider mb-1">Visualizações Totais</h3>
            <p className="text-4xl font-extrabold text-blue-600">{totalVisitas}</p>
          </div>
        </div>

        {abaAtiva === 'artigos' ? (
          <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-black bg-gray-100 flex justify-between items-center"><h2 className="font-extrabold text-black text-lg">Gerenciar Publicações</h2></div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs font-extrabold text-black uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-4">Título do Artigo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {artigos.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-600 font-bold">Nenhum artigo encontrado.</td></tr>
                ) : (
                  artigos.map((artigo) => (
                    <tr key={artigo.id} className="border-b border-black hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-black">{artigo.titulo}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-extrabold border border-black ${artigo.status === 'Publicado' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>{artigo.status || 'Publicado'}</span></td>
                      <td className="px-6 py-4 text-gray-700 text-sm font-semibold">{artigo.created_at ? new Date(artigo.created_at).toLocaleDateString('pt-BR') : '--'}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3 items-center">
                        <Link href={`/admin/editor?id=${artigo.id}`} className="text-black bg-gray-100 px-3 py-1.5 rounded-lg border border-black font-extrabold text-xs hover:bg-black hover:text-white transition">Editar</Link>
                        <button onClick={() => handleExcluirArtigo(artigo.id)} className="text-white bg-red-600 px-3 py-1.5 rounded-lg border border-black font-extrabold text-xs hover:bg-red-700 transition">Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-black bg-gray-100"><h2 className="font-extrabold text-black text-lg">Moderação de Comentários</h2></div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs font-extrabold text-black uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-4">Leitor</th>
                  <th className="px-6 py-4">Artigo Vinculado</th>
                  <th className="px-6 py-4">Comentário</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-600 font-bold">Nenhum comentário recebido.</td></tr>
                ) : (
                  comentarios.map((c) => (
                    <tr key={c.id} className="border-b border-black hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-black">{c.autor_nome}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-800">{c.artigos?.titulo || 'Removido'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 max-w-md truncate">{c.texto}</td>
                      <td className="px-6 py-4 text-right"><button onClick={() => handleExcluirComentario(c.id)} className="text-white bg-red-600 px-3 py-1.5 rounded-lg border border-black font-extrabold text-xs hover:bg-red-700 transition">Remover</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}