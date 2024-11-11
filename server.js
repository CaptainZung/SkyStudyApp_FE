const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối tới MongoDB cục bộ
const connectionString = 'mongodb+srv://lehuynhdung2k3:uiiGQ4@XfF8UBea@cluster0.1gzsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB locally');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mô hình người dùng (User Model)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('user', userSchema);

// API đăng nhập
app.post('/Login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Request Data:', { username, password }); // Log dữ liệu request

  try {
    // Tìm kiếm người dùng trong database
    const user = await User.findOne({ username, password });
    console.log('Found User:', user); // Log kết quả tìm kiếm

    if (user) {
      res.json({ message: 'Login successful', status: 'success', userName: user.username });
    } else {
      res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.', status: 'fail' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau.', status: 'error' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
