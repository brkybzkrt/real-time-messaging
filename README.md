# Real-Time Messaging API

A robust real-time messaging platform built with Node.js, Express, Socket.IO, MongoDB, Redis, and RabbitMQ.

## Features

- **Real-time messaging** using Socket.IO
- **User authentication** with JWT
- **Conversation management** (one-on-one and group chats)
- **Message persistence** with MongoDB
- **Caching** with Redis for improved performance
- **Rate limiting** to prevent API abuse
- **Automated messaging system** with cron jobs and RabbitMQ
- **API documentation** with Swagger
- **Containerized** with Docker and Docker Compose

## System Architecture

### Core Components

- **Express API**: RESTful API for user management, authentication, and message history
- **Socket.IO**: Real-time communication for instant messaging
- **MongoDB**: Primary database for storing users, conversations, and messages
- **Redis**: Caching layer and online user tracking
- **RabbitMQ**: Message queue for automated messaging system

### Automated Messaging System

The project includes an automated messaging system with three main components:

1. **Message Planning Service** (Cron Job - 02:00 AM)
   - Runs daily at 2:00 AM
   - Identifies active users and creates random message pairs
   - Schedules messages for delivery

2. **Message Queue Management** (Cron Job - Every Minute)
   - Checks for messages ready to be sent
   - Queues them in RabbitMQ

3. **Message Distribution Service** (RabbitMQ Consumer)
   - Consumes messages from the queue
   - Creates conversations if needed
   - Delivers messages to recipients via Socket.IO

## API Rate Limiting

The API implements a multi-tier rate limiting strategy:

- **Global Rate Limit**: 50 requests per 15 minutes per IP
- **Login Rate Limit**: 20 requests per 5 minutes specifically for login


## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd real-time-messaging
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the services with Docker Compose:
   ```
   docker-compose up -d
   ```

4. Start the application:
   ```
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/messaging?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Redis
REDIS_URL=redis://localhost:6379


# RabbitMQ
RABBITMQ_URL=amqp://admin:password@localhost:5672
QUEUE_MESSAGE_SEND=message_sending_queue
```

## API Documentation

API documentation is available via Swagger UI at `/api-docs` when the server is running.

## Docker Services

The project includes the following Docker services:

- **MongoDB**: Database server (port 27017)
- **Mongo Express**: MongoDB web interface (port 8081)
- **Redis**: In-memory cache (port 6379)
- **Redis Commander**: Redis web interface (port 8082)
- **RabbitMQ**: Message broker (port 5672)
- **RabbitMQ Management**: RabbitMQ web interface (port 15672)

## Project Structure

```
/src
  /config         # Configuration files
  /controllers    # API controllers
  /jobs           # Cron jobs for automated tasks
  /middleware     # Express middleware
  /models         # MongoDB models
  /rabbitmq       # RabbitMQ setup and consumers
  /routes         # API routes
  /socket         # Socket.IO event handlers
  /utils          # Utility functions
  index.js        # Application entry point
```

---

# Gerçek Zamanlı Mesajlaşma API'si

Node.js, Express, Socket.IO, MongoDB, Redis ve RabbitMQ ile oluşturulmuş güçlü bir gerçek zamanlı mesajlaşma platformu.

## Özellikler

- Socket.IO kullanarak **gerçek zamanlı mesajlaşma**
- JWT ile **kullanıcı kimlik doğrulama**
- **Konuşma yönetimi** (bire bir ve grup sohbetleri)
- MongoDB ile **mesaj kalıcılığı**
- Geliştirilmiş performans için Redis ile **önbelleğe alma**
- API suistimalini önlemek için **hız sınırlama**
- Cron işleri ve RabbitMQ ile **otomatik mesajlaşma sistemi**
- Swagger ile **API belgelendirmesi**
- Docker ve Docker Compose ile **konteynerleştirilmiş**

## Sistem Mimarisi

### Temel Bileşenler

- **Express API**: Kullanıcı yönetimi, kimlik doğrulama ve mesaj geçmişi için RESTful API
- **Socket.IO**: Anlık mesajlaşma için gerçek zamanlı iletişim
- **MongoDB**: Kullanıcıları, konuşmaları ve mesajları depolamak için birincil veritabanı
- **Redis**: Önbellek katmanı ve çevrimiçi kullanıcı takibi
- **RabbitMQ**: Otomatik mesajlaşma sistemi için mesaj kuyruğu

### Otomatik Mesajlaşma Sistemi

Proje, üç ana bileşene sahip bir otomatik mesajlaşma sistemi içerir:

1. **Mesaj Planlama Servisi** (Cron İşi - Sabah 02:00)
   - Her gün sabah 2:00'de çalışır
   - Aktif kullanıcıları belirler ve rastgele mesaj çiftleri oluşturur
   - Mesajları teslim için zamanlar

2. **Mesaj Kuyruğu Yönetimi** (Cron İşi - Her Dakika)
   - Gönderilmeye hazır mesajları kontrol eder
   - Bunları RabbitMQ'ya sıraya alır

3. **Mesaj Dağıtım Servisi** (RabbitMQ Tüketicisi)
   - Kuyruktan mesajları tüketir
   - Gerekirse konuşmalar oluşturur
   - Mesajları Socket.IO aracılığıyla alıcılara iletir

## API Hız Sınırlama

API, çok katmanlı bir hız sınırlama stratejisi uygular:

- **Genel Hız Sınırı**: IP başına 15 dakikada 50 istek
- **Giriş Hız Sınırı**: Özellikle giriş için 5 dakikada 20 istek

## Başlarken

### Ön Koşullar

- Node.js (v14+)
- Docker ve Docker Compose

### Kurulum

1. Depoyu klonlayın:
   ```
   git clone <repository-url>
   cd real-time-messaging
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. Docker Compose ile servisleri başlatın:
   ```
   docker-compose up -d
   ```

4. Uygulamayı başlatın:
   ```
   npm run dev
   ```

### Çevre Değişkenleri

Kök dizinde aşağıdaki değişkenlerle bir `.env` dosyası oluşturun:

```
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/messaging?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Redis
REDIS_URL=redis://localhost:6379


# RabbitMQ
RABBITMQ_URL=amqp://admin:password@localhost:5672
QUEUE_MESSAGE_SEND=message_sending_queue
```

## API Belgelendirmesi

API belgelendirmesi, sunucu çalışırken `/api-docs` adresinde Swagger UI aracılığıyla kullanılabilir.

## Docker Servisleri

Proje aşağıdaki Docker servislerini içerir:

- **MongoDB**: Veritabanı sunucusu (port 27017)
- **Mongo Express**: MongoDB web arayüzü (port 8081)
- **Redis**: Bellek içi önbellek (port 6379)
- **Redis Commander**: Redis web arayüzü (port 8082)
- **RabbitMQ**: Mesaj aracısı (port 5672)
- **RabbitMQ Management**: RabbitMQ web arayüzü (port 15672)

## Proje Yapısı

```
/src
  /config         # Yapılandırma dosyaları
  /controllers    # API kontrolcüleri
  /jobs           # Otomatik görevler için cron işleri
  /middleware     # Express ara yazılımları
  /models         # MongoDB modelleri
  /rabbitmq       # RabbitMQ kurulumu ve tüketicileri
  /routes         # API rotaları
  /socket         # Socket.IO olay işleyicileri
  /utils          # Yardımcı fonksiyonlar
  index.js        # Uygulama giriş noktası
```
