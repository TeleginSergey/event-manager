#!/bin/bash

echo "🚀 Запуск Event Manager с Docker Compose..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

mkdir -p logs

echo "📦 Запуск контейнеров..."
docker compose up -d

echo "⏳ Ожидание запуска базы данных..."
sleep 10

echo "🔍 Проверка статуса сервисов..."
docker compose ps

echo "✅ Event Manager запущен!"
echo "🌐 API доступен по адресу: http://localhost:3000"
echo "🗄️  База данных доступна по адресу: localhost:5432"
echo "📊 Redis доступен по адресу: localhost:6379"
echo ""
echo "📝 Полезные команды:"
echo "  docker compose logs -f app     # Просмотр логов приложения"
echo "  docker compose logs -f postgres # Просмотр логов базы данных"
echo "  docker compose down           # Остановка всех сервисов"
echo "  docker compose restart app    # Перезапуск приложения"
