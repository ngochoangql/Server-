const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET;
exports.signUpUser = async (req, res) => {
    try {
        console.log("2")
      const { username, password, email } = req.body;
  
      console.log(password)
      // Kiểm tra xem người dùng đã tồn tại hay chưa
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại.' });
      }
  
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo người dùng mới
      const newUser = new User({
        username,
        password: hashedPassword,
        email
      });
  
      // Lưu người dùng vào cơ sở dữ liệu
      await newUser.save();
  
      res.status(200).json({ message: 'Đăng ký thành công!',status:true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng.',status:false });
    }
  };
  exports.loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;

      // Tìm kiếm người dùng trong cơ sở dữ liệu
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }
  
      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mật khẩu không đúng.' });
      }
  
      // Tạo token JWT
      const token = jwt.sign({ userId: user._id }, process.env.HOME , { expiresIn: '1h' });
  
      res.status(200).json({ status:true,token,name:user.name,email:user.email,_id:user._id});
    } catch (error) {   
      console.error(error);
      res.status(500).json({ status:false,message: 'Đã xảy ra lỗi khi đăng nhập.' });
    }
  };
  exports.getAllUser = async (req,res) => {
    console.log("122")
    try {
        const users = await User.find(); // Lấy tất cả người dùng từ cơ sở dữ liệu
        res.json(users) ;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching users:", error);
        throw error; // Ném lỗi để xử lý ở phần gọi
    }
  }