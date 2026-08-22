# 🚀 UUP Software Workspace

Uma plataforma full-stack de alto desempenho para publicação de artigos, estudos de caso e insights sobre Engenharia de Software, Arquitetura de Sistemas e UX Engineering. 

Construído com uma arquitetura moderna e interface de alto contraste (focada em legibilidade prolongada e princípios de Gestalt), o sistema conta com um painel administrativo seguro, métricas em tempo real e gestão completa de conteúdo.

## ✨ Funcionalidades Principais

* **Painel Administrativo Blindado:** Sistema de autenticação via Supabase restrito por e-mail, garantindo que apenas a administração tenha acesso ao dashboard.
* **Editor Rich Text Avançado:** Criação de artigos com formatação HTML completa (negrito, itálico, listas, links) utilizando `react-quill-new` otimizado para React 19.
* **Métricas em Tempo Real:** Rastreamento invisível de visitantes únicos por artigo, atualizado dinamicamente no banco de dados.
* **Sistema de Engajamento:** Área de comentários nativa para leitores, com painel de moderação no dashboard do administrador.
* **Storage de Mídia:** Upload direto de imagens de capa (JPG/PNG) integrados ao Supabase Storage.
* **Apoio ao Projeto:** Widget lateral persistente com integração de chave PIX (QR Code dinâmico e funcionalidade copy-to-clipboard).
* **Design System Customizado:** UI moderna baseada em "cartões emoldurados", sombras sólidas, tipografia serifada para leitura e bordas de alto contraste.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** [Next.js](https://nextjs.org/) (React 19) e [Tailwind CSS](https://tailwindcss.com/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Back-end & BaaS:** [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Storage e Row Level Security)
* **Deploy & CI/CD:** [Vercel](https://vercel.com/)
* **Ícones & UI:** SVG nativo e tipografia focada em UX.

## ⚙️ Como executar o projeto localmente

Pré-requisitos: Node.js instalado no seu ambiente Windows e uma conta ativa no Supabase.

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SeuUsuario/uup-software.git](https://github.com/SeuUsuario/uup-software.git)