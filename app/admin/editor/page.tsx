"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; 
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditorArtigo() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Artigo Científico');
  const [capaUrl, setCapaUrl] = useState(''); 
  const [conteudo, setConteudo] = useState('');
  
  const [autorNome, setAutorNome] = useState('');
  const [autorEmail, setAutorEmail] = useState('');
  
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  useEffect(() => {
    const verificarAcessoEConfigurar = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const EMAIL_ADMIN = "magnetotito@gmail.com"; 
      
      if (!session || session.user.email !== EMAIL_ADMIN) {
        await supabase.auth.signOut();
        router.push('/admin');
        return;
      }
      
      setAutenticado(true);

      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      
      if (id) {
        setIdEdicao(id);
        carregarArtigoParaEdicao(id);
      }
    };

    verificarAcessoEConfigurar();
  }, [router]);

  const carregarArtigoParaEdicao = async (id: string) => {
    const { data, error } = await supabase.from('artigos').select('*').eq('id', id).single();
    if (data) {
      setTitulo(data.titulo || '');
      setCategoria(data.categoria || 'Artigo Científico');
      setCapaUrl(data.capa_url || '');
      setConteudo(data.conteudo || '');
      setAutorNome(data.autor_nome || '');
      setAutorEmail(data.autor_email || '');
    } else if (error) {
      setMensagem('❌ Erro ao carregar artigo: ' + error.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCarregando(true);
    setMensagem('Enviando imagem...');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('capas').upload(filePath, file);

    if (uploadError) {
      setMensagem('❌ Erro ao enviar imagem: ' + uploadError.message);
      setCarregando(false);
      return;
    }

    const { data } = supabase.storage.from('capas').getPublicUrl(filePath);
    if (data) {
      setCapaUrl(data.publicUrl);
      setMensagem('✅ Imagem carregada com sucesso!');
    }
    setCarregando(false);
  };

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!conteudo || conteudo === '<p><br></p>') {
      setMensagem('❌ O conteúdo do artigo não pode estar vazio.');
      return;
    }

    setCarregando(true);
    setMensagem('Salvando...');

    const dadosArtigo = {
      titulo, categoria, capa_url: capaUrl, conteudo,
      autor_nome: autorNome, autor_email: autorEmail, status: 'Publicado'
    };

    if (idEdicao) {
      const { error } = await supabase.from('artigos').update(dadosArtigo).eq('id', idEdicao);
      if (error) setMensagem('❌ Erro ao atualizar: ' + error.message);
      else setMensagem('✅ Sucesso! Artigo atualizado.');
    } else {
      const { error } = await supabase.from('artigos').insert([dadosArtigo]);
      if (error) setMensagem('❌ Erro ao publicar: ' + error.message);
      else {
        setMensagem('✅ Sucesso! Novo artigo publicado.');
        setTitulo(''); setCapaUrl(''); setConteudo(''); setAutorNome(''); setAutorEmail('');
      }
    }
    setCarregando(false);
  };

  if (!autenticado) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

  return (
    // Adicionado overflow-x-hidden e espaçamentos adaptáveis
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Ajuste do header para quebrar em coluna no celular */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black">{idEdicao ? 'Editar Artigo' : 'Novo Artigo'}</h1>
            <p className="text-gray-700 text-xs md:text-sm font-bold mt-1">Gerenciamento avançado de conteúdo.</p>
          </div>
          <button onClick={() => router.push('/admin/dashboard')} className="w-full md:w-auto px-6 py-2.5 text-black font-extrabold bg-gray-200 hover:bg-white border-2 border-black rounded-lg transition text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base">
            Voltar ao Dashboard
          </button>
        </header>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensagem}
          </div>
        )}

        <main className="bg-white p-5 md:p-10 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-full max-w-full overflow-hidden">
          <form onSubmit={handlePublicar} className="space-y-5 md:space-y-6 w-full">
            
            <div>
              <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Título do Artigo</label>
              <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full text-lg md:text-2xl px-4 py-3 border-2 border-black rounded-xl focus:outline-none font-bold text-black bg-white" placeholder="Ex: Arquitetura Orientada a Eventos" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div>
                <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Categoria</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none bg-white text-black font-extrabold cursor-pointer text-sm md:text-base">
                  <option>Artigo Científico</option>
                  <option>Opinião / UX Engineering</option>
                  <option>Estudo de Caso</option>
                  <option>Artigo de Opinião</option>
                </select>
              </div>
              <div className="w-full overflow-hidden">
                <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Capa do Artigo (JPG/PNG)</label>
               
                <input type="file" accept="image/jpeg, image/png" onChange={handleFileUpload} className="w-full px-3 py-2 border-2 border-black rounded-xl text-black font-bold bg-gray-50 file:mr-2 md:file:mr-4 file:py-2 file:px-2 md:file:px-4 file:rounded-lg file:border-2 file:border-black file:text-[10px] md:file:text-xs file:font-extrabold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer text-xs" />
                {capaUrl && <p className="text-[10px] md:text-xs text-green-700 font-extrabold mt-2">✔ Imagem carregada!</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pt-5 md:pt-6 border-t-2 border-black mt-5 md:mt-6">
              <div>
                <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Nome do Autor</label>
                <input type="text" required value={autorNome} onChange={(e) => setAutorNome(e.target.value)} className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none text-black font-bold bg-white text-sm md:text-base" placeholder="Ex: Túlio Costa" />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">E-mail do Autor</label>
                <input type="email" required value={autorEmail} onChange={(e) => setAutorEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none text-black font-bold bg-white text-sm md:text-base" placeholder="Ex: suporte@uupsoftware.com" />
              </div>
            </div>

            <div className="pt-5 md:pt-6 border-t-2 border-black mt-5 md:mt-6 max-w-full">
              <label className="block text-[10px] md:text-xs font-extrabold text-black uppercase tracking-wider mb-2">Conteúdo do Artigo</label>
              <div className="bg-white border-2 border-black rounded-xl overflow-x-auto overflow-y-hidden [&_.ql-toolbar]:border-b-2 [&_.ql-toolbar]:border-black [&_.ql-toolbar]:bg-gray-100 [&_.ql-toolbar]:min-w-[400px] [&_.ql-container]:border-none [&_.ql-editor]:min-h-[300px] md:[&_.ql-editor]:min-h-[400px] [&_.ql-editor]:text-base md:[&_.ql-editor]:text-lg [&_.ql-editor]:font-serif [&_.ql-editor]:text-black">
                <ReactQuill theme="snow" value={conteudo} onChange={setConteudo} placeholder="Escreva sua pesquisa aqui..." />
              </div>
            </div>

            <div className="flex justify-end pt-5 md:pt-6 border-t-2 border-black mt-5 md:mt-6">
              <button type="submit" disabled={carregando} className={`w-full md:w-auto text-white px-8 py-3.5 rounded-xl font-extrabold transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-sm md:text-base ${carregando ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
                {carregando ? 'Salvando...' : (idEdicao ? 'Atualizar Artigo' : 'Publicar Artigo')}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}