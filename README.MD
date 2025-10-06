# Event Manager

## Требования

- Docker (для базы данных)
- Node.js и npm

---

## Шаг 1: Запуск Postgres в Docker

Откройте терминал и выполните команду для запуска контейнера с PostgreSQL:

```bash
docker run --name event-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=eventdb -p 5432:5432 -d postgres
```

## Шаг 2: Клонирование проекта и установка зависимостей

```bash
git clone https://github.com/TeleginSergey/event-manager.git event-manager
cd event-manager
npm install
```

## Шаг 3: Запуск сервера

Запустите сервер командой:
```bash
node server.js
```

## Шаг 4: Тестирование API
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

