# Event Manager API

Система управления событиями с комплексными мерами безопасности.

## 🔒 Меры безопасности

- **JWT аутентификация** с защитой от брутфорс атак
- **Bcrypt хеширование** паролей
- **XSS и CSRF защита**
- **Rate limiting** и блокировка подозрительных IP
- **Валидация и санитизация** всех входных данных
- **Логирование безопасности** с мониторингом
- **Шифрование** чувствительных данных

## Требования

- Docker (для базы данных)
- Node.js и npm

---

## 🐳 Быстрый запуск с Docker

### Вариант 1: Полный запуск через Docker Compose (рекомендуется)

```bash
# Запуск всех сервисов одной командой
./scripts/start.sh

# Или вручную:
docker-compose up -d
```

### Вариант 2: Ручной запуск

```bash
# 1. Запуск PostgreSQL
docker run --name event-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=eventdb \
  -p 5432:5432 \
  -d postgres

# 2. Установка зависимостей
npm install

# 3. Запуск приложения
npm start
```

## 🛠️ Управление сервисами

```bash
# Запуск
./scripts/start.sh

# Остановка
./scripts/stop.sh

# Просмотр логов
docker-compose logs -f app

# Перезапуск приложения
docker-compose restart app

# Полная очистка (удаление данных)
docker-compose down -v
```

## 🧪 Тестирование

```bash
# Запуск тестов API
./scripts/test-api.sh

# Или вручную:
curl http://localhost:3000
```

## 🔐 Аутентификация

### Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "password": "SecurePass123"
  }'
```

### Вход в систему
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "SecurePass123"
  }'
```

### Использование токена
Все защищенные маршруты требуют JWT токен в заголовке:
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Шаг 4: Тестирование API Не работает с v0.0.1
Ожидаемые запросы и ответы (для разработки, обычным пользователя не читать! Конфидициальная информация, лан шучу, эщкере):
```bash
serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -d '{"title":"Go конференция","description":"Встреча программистов","date":"2025-10-20T10:00:00Z","organizerId":1,"CategoryId":1,"LocationId":1}'
{"message":"insert or update on table \"Events\" violates foreign key constraint \"Events_CategoryId_fkey\""}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -d '{"title":"Go конференция","description":"Встреча программистов","date":"2025-10-20T10:00:00Z","organizerId":1,"CategoryId":1,"LocationId":1}'
{"message":"insert or update on table \"Events\" violates foreign key constraint \"Events_CategoryId_fk
serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"Конференция"}'
{"id":2,"EventId":null,"inviteeId":null,"status":"pending","updatedAt":"2025-10-06T01:14:08.483Z","createdAt":"2025-10-06T01:14:08.483Z"}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"Конференция"}'
{"id":1,"name":"Конференция","updatedAt":"2025-10-06T01:16:45.164Z","createdAt":"2025-10-06T01:16:45.16
4Z"}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/events -H "Content-Type: application/json" -d '{"title":"Go конференция","description":"Встреча программистов","date":"2025-10-20T10:00:00Z","organizerId":1,"CategoryId":1,"LocationId":1}'
{"id":4,"title":"Go конференция","description":"Встреча программистов","date":"2025-10-20T10:00:00.000Z","organizerId":1,"CategoryId":1,"LocationId":1,"updatedAt":"2025-10-06T01:17:24.162Z","createdAt":"2025-10-06T01:17:24.162Z"}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl http://localhost:3000/api/e
vents                                           curl http://localhost:3000/api/events
[{"id":4,"title":"Go конференция","description":"Встреча программистов","date":"2025-10-20T10:00:00.000Z","createdAt":"2025-10-06T01:17:24.162Z","updatedAt":"2025-10-06T01:17:24.162Z","organizerId":1,"CategoryId":1,"LocationId":1,"organizer":{"id":1,"name":"Иван Петров","email":"ivan@example.com"},"Category":{"id":1,"name":"Конференция","createdAt":"2025-10-06T01:16:45.164Z","updatedAt":"2025-10-06T01:16:45.1
serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://localhost:3000/api/invitations -H "Content-Type: application/json" -d '{"EventId":4,"inviteeId":2}'
{"id":3,"EventId":4,"inviteeId":2,"status":"pending","updatedAt":"2025-10-06T01:18:26.643Z","createdAt"
:"2025-10-06T01:18:26.643Z"}serezha@fjord-Vivobocurl -X POST http://localhost:3000/api/invitations/1/accept000/api/invitations/1/accept
{"message":"Invitation accepted"}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl -X POST http://lo
calhost:3000/api/comments -H "Content-Type: applcurl -X POST http://localhost:3000/api/comments -H "Content-Type: application/json" -d '{"content":"Отличное мероприятие!","authorId":2,"EventId":4}'
{"id":1,"content":"Отличное мероприятие!","authorId":2,"EventId":4,"updatedAt":"2025-10-06T01:18:46.340Z","createdAt":"2025-10-06T01:18:46.340Z"}serezha@fjord-Vivobook:~/Desktop/event-manager$ curl http://l
ocalhost:3000/api/comments/event/4              curl http://localhost:3000/api/comments/event/4
```

