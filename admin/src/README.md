
# SmartPreço Admin Dashboard

Dashboard de administração do SmartPreço, desenvolvido em **Next.js** com foco em gerenciamento de produtos, mercados e preços. O painel é destinado à moderação, acompanhamento e geração de relatórios sobre os dados colaborativos inseridos pelos usuários no app mobile.

## 📁 Estrutura de Pastas

```
src/
├── api/                # Integrações com backend e definição de schemas (MSW/axios)
├── app/                # Estrutura das rotas (Next.js app router)
├── components/         # Componentes reutilizáveis e específicos do admin
├── hooks/              # React hooks customizados
├── lib/                # Funções utilitárias
├── mocks/              # Configuração de mocks para testes e desenvolvimento local
├── styles/             # Estilos globais
├── env.js              # Configurações de ambiente
├── i18n.config.ts      # Configuração de internacionalização
├── instrumentation.ts  # Observabilidade e métricas
├── middleware.ts       # Middlewares para rotas
└── ...
```

### Principais Módulos

* **api/**: Configuração de integração via Axios e endpoints tipados para Market, Price, Product e Report. Uso de MSW para mocks.
* **app/**: Rotas principais do admin (`/admin/products`, `/admin/markets`, `/admin/reports`), layouts e providers globais.
* **components/**: Dividido em subcomponentes por domínio (products, markets, reports) e componentes de UI próprios ou shadcn/ui.
* **mocks/**: Mock Service Worker para facilitar desenvolvimento sem backend ativo.

## 🚀 Tecnologias Utilizadas

* [Next.js](https://nextjs.org/) (App Router)
* [TypeScript](https://www.typescriptlang.org/)
* [MSW (Mock Service Worker)](https://mswjs.io/) para mocks de API
* [Axios](https://axios-http.com/) para requisições HTTP
* [shadcn/ui](https://ui.shadcn.com/) para componentes visuais e padrões de UI
* [i18next](https://www.i18next.com/) para internacionalização

## 🏗️ Funcionalidades

* **Gestão de Produtos**: Visualização, cadastro e edição de produtos.
* **Gestão de Mercados**: Gerenciamento de mercados cadastrados na plataforma.
* **Gestão de Preços**: Consulta e moderação dos preços submetidos.
* **Relatórios**: Visualização de dados agregados e exportação de relatórios.
* **Moderação**: Aprovação/rejeição de preços enviados por usuários.
* **Internacionalização**: Suporte a múltiplos idiomas.
* **Dark/Light Mode**: Alternância de tema pelo usuário.

## 💻 Rodando o Projeto Localmente

### 1. Pré-requisitos

* Node.js 18+
* Yarn ou npm

### 2. Instalação

```bash
# Instale as dependências
yarn install
# ou
npm install
```

### 3. Rodando em modo desenvolvimento

```bash
yarn dev
# ou
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000).

### 4. Testando com Mocks

O projeto utiliza [MSW](https://mswjs.io/) para simular as APIs durante o desenvolvimento. Os handlers podem ser encontrados em `src/api/generated/**` e configurados em `src/mocks/`.

## 🌎 Internacionalização

* Configure o idioma em `src/i18n.config.ts`.
* O provider de idioma pode ser alternado em tempo real pelo componente `language-toggle`.

## 📝 Contribuindo

1. Fork este repositório.
2. Crie uma branch: `git checkout -b feature/minha-nova-feature`
3. Commit suas alterações: `git commit -m 'feat: Minha nova feature'`
4. Push para a branch: `git push origin feature/minha-nova-feature`
5. Abra um Pull Request.

## 📦 Build para Produção

```bash
yarn build
# ou
npm run build
```
