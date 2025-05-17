# 接口文档

## **1. 用户注册**
- **URL**: `/register`
- **方法**: `POST`
- **描述**: 用户通过用户名和密码注册。
- **请求头**:
  - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string"  // 密码
  }
  ```
- **响应**:
  - **成功**:
    ```json
    {
      "message": "注册成功！"
    }
    ```
  - **失败**:
    ```json
    {
      "error": "用户名已被注册！"
    }
    ```
- **状态码**:
  - `201 Created`: 注册成功
  - `400 Bad Request`: 请求体缺少必填字段或用户名已存在
  - `500 Internal Server Error`: 服务器错误

---

## **2. 用户登录**
- **URL**: `/login`
- **方法**: `POST`
- **描述**: 用户通过用户名和密码登录，返回 JWT。
- **请求头**:
  - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string"  // 密码
  }
  ```
- **响应**:
  - **成功**:
    ```json
    {
      "message": "登录成功！",
      "token": "string" // JWT
    }
    ```
  - **失败**:
    ```json
    {
      "error": "用户名或密码错误！"
    }
    ```
- **状态码**:
  - `200 OK`: 登录成功
  - `400 Bad Request`: 请求体缺少必填字段
  - `401 Unauthorized`: 用户名或密码错误
  - `500 Internal Server Error`: 服务器错误

---

## **3. 文件上传**
- **URL**: `/upload`
- **方法**: `POST`
- **描述**: 用户上传 `.docx` 文件，文件内容会被解析为纯文本并存储到数据库。
- **请求头**:
  - `Authorization: Bearer <token>` // 用户登录后获取的 JWT
  - `Content-Type: multipart/form-data`
- **请求体**:
  - `file`: `.docx` 文件
- **响应**:
  - **成功**:
    ```json
    {
      "message": "文件上传成功！"
    }
    ```
  - **失败**:
    ```json
    {
      "error": "请上传 .docx 文件！"
    }
    ```
- **状态码**:
  - `201 Created`: 文件上传成功
  - `400 Bad Request`: 未上传文件或文件类型错误
  - `401 Unauthorized`: 未提供有效的 JWT
  - `500 Internal Server Error`: 服务器错误

---

## **4. 获取文件内容**
- **URL**: `/docx-content`
- **方法**: `GET`
- **描述**: 随机从数据库中获取一个 `.docx` 文件的解析内容。
- **请求头**:
  - `Authorization: Bearer <token>` // 用户登录后获取的 JWT
- **响应**:
  - **成功**:
    ```json
    {
      "username": "string", // 上传者用户名
      "content": "string"   // 文件解析后的文本内容
    }
    ```
  - **失败**:
    ```json
    {
      "error": "MongoDB 中没有文件！"
    }
    ```
- **状态码**:
  - `200 OK`: 成功返回文件内容
  - `404 Not Found`: 数据库中没有文件
  - `401 Unauthorized`: 未提供有效的 JWT
  - `500 Internal Server Error`: 服务器错误

---

## **5. 获取图片资源**
- **URL**: `/images/<filename>`
- **方法**: `GET`
- **描述**: 获取静态图片资源。
- **请求参数**:
  - `<filename>`: 图片文件名，例如 `up.png` 或 `people.png`
- **响应**:
  - 返回图片文件。
- **状态码**:
  - `200 OK`: 成功返回图片
  - `404 Not Found`: 图片文件不存在

---

## **6. 跨域支持**
- **描述**: 后端已配置跨域支持，允许以下域名访问：
  - `https://your-frontend-domain.com`
  - `http://localhost:5173`
- **允许的请求方法**:
  - `GET`, `POST`, `PUT`, `DELETE`

---

## **接口调用示例**

### **1. 用户注册**
**请求**:
```bash
curl -X POST http://devbox.ns-9mcqpenu.svc.cluster.local:3000/register \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "123456"
}'
```

**响应**:
```json
{
  "message": "注册成功！"
}
```

---

### **2. 用户登录**
**请求**:
```bash
curl -X POST http://devbox.ns-9mcqpenu.svc.cluster.local:3000/login \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "123456"
}'
```

**响应**:
```json
{
  "message": "登录成功！",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **3. 文件上传**
**请求**:
```bash
curl -X POST http://devbox.ns-9mcqpenu.svc.cluster.local:3000/upload \
-H "Authorization: Bearer <your_jwt_token>" \
-F "file=@example.docx"
```

**响应**:
```json
{
  "message": "文件上传成功！"
}
```

---

### **4. 获取文件内容**
**请求**:
```bash
curl -X GET http://devbox.ns-9mcqpenu.svc.cluster.local:3000/docx-content \
-H "Authorization: Bearer <your_jwt_token>"
```

**响应**:
```json
{
  "username": "testuser",
  "content": "这是解析后的文档内容。"
}
```

---

### **5. 获取图片资源**
**请求**:
```bash
curl -X GET http://devbox.ns-9mcqpenu.svc.cluster.local:3000/images/1.png
```

**响应**:
返回图片文件。
