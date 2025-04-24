# Cấu trúc dự án Pet Shop Frontend

```src/
|-- assets/                # Chứa tài nguyên tĩnh như hình ảnh, fonts, etc.
|   |-- images/
|   |-- fonts/
|   |-- styles/
|
|-- components/            # Các components tái sử dụng
|   |-- common/            # Components phổ biến (Button, Card, Input, etc.)
|   |-- layout/            # Components liên quan đến layout (Header, Footer, Sidebar)
|   |-- features/          # Components theo tính năng (ProductCard, CategoryList, etc.)
|   |-- ui/                # UI components cơ bản (Modal, Dropdown, Tooltip)
|
|-- config/                # Các file cấu hình
|   |-- constants.js       # Các hằng số
|   |-- routes.js          # Định nghĩa routes
|   |-- theme.js           # Cấu hình theme
|
|-- context/               # React Context APIs
|
|-- hooks/                 # Custom hooks
|
|-- layout/                # Layout components chính
|   |-- MainLayout.jsx
|   |-- AuthLayout.jsx
|
|-- pages/                 # Các pages của ứng dụng
|   |-- Home/
|   |   |-- components/    # Components chỉ dùng trong page Home
|   |   |-- index.jsx      # Entry point của page
|   |   |-- Home.jsx
|   |-- Product/
|   |-- Profile/
|   |-- NotFound/
|
|-- redux/                 # Redux state management
|   |-- store.js           # Redux store
|   |-- slices/            # Redux toolkit slices
|       |-- authSlice.js
|       |-- cartSlice.js
|       |-- productSlice.js
|   |-- hooks.js           # Custom Redux hooks
|
|-- services/              # Các service gọi API
|   |-- api.js             # Cấu hình axios
|   |-- authService.js
|   |-- productService.js
|
|-- utils/                 # Các hàm utility
|   |-- formatters.js      # Hàm định dạng (date, currency)
|   |-- validators.js      # Hàm validate
|   |-- helpers.js         # Các hàm helper khác
|
|-- App.jsx                # Component gốc của ứng dụng
|-- main.jsx               # Entry point
|-- index.css              # Global CSS
```