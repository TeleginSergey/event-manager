#!/bin/bash

echo "🧪 Тестирование Event Manager API..." # Пока в разработке... делай братик делай

# Ждем запуска приложения
echo "⏳ Ожидание запуска приложения..."
sleep 15

# Тестируем базовый endpoint
echo "🔍 Тестирование базового endpoint..."
curl -s http://localhost:3000/ || echo "❌ Приложение не отвечает"

echo ""
echo "📝 Примеры тестирования API:"
echo ""
echo "1. Регистрация пользователя:"
echo "curl -X POST http://localhost:3000/api/users/register \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Тест Тестов\",\"email\":\"test@example.com\",\"password\":\"TestPass123\"}'"
echo ""
echo "2. Вход в систему:"
echo "curl -X POST http://localhost:3000/api/users/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"TestPass123\"}'"
echo ""
echo "3. Получение профиля (требует токен):"
echo "curl -X GET http://localhost:3000/api/users/profile \\"
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN'"
echo ""
echo "4. Создание события (требует токен):"
echo "curl -X POST http://localhost:3000/api/events \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \\"
echo "  -d '{\"title\":\"Тестовое событие\",\"description\":\"Описание\",\"date\":\"2024-12-31T18:00:00.000Z\"}'"
