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
      // 1. Busca o Artigo
      const { data: resArtigo } = await supabase
        .from('artigos')
        .select('*')
        .eq('id', idDoArtigo)
        .single(); 

      if (resArtigo) setArtigo(resArtigo);

      // 2. Busca Comentários deste artigo
      const { data: resComentarios } = await supabase
        .from('comentarios')
        .select('*')
        .eq('artigo_id', idDoArtigo)
        .order('created_at', { ascending: false });

      if (resComentarios) setComentarios(resComentarios);

      // 3. Registra ou Incrementa as Métricas de Visitas (oculto no front-end)
      const { data: resMetricas } = await supabase
        .from('metricas_visitas')
        .select('*')
        .eq('artigo_id', idDoArtigo)
        .single();

      if (resMetricas) {
        await supabase
          .from('metricas_visitas')
          .update({ contador: resMetricas.contador + 1 })
          .eq('id', resMetricas.id);
      } else {
        await supabase
          .from('metricas_visitas')
          .insert([{ artigo_id: idDoArtigo, contador: 1 }]);
      }

      setCarregando(false);
    };

    carregarTudo();
  }, [idDoArtigo]);

  const handleEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoTexto.trim()) return;

    setEnviando(true);
    const { data, error } = await supabase
      .from('comentarios')
      .insert([{ artigo_id: idDoArtigo, autor_nome: novoNome, texto: novoTexto }])
      .select();

    if (!error && data) {
      setComentarios([data[0], ...comentarios]);
      setNovoNome('');
      setNovoTexto('');
    } else {
      alert("Erro ao enviar comentário.");
    }
    setEnviando(false);
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-extrabold text-black mb-4">Artigo não encontrado</h1>
        <a href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition border-2 border-black">Voltar ao Início</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Navbar Superior */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="font-extrabold text-2xl text-black tracking-tight">
            UUP <span className="text-blue-600">Software</span>
          </a>
          <a href="/" className="text-sm font-bold text-black hover:underline transition flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-lg border border-black">
            &larr; Voltar à Página Inicial
          </a>
        </div>
      </nav>

      {/* Caixa de Exibição Principal */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
        <article className="bg-white border-2 border-black rounded-2xl p-8 md:p-14 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-12">
          
          <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            {artigo.categoria || 'Artigo'}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-8 leading-tight">
            {artigo.titulo}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 mb-10 border-y-2 border-black gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                {artigo.autor_nome ? artigo.autor_nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-bold text-black">{artigo.autor_nome || 'Autor da UUP'}</p>
                <p className="text-xs text-gray-600">{artigo.autor_email || 'suporte@uupsoftware.com'}</p>
              </div>
            </div>
            <div className="text-sm font-semibold text-black bg-gray-100 px-4 py-2 rounded-lg border border-black">
              Publicado em: {artigo.created_at ? new Date(artigo.created_at).toLocaleDateString('pt-BR') : 'Recente'}
            </div>
          </div>

          {artigo.capa_url && (
            <div className="mb-12">
              <div className="w-full h-72 md:h-[420px] rounded-xl overflow-hidden border-2 border-black">
                <img src={artigo.capa_url} alt={artigo.titulo} className="w-full h-full object-cover"/>
              </div>
            </div>
          )}

          {/* Área de Leitura (com o novo conversor de HTML do Rich Text Editor) */}
          <div 
            className="text-lg text-black leading-loose font-serif border-l-4 border-black pl-6 py-2 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:mb-4 [&>strong]:font-extrabold [&>a]:text-blue-600 [&>a]:underline"
            dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
          />

        </article>

        {/* Seção de Comentários */}
        <section className="bg-white border-2 border-black rounded-2xl p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-extrabold text-black mb-6">Comentários dos Leitores ({comentarios.length})</h3>

          {/* Formulário de Envio */}
          <form onSubmit={handleEnviarComentario} className="space-y-4 mb-10 pb-8 border-b-2 border-black">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-1 text-black">Seu Nome</label>
              <input 
                type="text" 
                required 
                value={novoNome} 
                onChange={(e) => setNovoNome(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium bg-white text-black focus:outline-none"
                placeholder="Ex: Maria Silva"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-1 text-black">Seu Comentário</label>
              <textarea 
                required 
                value={novoTexto} 
                onChange={(e) => setNovoTexto(e.target.value)}
                className="w-full h-28 px-4 py-2.5 border-2 border-black rounded-xl font-medium bg-white text-black focus:outline-none"
                placeholder="Escreva sua opinião sobre o artigo..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={enviando}
              className="bg-black text-white font-extrabold px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition"
            >
              {enviando ? 'Enviando...' : 'Publicar Comentário'}
            </button>
          </form>

          {/* Lista de Comentários */}
          <div className="space-y-4">
            {comentarios.length === 0 ? (
              <p className="text-gray-600 font-semibold italic">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            ) : (
              comentarios.map((c) => (
                <div key={c.id} className="bg-gray-50 border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-black">{c.autor_nome}</span>
                    <span className="text-xs text-gray-500 font-bold">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p className="text-gray-800 font-medium">{c.texto}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      <footer className="bg-black text-white py-8 text-center text-sm mt-auto border-t-2 border-black">
        <p>© 2026 UUP Software Solutions. Todos os direitos reservados.</p>
      </footer>
      
    </div>
  );
}