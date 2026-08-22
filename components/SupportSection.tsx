import React from 'react';

export default function SupportSection() {
  return (
    <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg mt-12 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <h3 className="text-2xl font-bold mb-4">Apoie meu trabalho</h3>
        <p className="text-gray-200 mb-4">
          Se os meus artigos, pesquisas e projetos open-source te ajudaram de alguma forma, considere fazer uma doação. 
          Seu apoio financia novos estudos científicos e o desenvolvimento de novas soluções estruturais.
        </p>
        <div className="bg-blue-800 p-3 rounded-lg inline-block">
          <p className="font-mono text-sm tracking-wide">Chave PIX: titojneto@gmail.com</p>
        </div>
      </div>
      
      {/* Área do QR Code */}
      <div className="md:w-1/3 flex justify-center bg-white p-4 rounded-lg">
        {/* Futuramente, salve a imagem do seu QR code na pasta public/img/ e ajuste o caminho abaixo */}
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-center border-2 border-dashed border-gray-400">
          Coleque seu<br />QR Code aqui
        </div>
      </div>
    </div>
  );
}