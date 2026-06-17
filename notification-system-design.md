# Notification System Design

## Stage 1 - API Design

I would create the following APIs:

* POST /notifications - Create a notification
* GET /notifications - Get all notifications
* GET /notifications/:id - Get a specific notification
* DELETE /notifications/:id - Delete a notification

Example notification:

```json
{
  "id": "N001",
  "sender": "Admin",
  "recipient": "Student",
  "message": "Exam tomorrow",
  "priority": 5
}
```

## Stage 2 - Database Design

I would use three tables:

### users

* id
* name
* email

### notifications

* id
* sender_id
* recipient_id
* message
* priority
* created_at

### notification_reads

* id
* notification_id
* user_id
* read_at

Indexes can be added on recipient_id and created_at to improve performance.

## Stage 3 - Query Optimization

To improve slow queries:

* Add indexes
* Use pagination
* Select only required columns instead of using SELECT *
* Avoid unnecessary database calls

## Stage 4 - Caching

Redis can be used to cache frequently accessed notifications.

Flow:

User → API → Redis → Database

Benefits:

* Faster response time
* Reduced database load

## Stage 5 - Notify All Students

For sending notifications to all students, I would use a queue.

Flow:

Admin → API → Queue → Workers → Students

RabbitMQ or Kafka can be used.

This helps handle a large number of users without slowing down the system.

## Stage 6 - Priority Inbox

Notifications should be sorted by:

1. Priority (High to Low)
2. Newest first

Example:

* High Priority
* Medium Priority
* Low Priority

This ensures important notifications are shown first.
