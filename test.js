const mongoose = require('mongoose');

// URL kết nối tới MongoDB (có thể là URL từ MongoDB Atlas hoặc cục bộ)
const connectionString = 'mongodb+srv://lehuynhdung2k3:uiiGQ4@XfF8UBea@cluster0.1gzsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Thay 'testDB' bằng tên database bạn muốn

// Kết nối tới MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Kết nối tới MongoDB thành công');
    // Ngắt kết nối sau khi kiểm tra thành công
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Lỗi kết nối tới MongoDB:', error);
  });
