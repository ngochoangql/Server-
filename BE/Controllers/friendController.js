const Friend = require('../Models/friendModel');
const User = require('../Models/userModel')
exports.getAllFriend = async (req, res) => {
    try {
        const { user_uuid } = req.params; // Lấy user_id từ params

        // Sử dụng phương thức find để lấy tất cả các bạn của người dùng từ cơ sở dữ liệu
        const friends = await Friend.find({ user_uuid: user_uuid });

        res.status(200).json(friends);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching friends:", error);
        res.status(500).json({ error: 'Error fetching friends' }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
}
exports.addFriend = async (req, res) => {
   
    try {
        const { user_uuid, friend_uuid } = req.body; // Lấy user_uuid và friend_uuid từ body của request
        const user = await User.findOne({ _id: friend_uuid });
        // Kiểm tra xem friend_uuid đã tồn tại trong danh sách bạn bè của user_uuid chưa
        const existingFriend1 = await Friend.findOne({ user_uuid: user_uuid, friend_uuid: friend_uuid });
        const existingFriend2 = await Friend.findOne({user_uuid: friend_uuid, friend_uuid: user_uuid });
        if (existingFriend1 || existingFriend2) {
            // Nếu friend_uuid đã tồn tại trong danh sách bạn bè của user_uuid
            console.log("b")
            if(existingFriend1){
                if (existingFriend1.status == "Confirming" ){
                    res.status(200).json({ message: 'Chờ xác nhận' });
                    console.log("a")
                }else if (existingFriend1.status == "Reject"){
                    res.status(204).json({ message: 'Bị từ chối' });
                }else if (existingFriend1.status == "Friend "){
                    res.status(202).json({ message: 'Các bạn đã là bạn bè' });
                }
            }
            if(existingFriend2){
                 if ( existingFriend2.status == "Confirming"){
                    console.log("a")
                    res.status(200).json({ message: 'Chờ xác nhận' });
                }else if ( existingFriend2.status == "Reject"){
                    res.status(204).json({ message: 'Bị từ chối' });
                }else if ( existingFriend2.status == "Friend"){
                    res.status(202).json({ message: 'Các bạn đã là bạn bè' });
                }
            }
           
        } else {
            // Nếu friend_uuid chưa tồn tại trong danh sách bạn bè của user_uuid, thêm mới vào
            if (user) {
                const newFriend = new Friend({ user_uuid: user_uuid, friend_uuid: friend_uuid,friend_name:user.username });
                await newFriend.save();
                res.status(200).json({ message: 'Kết bạn thành công' });
            } else {
                res.status(203).json({ message: 'Người dùng không tồn tại' });
            }    
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error adding friend:", error);
        res.status(500).json({ error: 'Error adding friend' }); // Trả về lỗi 500 nếu có lỗi xảy ra
    }
}
