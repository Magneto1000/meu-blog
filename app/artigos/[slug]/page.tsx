import React from 'react';

export default function LerArtigo() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      
      {/* Cabeçalho Minimalista para Leitura */}
      <header className="py-6 px-4 md:px-12 max-w-4xl mx-auto flex justify-between items-center border-b border-gray-100">
        <a href="/" className="text-xl font-extrabold text-blue-900 hover:text-blue-700 transition">
          Juraci Tito Neto
        </a>
        <a href="/" className="text-gray-500 hover:text-gray-900 transition text-sm font-semibold">
          &larr; Voltar para Home
        </a>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6 md:px-0">
        
        {/* Cabeçalho do Artigo */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 block">Artigo Científico</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            A Importância da Visão Arquitetural na Programação Low-Code
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Juraci Nunes Tito Neto</span>
            <span>•</span>
            <span>20 Ago 2026</span>
          </div>
        </div>

        {/* Corpo do Texto */}
        <article className="prose prose-lg text-gray-700 leading-relaxed">
          <p className="mb-6 font-semibold text-xl text-gray-800">
            Resumo: Este artigo analisa a relevância dos padrões arquiteturais no desenvolvimento Low-Code, investigando como ferramentas de alta produtividade demandam a aplicação rigorosa de conceitos como Modularidade e Separação de Preocupações (SoC).
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Introdução</h2>
          <p className="mb-6">
            O cenário contemporâneo do desenvolvimento de software é marcado pela ascensão das plataformas de alta abstração, denominadas Low-Code. Essas ferramentas permitem a entrega acelerada de interfaces, mas essa agilidade superficial não substitui a necessidade de um design estruturado.
          </p>
          <p className="mb-6">
            Sem uma visão arquitetural de alto nível, os sistemas tendem a se tornar frágeis e incapazes de escalar, gerando o que chamamos de "Monólito Visual".
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. O Papel da Arquitetura</h2>
          <p className="mb-6">
            A aplicação da norma ISO/IEC 25010 revela que características como Manutenibilidade e Segurança são altamente vulneráveis em ambientes de alta abstração sem governança técnica.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
            <p className="font-mono text-sm text-blue-900">
              "A ausência de uma supervisão técnica transforma a agilidade do Low-Code em um multiplicador de riscos operacionais, automatizando dívidas técnicas em larga escala."
            </p>
          </div>
        </article>

      </main>
    </div>
  );
}