# Instagram Lite - Docker Setup

Ứng dụng mạng xã hội Instagram clone chạy hoàn toàn trên Docker.

## 🚀 Cấu trúc

Project chạy với 3 services:
- **Database**: PostgreSQL (port 5432)
- **App**: Next.js application bao gồm Frontend + Backend API (port 3000)

## 📋 Yêu cầu

- Docker và Docker Compose
- Git

## 🛠️ Cài đặt và chạy

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd Instagram-lite
```

### Bước 2: Khởi động tất cả services

```bash
docker-compose up -d --build
```

Lần đầu sẽ mất vài phút để build image và download dependencies.

### Bước 3: Setup database

```bash
# Generate Prisma Client
docker-compose exec app npx prisma generate

# Chạy migrations
docker-compose exec app npx prisma migrate deploy
```

### Bước 4: Truy cập ứng dụng

Mở trình duyệt: **http://localhost:3000**

## 📝 Các lệnh hữu ích

### Quản lý containers

```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose down

# Dừng và xóa data
docker-compose down -v

# Rebuild khi có thay đổi
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Xem logs app
docker-compose logs -f app

# Xem logs database
docker-compose logs -f database
```

### Database operations

```bash
# Vào PostgreSQL shell
docker-compose exec database psql -U instagram_user -d instagram_lite

# Prisma Studio (quản lý database qua UI)
docker-compose exec app npx prisma studio --hostname 0.0.0.0
# Truy cập: http://localhost:5555

# Backup database
docker-compose exec database pg_dump -U instagram_user instagram_lite > backup.sql

# Restore database
docker-compose exec -T database psql -U instagram_user instagram_lite < backup.sql
```

### Development

```bash
# Vào shell của app container
docker-compose exec app sh

# Chạy Prisma commands
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate
```

## 🗂️ Cấu trúc Project

```
Instagram-lite/
├── app/              # Next.js App Router
│   ├── api/          # Backend API routes
│   ├── components/   # React components
│   └── ...           # Frontend pages
├── lib/              # Utilities
├── prisma/           # Database schema
├── public/           # Static files
├── Dockerfile        # Docker image cho app
├── docker-compose.yml # Docker orchestration
└── .dockerignore     # Files ignore khi build
```

## ⚙️ Environment Variables

Các biến môi trường đã được cấu hình trong `docker-compose.yml`:

- `DATABASE_URL`: Kết nối PostgreSQL
- `NEXTAUTH_SECRET`: Secret key cho authentication
- `NODE_ENV`: Development mode

## 🔧 Troubleshooting

### Port đã được sử dụng

Đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay vì 3000:3000
```

### Lỗi kết nối database

Kiểm tra database đã sẵn sàng:
```bash
docker-compose ps
docker-compose logs database
```

### Rebuild từ đầu

```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

## 📦 Lưu ý

- **Không cần cài node_modules** vào máy - tất cả chạy trong Docker
- **Database data** được lưu trong Docker volume `postgres_data`
- **Hot reload** hoạt động bình thường nhờ volume mount
- **node_modules** được ignore bởi `.gitignore`

## 🎯 Tính năng

- ✅ Đăng ký/Đăng nhập
- ✅ Đăng bài viết với ảnh
- ✅ Like bài viết
- ✅ Comment và Reply
- ✅ Profile page
- ✅ News feed
