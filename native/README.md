# SmartPreço - Aplicativo de Comparação de Preços

Um aplicativo mobile desenvolvido com React Native e Expo que permite aos usuários comparar preços de produtos em diferentes mercados, ajudando a economizar nas compras do dia a dia.

## 📱 Funcionalidades

- **Cadastro de produtos** - Adicione produtos manualmente ou escaneie códigos de barras
- **Comparação de preços** - Compare o mesmo produto em diferentes estabelecimentos
- **Favoritos** - Marque produtos e mercados como favoritos para acesso rápido
- **Scanner de código de barras** - Adicione produtos facilmente escaneando o código de barras
- **Assistente IA** - Tire dúvidas e receba recomendações sobre economia e preços
- **Suporte ao usuário** - Seção de perguntas frequentes e formulário de contato

## 🚀 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Clerk Authentication](https://clerk.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native Paper](https://reactnativepaper.com/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zod](https://github.com/colinhacks/zod)

## 📂 Estrutura do Projeto

```
native/
├── app/                    # Rotas e telas do aplicativo
│   ├── (protected)/        # Rotas protegidas que exigem autenticação
│   │   ├── (tabs)/         # Rotas para a navegação em abas
│   │   └── _layout.tsx     # Layout para rotas protegidas
│   ├── (public)/           # Rotas públicas (login, registro)
│   └── _layout.tsx         # Layout principal do aplicativo
├── components/             # Componentes reutilizáveis
│   ├── add-product/        # Componentes para adição de produtos
│   ├── doubts-ia/          # Componentes para o assistente IA
│   ├── home/               # Componentes para a tela inicial
│   ├── product-details/    # Componentes para detalhes do produto
│   └── ui/                 # Componentes de UI genéricos
├── constants/              # Constantes do aplicativo (cores, temas)
├── contexts/               # Contextos React
├── hooks/                  # Hooks personalizados
├── services/               # Serviços (API, notificações)
├── styles/                 # Estilos do aplicativo
└── utils/                  # Funções utilitárias
```

## 📋 Principais Telas

1. **Home** - Lista produtos, favoritos e permite busca
2. **Adicionar Produto** - Wizard de 4 etapas para adicionar produtos e preços
3. **Detalhes do Produto** - Exibe informações e preços do produto em diferentes mercados
4. **Detalhes do Mercado** - Mostra informações do mercado e produtos disponíveis
5. **Scanner de Código de Barras** - Interface para escanear códigos
6. **Assistente IA** - Chat com IA para tirar dúvidas sobre preços e economia
7. **Suporte** - FAQ e formulário de contato

## 🔐 Autenticação

O aplicativo utiliza o Clerk para autenticação, oferecendo opções de:
- Registro com email/senha
- Login com conta Google
- Proteção de rotas para usuários autenticados

## 📱 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/smartpreco.git
cd smartpreco
```

2. Instale as dependências:
```bash
npm install
```

4. Execute o aplicativo:
```bash
npx expo start
```

## 📊 Gerenciamento de Estado

- **TanStack Query** para gerenciamento de estado do servidor e cache
- **React Context** para estado global da aplicação
- **Hooks personalizados** para lógica de negócios reutilizável

## 🔜 Funcionalidades Futuras

- [ ] Mapa de mercados próximos
- [ ] Modo offline
- [ ] Histórico de preços com gráficos
- [ ] Criação de lista de compras

## 👨‍💻 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do email: smartpreco@gmail.com