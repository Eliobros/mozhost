# 🐳 Docker - MozHost

Este documento explica como usar Docker com o projeto MozHost.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Início Rápido

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd mozhost
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Execute o script de setup (recomendado)
```bash
./scripts/docker-setup.sh
```

### 4. Ou execute manualmente
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Produção
docker-compose up --build
```

## 🏗️ Arquitetura Docker

### Serviços

1. **mozhost-app** - Aplicação Next.js principal
2. **mongodb** - Banco de dados (opcional, pode usar MongoDB Atlas)
3. **cms** - Container Management Service (gerencia contêineres Docker)
4. **nginx** - Proxy reverso (opcional)

### Redes

- `mozhost-network` - Rede interna para comunicação entre serviços

### Volumes

- `mongodb_data` - Dados persistentes do MongoDB
- `cms_data` - Dados persistentes do CMS

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MONGODB_URI` | URI de conexão MongoDB | `mongodb://admin:password@mongodb:27017/mozhost` |
| `JWT_SECRET` | Chave secreta JWT | `your-super-secret-key` |
| `CMS_API_URL` | URL do CMS | `http://cms:3001` |
| `MOZHOST_BEARER_TOKEN` | Token do CMS | `your-bearer-token` |

### Portas

| Serviço | Porta Interna | Porta Externa |
|---------|---------------|---------------|
| Next.js App | 3000 | 3000 |
| MongoDB | 27017 | 27017 |
| CMS | 3001 | 3001 |
| Nginx | 80, 443 | 80, 443 |

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Parar ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Produção
```bash
# Iniciar ambiente de produção
docker-compose up --build -d

# Parar ambiente de produção
docker-compose down

# Ver logs
docker-compose logs -f
```

### Manutenção
```bash
# Rebuild sem cache
docker-compose build --no-cache

# Limpar volumes (CUIDADO: perde dados)
docker-compose down -v

# Executar comandos dentro do container
docker-compose exec mozhost-app npm run lint

# Backup do MongoDB
docker-compose exec mongodb mongodump --out /backup
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep :3000
   
   # Parar processo na porta
   sudo kill -9 <PID>
   ```

2. **Permissões Docker**
   ```bash
   # Adicionar usuário ao grupo docker
   sudo usermod -aG docker $USER
   # Faça logout e login novamente
   ```

3. **Volumes não montam**
   ```bash
   # Verificar volumes
   docker volume ls
   
   # Remover volume corrompido
   docker volume rm mozhost_mongodb_data
   ```

4. **Build falha**
   ```bash
   # Limpar cache Docker
   docker system prune -a
   
   # Rebuild com no-cache
   docker-compose build --no-cache
   ```

### Logs de Debug

```bash
# Ver logs detalhados
docker-compose logs -f --tail=100

# Ver logs de um serviço específico
docker-compose logs -f mozhost-app

# Ver logs com timestamps
docker-compose logs -f -t
```

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite arquivos .env**
   ```bash
   # .env está no .gitignore
   # Use .env.example como template
   ```

2. **Use secrets para produção**
   ```bash
   # Em produção, use Docker secrets ou variáveis de ambiente seguras
   export JWT_SECRET=$(openssl rand -base64 32)
   ```

3. **Limite permissões**
   ```bash
   # O CMS precisa de acesso ao Docker socket
   # Outros serviços não precisam de privilégios especiais
   ```

4. **Atualize imagens regularmente**
   ```bash
   # Verificar atualizações
   docker-compose pull
   
   # Atualizar e rebuild
   docker-compose pull && docker-compose up --build
   ```

## 📊 Monitoramento

### Health Checks

```bash
# Verificar status dos containers
docker-compose ps

# Verificar recursos
docker stats

# Verificar logs de health check
docker-compose logs --tail=50 | grep -i health
```

### Métricas

```bash
# Uso de CPU e memória
docker stats --no-stream

# Uso de disco
docker system df

# Imagens não utilizadas
docker images --filter "dangling=true"
```

## 🚀 Deploy em Produção

### VPS/Server

1. **Clone e configure**
   ```bash
   git clone <repo>
   cd mozhost
   cp .env.example .env
   # Configure .env para produção
   ```

2. **Build e execute**
   ```bash
   docker-compose up --build -d
   ```

3. **Configure proxy reverso (opcional)**
   ```bash
   # Use nginx ou traefik para SSL e load balancing
   ```

### Cloud (AWS, GCP, Azure)

1. **Use Docker Compose com cloud provider**
2. **Configure secrets management**
3. **Use load balancer para alta disponibilidade**

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [MongoDB Docker](https://hub.docker.com/_/mongo)