# Hướng dẫn chạy Dự Án Mạng Xã Hội Syncify

## Yêu cầu
- Docker và Docker Compose đã được cài đặt trên hệ thống.

## Khởi chạy dự án
1. Mở terminal và di chuyển vào thư mục chứa file `docker-compose.yaml`.
2. Chạy lệnh sau để khởi động các service:
   ```sh
   docker compose up -d
   ```
3. Chờ một lúc để các container khởi động hoàn tất.

## Các service
Dự án gồm 3 service chính:
- **Admin**: Truy cập tại [http://localhost:8080](http://localhost:8080)
- **Client**: Truy cập tại [http://localhost:8081](http://localhost:8081)
- **Server**:
  - Cung cấp API với tài liệu Swagger tại [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
  - Xử lý các request từ admin và client

Ngoài ra, hệ thống còn sử dụng **Redis** làm bộ nhớ đệm và message broker để hỗ trợ giao tiếp giữa các service.

## Tài Khoản Mặc Định

- **Tài khoản Admin**:
  - Username: `zuy@gmail.com`
  - Password: `Admin1234`

- **Tài khoản User**:
  - Username: `maiduy190802@gmail.com`
  - Password: `Maiduy1908@@`

## Dừng Dự Án
Để dừng toàn bộ các container, chạy lệnh:
```sh
docker compose down
```

