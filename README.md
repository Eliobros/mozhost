# MozHost - Plataforma de Gerenciamento de Servidores

MozHost é uma plataforma web para gerenciamento de servidores Docker, permitindo criar, gerenciar e monitorar contêineres de forma simples e intuitiva.

## 🚀 Funcionalidades

- ✅ Criação e gerenciamento de servidores Docker
- ✅ Terminal interativo para cada servidor
- ✅ Gerenciamento de arquivos dentro dos contêineres
- ✅ Controle de recursos (CPU, memória)
- ✅ Sistema de autenticação JWT
- ✅ Interface moderna com Tailwind CSS

## 🐳 Executando com Docker

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

### Configuração Inicial

1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd mozhost
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Para desenvolvimento:**
```bash
# Usando Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# Ou usando Docker diretamente
docker build -f Dockerfile.dev -t mozhost-dev .
docker run -p 3000:3000 -v $(pwd):/app mozhost-dev
```

4. **Para produção:**
```bash
# Usando Docker Compose
docker-compose up --build

# Ou usando Docker diretamente
docker build -t mozhost .
docker run -p 3000:3000 mozhost
```

### Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
mozhost/
├── app/                    # Next.js App Router
│   ├── api/               # APIs REST
│   └── servers/           # Páginas de servidores
├── components/            # Componentes React
├── models/               # Modelos MongoDB
├── lib/                  # Utilitários
├── Dockerfile            # Docker para produção
├── Dockerfile.dev        # Docker para desenvolvimento
├── docker-compose.yml    # Orquestração produção
└── docker-compose.dev.yml # Orquestração desenvolvimento
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

- `MONGODB_URI`: URI de conexão com MongoDB
- `JWT_SECRET`: Chave secreta para JWT
- `CMS_API_URL`: URL do serviço de gerenciamento de contêineres
- `MOZHOST_BEARER_TOKEN`: Token de autenticação do CMS
- `EMAIL_*`: Configurações de email para notificações

### CMS (Container Management Service)

O projeto depende de um serviço CMS externo para gerenciar contêineres Docker. Este serviço deve:

- Expor APIs REST para criar/gerenciar contêineres
- Gerenciar volumes e redes Docker
- Fornecer acesso ao terminal dos contêineres
- Gerenciar arquivos dentro dos contêineres

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
# Deploy via Vercel CLI ou GitHub integration
```

### Docker em Produção
```bash
docker-compose up -d
```

### VPS/Server
```bash
# Clone e configure
git clone <repo>
cd mozhost
cp .env.example .env
# Configure .env

# Build e execute
docker-compose up --build -d
```

## 📚 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB com Mongoose
- **Containerização**: Docker, Docker Compose
- **Autenticação**: JWT

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
