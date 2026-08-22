import React from 'react';

export default function Projetos() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Cabeçalho Menor para Páginas Internas */}
      <header className="bg-white shadow-sm py-4 px-4 md:px-12 flex justify-between items-center">
        <a href="/" className="text-2xl font-extrabold text-blue-900 hover:text-blue-700 transition">
          Juraci Tito Neto
        </a>
        <nav className="hidden md:flex gap-6 font-semibold">
          <a href="/" className="hover:text-blue-600 transition">Home</a>
          <a href="/projetos" className="text-blue-600 border-b-2 border-blue-600 pb-1">Projetos</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-4 md:px-0">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meus Projetos</h1>
          <p className="text-lg text-gray-600">
            Exploração prática de engenharia de software, automação, plataformas de descoberta e interfaces gamificadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* StartUUP */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold mb-2">StartUUP</h3>
            <p className="text-gray-600 mb-4">
              Plataforma incubadora focada no desenvolvimento de startups, aplicando a metodologia Lean Startup com marcos gamificados e estruturação ágil.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">Arquitetura</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">Lean Startup</span>
            </div>
          </div>

          {/* Over Power */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold mb-2">Over Power</h3>
            <p className="text-gray-600 mb-4">
              Aplicação web de gerenciamento de tarefas baseada em sistemas motivacionais e regras gamificadas, projetada para engajamento e produtividade.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">Gamificação</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">UX/UI</span>
            </div>
          </div>

          {/* CLAQUETTE */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold mb-2">CLAQUETTE</h3>
            <p className="text-gray-600 mb-4">
              Estudo de caso e aplicação de descoberta de mídia em vídeo, utilizando uma interface focada na fluidez de rolagem e impacto visual.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-semibold">Frontend</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-semibold">Media Discovery</span>
            </div>
          </div>

          {/* Magman */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold mb-2">Magman</h3>
            <p className="text-gray-600 mb-4">
              Jogo de lógica em navegador focado em exploração espacial planetária, com sistemas de pontuação e design responsivo (Mobile-First).
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-semibold">JavaScript</span>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-semibold">Game Logic</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}