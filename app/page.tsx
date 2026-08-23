"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [artigos, setArtigos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [copiado, setCopiado] = useState(false);

  // A chave PIX real da sua empresa/projeto
  const chavePix = "uupsoftwaresolutions@gmail.com";

  useEffect(() => {
    const buscarArtigosPublicos = async () => {
      const { data, error } = await supabase
        .from('artigos')
        .select('*')
        .eq('status', 'Publicado'); 
      
      if (error) {
        console.error("Erro ao carregar os artigos:", error.message);
      } else if (data) {
        setArtigos(data);
      }
      setCarregando(false);
    };

    buscarArtigosPublicos();
  }, []);

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); 
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Navegação Superior */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-extrabold text-2xl text-black tracking-tight">
            UUP <span className="text-blue-600">Software</span> Solutions
          </div>
          <div className="space-x-6 text-sm font-bold text-black hidden md:flex items-center">
            <Link href="/" className="hover:underline">Início</Link>
            <Link href="#artigos" className="hover:underline">Artigos</Link>
          </div>
          <Link href="/admin" className="text-sm font-bold text-black bg-gray-100 border-2 border-black px-4 py-2 rounded-lg hover:bg-gray-200 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Área do Autor
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-black text-white py-16 px-6 border-b-2 border-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Explorando o Futuro da <br/>Engenharia de Software
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Artigos, estudos de caso e insights sobre UX Engineering, arquitetura de sistemas e metodologias ágeis.
          </p>
        </div>
      </header>

      {/* Layout Principal Dividido (Artigos na esquerda, Sidebar PIX na direita) */}
      <main id="artigos" className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Coluna da Esquerda: Lista de Artigos */}
        <div className="lg:col-span-3">
          <div className="mb-8 pb-4 border-b-2 border-black flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-black">Últimas Publicações</h2>
              <p className="text-sm text-gray-600">Conteúdos técnicos revisados pela equipe.</p>
            </div>
            <div className="h-2 w-12 bg-black rounded"></div>
          </div>

          {carregando ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
          ) : artigos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-black font-semibold">Nenhum artigo publicado no momento. Volte em breve!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artigos.map((artigo) => (
                <article key={artigo.id} className="bg-white rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                  
                  <div className="h-44 bg-gray-200 overflow-hidden relative border-b-2 border-black">
                    {artigo.capa_url ? (
                      <img 
                        src={artigo.capa_url} 
                        alt={artigo.titulo} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-black font-extrabold text-lg">UUP</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-black">
                      {artigo.categoria || 'Artigo'}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-gray-600 text-xs font-bold mb-2 flex items-center justify-between">
                        <span>{artigo.created_at ? new Date(artigo.created_at).toLocaleDateString('pt-BR') : 'Recente'}</span>
                        <span className="text-black">{artigo.autor_nome || 'UUP Software'}</span>
                      </div>
                      <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
                        {artigo.titulo}
                      </h3>
                  <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {artigo.conteudo ? artigo.conteudo.replace(/<[^>]*>?/gm, '') : ''}
                  </p>    
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <Link href={`/artigo/${artigo.id}`} className="text-black font-extrabold text-xs hover:underline flex items-center gap-1 w-fit bg-gray-100 px-3 py-2 rounded border border-black">
                        Ler artigo completo 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Coluna da Direita: Card PIX Lateral Estilizado */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center text-center">
            
            <div className="bg-black text-white p-2.5 rounded-xl mb-3 border border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-extrabold text-black mb-2">Apoie o Projeto</h3>
            <p className="text-xs text-gray-700 mb-6 leading-relaxed font-medium">
              Contribua para manter a UUP Software ativa e produzindo conteúdos e ferramentas gratuitas.
            </p>

            {/* QR Code com borda marcante */}
            <div className="w-32 h-32 bg-white rounded-xl border-2 border-black flex items-center justify-center mb-5 p-2 shadow-sm">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${chavePix}`} 
                alt="QR Code PIX" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full text-left">
              <label className="block text-[11px] font-extrabold text-black uppercase tracking-wider mb-1">
                Chave PIX (E-mail)
              </label>
              <div className="flex items-center bg-gray-50 border-2 border-black rounded-lg overflow-hidden">
                <input 
                  type="text" 
                  readOnly 
                  value={chavePix} 
                  className="w-full bg-transparent text-xs text-black font-bold px-2.5 py-2 outline-none select-all" 
                />
                <button 
                  onClick={handleCopiarPix}
                  className={`px-3 py-2 transition font-extrabold text-xs flex-shrink-0 border-l-2 border-black ${copiado ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  {copiado ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

          </div>
        </aside>

      </main>

      {/* Rodapé */}
      <footer className="bg-black text-white py-6 text-center text-xs mt-auto border-t-2 border-black">
        <p>© 2026 UUP Software Solutions. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}