"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  
  const [artigos, setArtigos] = useState<any[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [totalVisitas, setTotalVisitas] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState<'artigos' | 'comentarios'>('artigos');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarAcessoEBuscarDados = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const EMAIL_ADMIN = "magnetotito@gmail.com"; 
      
      if (!session || session.user.email !== EMAIL_ADMIN) {
        await supabase.auth.signOut();
        router.push('/admin');
        return; 
      }

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
    if (!window.confirm("Deseja realmente excluir este artigo?")) return;
    const { error } = await supabase.from('artigos').delete().eq('id', id);
    if (!error) setArtigos(artigos.filter(a => a.id !== id));
    else alert("Erro ao excluir: " + error.message);
  };

  const handleExcluirComentario = async (id: string) => {
    if (!window.confirm("Deseja apagar este comentário?")) return;
    const { error } = await supabase.from('comentarios').delete().eq('id', id);
    if (!error) setComentarios(comentarios.filter(c => c.id !== id));
    else alert("Erro: " + error.message);
  };

  const handleSair = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center border-b-2 border-black">
        <h2 className="text-lg font-extrabold">UUP Admin</h2>
        <button onClick={handleSair} className="text-xs bg-white text-black px-3 py-1.5 rounded font-bold border-2 border-black">Sair</button>
      </div>

      <aside className="w-full md:w-64 bg-black text-white flex-col justify-between hidden md:flex border-r-2 border-black min-h-screen">
        <div>
          <div className="p-6 border-b-2 border-gray-800">
            <h2 className="text-xl font-extrabold tracking-wider text-white">UUP Software</h2>
          </div>
          <nav className="p-4 space-y-2">
            <button onClick={() => setAbaAtiva('artigos')} className={`w-full text-left px-4 py-2.5 rounded-lg font-extrabold transition border-2 border-black ${abaAtiva === 'artigos' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'bg-black text-gray-300 border-transparent hover:bg-gray-900'}`}>📝 Artigos</button>
            <button onClick={() => setAbaAtiva('comentarios')} className={`w-full text-left px-4 py-2.5 rounded-lg font-extrabold transition border-2 border-black ${abaAtiva === 'comentarios' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' : 'bg-black text-gray-300 border-transparent hover:bg-gray-900'}`}>💬 Comentários</button>
            <Link href="/" target="_blank" className="block px-4 py-2.5 text-gray-300 hover:bg-gray-900 rounded-lg transition font-bold">🌐 Ver Site Público</Link>
          </nav>
        </div>
        <div className="p-4 border-t-2 border-gray-800">
          <button onClick={handleSair} className="w-full block px-4 py-2.5 text-black bg-gray-200 hover:bg-white rounded-lg transition font-extrabold text-center border border-black">Sair</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-12 w-full max-w-full overflow-hidden">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b-2 border-black pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black">Painel de Autoria</h1>
          </div>
          <div className="flex gap-2 md:hidden w-full overflow-x-auto pb-2">
            <button onClick={() => setAbaAtiva('artigos')} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg border-2 border-black whitespace-nowrap">Artigos</button>
            <button onClick={() => setAbaAtiva('comentarios')} className="px-4 py-2 bg-gray-200 text-black text-xs font-bold rounded-lg border-2 border-black whitespace-nowrap">Comentários</button>
          </div>
          <Link href="/admin/editor" className="w-full md:w-auto text-center bg-black text-white px-6 py-3 rounded-xl font-extrabold hover:bg-gray-800 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black inline-flex items-center justify-center gap-2">
            <span>+</span> Novo Artigo
          </Link>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><h3 className="text-gray-600 text-[10px] md:text-xs font-extrabold uppercase mb-1 truncate">Publicados</h3><p className="text-2xl md:text-4xl font-extrabold text-black">{artigos.filter(a => a.status === 'Publicado').length}</p></div>
          <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><h3 className="text-gray-600 text-[10px] md:text-xs font-extrabold uppercase mb-1 truncate">Rascunhos</h3><p className="text-2xl md:text-4xl font-extrabold text-black">{artigos.filter(a => a.status !== 'Publicado').length}</p></div>
          <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><h3 className="text-gray-600 text-[10px] md:text-xs font-extrabold uppercase mb-1 truncate">Comentários</h3><p className="text-2xl md:text-4xl font-extrabold text-black">{comentarios.length}</p></div>
          <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><h3 className="text-gray-600 text-[10px] md:text-xs font-extrabold uppercase mb-1 truncate">Visitas Totais</h3><p className="text-2xl md:text-4xl font-extrabold text-blue-600">{totalVisitas}</p></div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-full overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b-2 border-black bg-gray-100">
            <h2 className="font-extrabold text-black text-base md:text-lg">{abaAtiva === 'artigos' ? 'Gerenciar Publicações' : 'Moderação'}</h2>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px] md:min-w-full">
              <thead>
                <tr className="border-b-2 border-black text-xs font-extrabold text-black uppercase tracking-wider bg-gray-50">
                  {abaAtiva === 'artigos' ? (
                    <>
                      <th className="px-4 md:px-6 py-4 text-black">Título</th>
                      <th className="px-4 md:px-6 py-4 text-black">Status</th>
                      <th className="px-4 md:px-6 py-4 text-black">Publicado Em</th>
                      <th className="px-4 md:px-6 py-4 text-right text-black">Ações</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 md:px-6 py-4 text-black">Leitor</th>
                      <th className="px-4 md:px-6 py-4 text-black">Artigo</th>
                      <th className="px-4 md:px-6 py-4 text-black">Comentário</th>
                      <th className="px-4 md:px-6 py-4 text-right text-black">Ações</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {abaAtiva === 'artigos' ? (
                  artigos.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center font-bold text-black">Nenhum artigo.</td></tr> :
                  artigos.map(a => (
                    <tr key={a.id} className="border-b border-black hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 font-bold text-black min-w-[250px] leading-relaxed">{a.titulo}</td>
                      <td className="px-4 md:px-6 py-4"><span className="px-3 py-1.5 rounded-full text-[10px] font-extrabold bg-black text-white">{a.status}</span></td>
                      {/* Data de Publicação formatada com pt-BR */}
                      <td className="px-4 md:px-6 py-4 text-xs font-extrabold text-gray-800 whitespace-nowrap">{a.created_at ? new Date(a.created_at).toLocaleDateString('pt-BR') : '--'}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={`/admin/editor?id=${a.id}`} className="text-black bg-gray-200 px-4 py-2 rounded-lg border-2 border-black font-extrabold text-xs hover:bg-black hover:text-white transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Editar</Link>
                          <button onClick={() => handleExcluirArtigo(a.id)} className="text-white bg-red-600 px-4 py-2 rounded-lg border-2 border-black font-extrabold text-xs hover:bg-red-700 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  comentarios.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center font-bold text-black">Nenhum comentário.</td></tr> :
                  comentarios.map(c => (
                    <tr key={c.id} className="border-b border-black hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4 font-bold text-black min-w-[150px]">{c.autor_nome}</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-extrabold text-blue-700 min-w-[200px] leading-relaxed">{c.artigos?.titulo}</td>
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-black min-w-[250px] leading-relaxed">{c.texto}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button onClick={() => handleExcluirComentario(c.id)} className="text-white bg-red-600 px-4 py-2 rounded-lg border-2 border-black font-extrabold text-xs hover:bg-red-700 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Remover</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}