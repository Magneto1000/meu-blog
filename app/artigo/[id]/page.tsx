"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function ArtigoCompleto() {
  const params = useParams();
  const idDoArtigo = params?.id as string;

  const [artigo, setArtigo] = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoTexto, setNovoTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!idDoArtigo) return;

    const carregarTudo = async () => {
      const { data: resArtigo } = await supabase.from('artigos').select('*').eq('id', idDoArtigo).single(); 
      if (resArtigo) setArtigo(resArtigo);

      const { data: resComentarios } = await supabase.from('comentarios').select('*').eq('artigo_id', idDoArtigo).order('created_at', { ascending: false });
      if (resComentarios) setComentarios(resComentarios);

      const { data: resMetricas } = await supabase.from('metricas_visitas').select('*').eq('artigo_id', idDoArtigo).single();
      if (resMetricas) {
        await supabase.from('metricas_visitas').update({ contador: resMetricas.contador + 1 }).eq('id', resMetricas.id);
      } else {
        await supabase.from('metricas_visitas').insert([{ artigo_id: idDoArtigo, contador: 1 }]);
      }
      setCarregando(false);
    };
    carregarTudo();
  }, [idDoArtigo]);

  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoTexto.trim()) return;
    setEnviando(true);
    const { data, error } = await supabase.from('comentarios').insert([{ artigo_id: idDoArtigo, autor_nome: novoNome, texto: novoTexto }]).select();
    if (!error && data) {
      setComentarios([data[0], ...comentarios]);
      setNovoNome(''); setNovoTexto('');
    } else {
      alert("Erro ao enviar comentário.");
    }
    setEnviando(false);
  };

  if (carregando) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
  if (!artigo) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4"><h1 className="text-4xl font-extrabold text-black mb-4">Artigo não encontrado</h1><a href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold border-2 border-black">Voltar ao Início</a></div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col overflow-x-hidden">
      
      {/* 
        A "CAMISA DE FORÇA" PARA O PC
        Oculta o vazamento no contêiner de leitura e força a tabela a rolar no Desktop!
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .leitura-artigo {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden; /* Isso proíbe a caixa de esticar no PC */
        }
        .leitura-artigo table {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important; /* Cria a barra de rolagem */
          white-space: nowrap !important;
          border-collapse: collapse !important;
          margin: 1.5rem 0 !important;
        }
        .leitura-artigo th, .leitura-artigo td {
          border: 2px solid #000 !important;
          padding: 0.75rem !important;
        }
        .leitura-artigo th {
          background-color: #f3f4f6 !important;
        }
        .leitura-artigo img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem !important;
        }
        .leitura-artigo a {
          word-break: break-all !important;
          color: #2563eb !important;
          text-decoration: underline !important;
        }
      `}} />

      <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <a href="/" className="font-extrabold text-xl md:text-2xl text-black tracking-tight">UUP <span className="text-blue-600">Software</span></a>
          <a href="/" className="text-xs md:text-sm font-bold text-black bg-gray-100 px-3 md:px-4 py-2 rounded-lg border border-black">&larr; Voltar</a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-8 md:py-12 flex-1">
        
        <article className="bg-white border-2 border-black rounded-2xl p-6 md:p-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12 w-full relative">
          
          <div className="inline-block bg-black text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            {artigo.categoria || 'Artigo'}
          </div>

          <h1 className="text-2xl md:text-5xl font-extrabold text-black mb-6 md:mb-8 leading-tight break-words">
            {artigo.titulo}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 mb-8 md:mb-10 border-y-2 border-black gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {artigo.autor_nome ? artigo.autor_nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-black truncate">{artigo.autor_nome || 'Autor da UUP'}</p>
                <p className="text-xs text-gray-600 truncate">{artigo.autor_email || 'suporte@uupsoftware.com'}</p>
              </div>
            </div>
            <div className="text-xs md:text-sm font-extrabold text-black bg-gray-100 px-4 py-2 rounded-lg border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Publicado em: {artigo.created_at ? new Date(artigo.created_at).toLocaleDateString('pt-BR') : 'Recente'}
            </div>
          </div>

          {artigo.capa_url && (
            <div className="mb-8 md:mb-12">
              <div className="w-full h-52 md:h-[420px] rounded-xl overflow-hidden border-2 border-black">
                <img src={artigo.capa_url} alt={artigo.titulo} className="w-full h-full object-cover"/>
              </div>
            </div>
          )}

          {/* O texto e a tabela ficam contidos dentro desta div com a classe 'leitura-artigo' */}
          <div 
            className="leitura-artigo text-base md:text-lg text-black leading-loose font-serif border-l-4 border-black pl-4 md:pl-6 py-2 break-words 
            [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 
            [&>h1]:text-2xl md:[&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:mb-4 
            [&>h2]:text-xl md:[&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:mb-4 
            [&>strong]:font-extrabold"
            dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
          />
        </article>

        <section className="bg-white border-2 border-black rounded-2xl p-6 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
          <h3 className="text-xl md:text-2xl font-extrabold text-black mb-6">Comentários ({comentarios.length})</h3>

          <form onSubmit={handleEnviarComentario} className="space-y-4 mb-8 md:mb-10 pb-8 border-b-2 border-black">
            <div>
              <label className="block text-[10px] md:text-xs font-extrabold uppercase tracking-wider mb-1 text-black">Seu Nome</label>
              <input type="text" required value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium text-black focus:outline-none" placeholder="Ex: Maria Silva" />
            </div>
            <div>
              <label className="block text-[10px] md:text-xs font-extrabold uppercase tracking-wider mb-1 text-black">Comentário</label>
              <textarea required value={novoTexto} onChange={(e) => setNovoTexto(e.target.value)} className="w-full h-24 px-4 py-2.5 border-2 border-black rounded-xl font-medium text-black focus:outline-none" placeholder="Escreva sua opinião..."></textarea>
            </div>
            <button type="submit" disabled={enviando} className="w-full md:w-auto bg-black text-white font-extrabold px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition">
              {enviando ? 'Enviando...' : 'Publicar'}
            </button>
          </form>

          <div className="space-y-4">
            {comentarios.length === 0 ? (
              <p className="text-gray-600 font-semibold italic">Nenhum comentário ainda.</p>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="bg-gray-50 border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] break-words">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-black truncate mr-2">{c.autor_nome}</span>
                    <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-gray-800 font-medium text-sm md:text-base">{c.texto}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-6 text-center text-xs mt-auto border-t-2 border-black w-full">
        <p>© 2026 UUP Software Solutions. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}