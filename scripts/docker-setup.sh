#!/bin/bash

# Script de configuração Docker para MozHost
echo "🐳 Configurando MozHost com Docker..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor, edite o arquivo .env com suas configurações antes de continuar."
    echo "   Pressione Enter quando estiver pronto..."
    read
else
    echo "✅ Arquivo .env já existe"
fi

# Função para escolher o ambiente
choose_environment() {
    echo "🌍 Escolha o ambiente:"
    echo "1) Desenvolvimento (com hot reload)"
    echo "2) Produção"
    read -p "Digite sua escolha (1 ou 2): " choice
    
    case $choice in
        1)
            echo "🚀 Iniciando ambiente de desenvolvimento..."
            docker-compose -f docker-compose.dev.yml up --build
            ;;
        2)
            echo "🚀 Iniciando ambiente de produção..."
            docker-compose up --build
            ;;
        *)
            echo "❌ Opção inválida. Saindo..."
            exit 1
            ;;
    esac
}

# Função para parar containers
stop_containers() {
    echo "🛑 Parando containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Containers parados"
}

# Menu principal
echo ""
echo "🔧 MozHost Docker Setup"
echo "1) Iniciar aplicação"
echo "2) Parar aplicação"
echo "3) Rebuild e iniciar"
echo "4) Ver logs"
echo "5) Sair"
echo ""

read -p "Digite sua escolha (1-5): " menu_choice

case $menu_choice in
    1)
        choose_environment
        ;;
    2)
        stop_containers
        ;;
    3)
        echo "🔨 Rebuild e iniciando..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        docker-compose build --no-cache
        docker-compose -f docker-compose.dev.yml build --no-cache
        choose_environment
        ;;
    4)
        echo "📋 Logs dos containers:"
        docker-compose logs -f
        ;;
    5)
        echo "👋 Saindo..."
        exit 0
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac