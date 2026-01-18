# App Làm Video Bất Động Sản

## 🎯 Tính năng mới - Khách tự nhập API Key

✅ **Không giới hạn người dùng** - Mỗi khách dùng API Key riêng của họ  
✅ **Miễn phí 100%** - Quota 60 requests/phút cho mỗi tài khoản Google  
✅ **Bảo mật** - API Key lưu trên trình duyệt (localStorage), không qua server  
✅ **Chuyên nghiệp** - Domain riêng: app-bds.ibeegen.com  

## 📋 Các thay đổi

### 1. geminiService.ts
- Đã sửa `getAiClient()` để ưu tiên lấy API Key từ localStorage
- Fallback về env variable nếu cần (cho dev)

### 2. ApiKeySetup.tsx (Mới)
- Component quản lý API Key
- Form nhập API Key với validation
- Hướng dẫn chi tiết cho khách hàng
- ApiKeyManager để hiển thị và đổi key

### 3. App.tsx
- Tích hợp ApiKeySetup component
- Kiểm tra API Key khi load app
- Hiển thị ApiKeyManager ở top

## 🚀 Cách deploy lên Vercel

### Bước 1: Chuẩn bị code

```bash
# Đảm bảo các file đã được cập nhật:
# - services/geminiService.ts ✅
# - components/ApiKeySetup.tsx ✅
# - App.tsx ✅
# - .env.local ✅
```

### Bước 2: Deploy lên Vercel

#### Cách 1: Qua GitHub (Khuyến nghị)

1. Tạo repo mới trên GitHub
2. Push code:
```bash
git init
git add .
git commit -m "Add user API key feature"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. Truy cập: https://vercel.com/new
4. Import repository từ GitHub
5. Click "Deploy"

#### Cách 2: Vercel CLI

```bash
# Cài Vercel CLI
npm install -g vercel

# Đăng nhập
vercel login

# Deploy
vercel
```

#### Cách 3: Kéo thả (Đơn giản nhất)

1. Nén tất cả files thành ZIP
2. Vào https://vercel.com/new
3. Kéo thả file ZIP
4. Deploy tự động

### Bước 3: Cấu hình Domain

1. Sau khi deploy, vào **Settings** > **Domains**
2. Add domain: `app-bds.ibeegen.com`
3. Cấu hình DNS đã hoàn tất ✅

## 👥 Hướng dẫn cho khách hàng

Khi khách truy cập `https://app-bds.ibeegen.com`:

1. **Màn hình đầu tiên**: Form yêu cầu nhập API Key
2. **Khách làm theo hướng dẫn**:
   - Click link → Google AI Studio
   - Đăng nhập Google
   - Tạo API Key miễn phí
   - Copy & Paste vào app
3. **Bắt đầu sử dụng ngay!**

## 🔧 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## 📝 Lưu ý

- API Key được lưu trong `localStorage.getItem('user_gemini_api_key')`
- Mỗi user có quota riêng: 60 requests/phút
- Nếu user xóa cache, cần nhập lại API Key
- API Key không bao giờ được gửi lên server

## 🆘 Troubleshooting

### Lỗi: "Vui lòng cấu hình API Key"
→ Khách chưa nhập API Key → Reload trang

### Lỗi: "API Key không hợp lệ"
→ API Key không đúng format → Nhập lại

### Lỗi: "Quota exceeded"
→ Đã hết 60 requests/phút → Đợi 1 phút

## 📞 Hỗ trợ

Email: contact@ibeegen.com

---

**Powered by Google Gemini AI** 🚀
