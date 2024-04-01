const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();
const fs = require("fs");
const { PythonShell } = require("python-shell");

const { getDeviceById, updateDeviceById, addDevice,getAllDevices,deleteDeviceById } = require("./functions");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Cấu hình middleware
app.use(express.json()); // Cho phép xử lý dữ liệu dạng JSON trong yêu cầu

// Kết nối tới cơ sở dữ liệu MongoDB
mongoose.connect("mongodb://localhost:27017/artemis", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRoutes = require("./Routes/userRoute");
const friendRoutes = require("./Routes/friendRoute");

app.use("/user", userRoutes);
app.use("/friend", friendRoutes);
// Xử lý tuyến đường mặc định
app.get("/", (req, res) => {
  console.log("check");
  res.status(200).json({ message: "Server hoạt động" });
});
app.get("/data/chart/:id", (req, res) => {
  console.log("chart");
  try {
    const { id } = req.params;
    const rawData = fs.readFileSync("../Data/DataChart/" + id + ".json");
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy dữ liệu" });
  }
  // res.status(200).json({current:[[1,20],[2,21],[3,21],[4,22]],voltage:[[1,220],[2,221],[3,225],[4,221]],active:[[1,65],[2,66],[3,65],[4,68]],apparent:[[1,100],[2,102],[3,102],[4,100]]});
});
app.get("/data/parameter/:id", (req, res) => {
  console.log("parameter");
  try {
    const { id } = req.params;
    const rawData = fs.readFileSync("../Data/DataParameter/" + id + ".json");
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy dữ liệu" });
  }
  // res.status(200).json({current:[[1,20],[2,21],[3,21],[4,22]],voltage:[[1,220],[2,221],[3,225],[4,221]],active:[[1,65],[2,66],[3,65],[4,68]],apparent:[[1,100],[2,102],[3,102],[4,100]]});
});
// Khởi chạy server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mosca = require("mosca");
const { stringify } = require("querystring");
// Cấu hình MQTT server
const settings = {
  port: 1883, // Cổng mặc định của MQTT
};

// Khởi tạo MQTT server
const server = new mosca.Server(settings);

// Sự kiện khi MQTT server được khởi động
server.on("ready", function () {
  console.log("Mosca MQTT server đang chạy trên cổng " + settings.port);
});

// Sự kiện khi một client kết nối đến MQTT server
server.on("clientConnected", function (client) {
  console.log("Client kết nối:", client.id);
});

// Sự kiện khi một client ngắt kết nối từ MQTT server
server.on("clientDisconnected", function (client) {
  console.log("Client ngắt kết nối:", client.id);
});
// Sự kiện khi nhận được dữ liệu từ client
server.on("published", function (packet, client) {
  if (packet.topic == "device-status") {
    console.log(
      "-------------------------------------------------------------------------"
    );

    getDeviceById(packet.payload.toString(), function (device) {
      if (device) {
        console.log("Thông tin thiết bị:", device);
        server.publish({
          topic: "device-status-reply",
          payload: JSON.stringify(device),
        });
      } else {
        console.log(
          "Không tìm thấy thiết bị có ID:",
          packet.payload.toString()
        );
      }
      console.log(
        "-------------------------------------------------------------------------"
      );
    });
  }

  if (packet.topic == "smart-plug.relay") {
    console.log(
      "-------------------------------------------------------------------------"
    );
    try {
      // Chuyển đổi dữ liệu từ buffer sang chuỗi
      const dataString = packet.payload.toString();
      // Phân tích chuỗi JSON để lấy thông tin
      const data = JSON.parse(dataString);
      // Kiểm tra xem dữ liệu có đúng định dạng hay không
      if (data.id && data.status) {
        console.log("Thông tin nhận được:", data);
        // Xử lý thông tin ở đây, ví dụ:    
        console.log("ID:", data.id);
        console.log("Trạng thái:", data.status);
        server.publish({
          topic: "smart-plug.relay-reply",
          payload: JSON.stringify({ id: data.id, relay_status: data.status }),
        });
        // Gửi thông báo hoặc xử lý tiếp theo tùy thuộc vào dữ liệu
      } else {
        console.log("Dữ liệu nhận được không hợp lệ:", dataString);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu nhận được:", error);
    }
    console.log(
      "-------------------------------------------------------------------------"
    );
  }
  if (packet.topic == "smart-plug.limit") {
    console.log(
      "-------------------------------------------------------------------------"
    );
    console.log(packet.payload.toString())
    try {
      // Chuyển đổi dữ liệu từ buffer sang chuỗi
      const dataString = packet.payload.toString();
      // Phân tích chuỗi JSON để lấy thông tin
      const data = JSON.parse(dataString);
      // Kiểm tra xem dữ liệu có đúng định dạng hay không
      if (data.id && data.value_limit ) {
        console.log("Thông tin nhận được:", data);
        // Xử lý thông tin ở đây, ví dụ:
        console.log("ID:", data.id);
        console.log("Trạng thái Limit:", data.state_limit);
        console.log("Giá trị Limit:", data.value_limit);
        updateDeviceById(data.id, { value_limit: data.value_limit,state_limit:data.state_limit });
        server.publish({topic:"smart-plug.limit-reply",payload:JSON.stringify({message:"success",value_limit:data.value_limit,state_limit:data.state_limit})})
        // Gửi thông báo hoặc xử lý tiếp theo tùy thuộc vào dữ liệu
      } else {
        console.log("Dữ liệu nhận được không hợp lệ:", dataString);
        server.publish({topic:"smart-plug.limit-reply",payload:JSON.stringify({message:"failed"})})
      }
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu nhận được:", error);
      server.publish({topic:"smart-plug.limit-reply",payload:JSON.stringify({message:"failed"})})
    }
    console.log(
      "-------------------------------------------------------------------------"
    );
  }

  if (packet.topic == "smart-plug.relay-reply") {
    console.log(
      "-------------------------------------------------------------------------"
    );
    console.log(packet.payload.toString())
    try {
      // Chuyển đổi dữ liệu từ buffer sang chuỗi
      const dataString = packet.payload.toString();
      // Phân tích chuỗi JSON để lấy thông tin
      const data = JSON.parse(dataString);
      // Kiểm tra xem dữ liệu có đúng định dạng hay không
      if (data.id && data.relay_status) {
        console.log("Thông tin nhận được:", data);
        // Xử lý thông tin ở đây, ví dụ:
        console.log("ID:", data.id);
        console.log("Trạng thái:", data.relay_status);
        updateDeviceById(data.id, { relay_status: data.relay_status });
        // Gửi thông báo hoặc xử lý tiếp theo tùy thuộc vào dữ liệu
      } else {
        console.log("Dữ liệu nhận được không hợp lệ:", dataString);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu nhận được:", error);
    }
    console.log(
      "-------------------------------------------------------------------------"
    );
  }

  if (packet.topic == "smart-plug.all-data") {
    console.log("aa");
  }
  if (packet.topic == "smart-plug.device-name") {
    console.log(packet.payload.toString());
  }

  if (packet.topic == "smart-plug.add-device") {
    try {
      // Chuyển đổi dữ liệu từ buffer sang chuỗi
      const dataString = packet.payload.toString();
      // Phân tích chuỗi JSON để lấy thông tin
      const data = JSON.parse(dataString);
      // Kiểm tra xem dữ liệu có đúng định dạng hay không
      if (data.id && data.name) {
        console.log("Thông tin nhận được:", data);
        // Xử lý thông tin ở đây, ví dụ:
        console.log("ID:", data.id);
        console.log("Name:", data.name);
        addDevice({ id: data.id, name: data.name, relay_status: "off" });
        server.publish({
          topic: "smart-plug.add-device-reply",
          payload: JSON.stringify({ message: "success" }),
        });
        fs.writeFile(
          "../Data/DataChart/" + data.id + ".json",
          JSON.stringify({
            current: [0],
            voltage: [0],
            active: [0],
            apparent: [0],
          }),
          "utf8",
          (err) => {
            if (err) {
              console.error("Lỗi khi ghi vào tệp JSON:", err);
              return;
            }
            console.log("Dữ liệu đã được ghi vào tệp JSON thành công.");
          }
        );
        fs.writeFile(
          "../Data/DataParameter/" + data.id + ".json",
          JSON.stringify({
            current: 0,
            voltage: 0,
            active: 0,
            apparent: 0,
            predict:"Unknown"
          }),
          "utf8",
          (err) => {
            if (err) {
              console.error("Lỗi khi ghi vào tệp JSON:", err);
              return;
            }
            console.log("Dữ liệu đã được ghi vào tệp JSON thành công.");
          }
        );
        // Gửi thông báo hoặc xử lý tiếp theo tùy thuộc vào dữ liệu
      } else {
        server.publish({
          topic: "smart-plug.add-device-reply",
          payload: JSON.stringify({ message: "failed" }),
        });
        console.log("Dữ liệu nhận được không hợp lệ:", dataString);
      }
    } catch (error) {
      server.publish({
        topic: "smart-plug.add-device-reply",
        payload: JSON.stringify({ message: "failed" }),
      });
      console.error("Lỗi khi xử lý dữ liệu nhận được:", error);
    }
    console.log(
      "-------------------------------------------------------------------------"
    );
  }
  if (packet.topic == "smart-plug.delete-device") {
    try {
      // Chuyển đổi dữ liệu từ buffer sang chuỗi
      const dataString = packet.payload.toString();
      // Phân tích chuỗi JSON để lấy thông tin
      const data = JSON.parse(dataString);
      // Kiểm tra xem dữ liệu có đúng định dạng hay không
      if (data.id) {
        console.log("Thông tin nhận được:", data);
        // Xử lý thông tin ở đây, ví dụ:
        console.log("ID:", data.id);
        deleteDeviceById(data.id, success => {
          if (success) {
            console.log("Xóa thiết bị thành công.");
            server.publish({
              topic: "smart-plug.delete-device-reply",
              payload: JSON.stringify({ message: "success" }),
            });
          } else {
            console.log("Xóa thiết bị không thành công.");
            server.publish({
              topic: "smart-plug.delete-device-reply",
              payload: JSON.stringify({ message: "failed" }),
            });
          }
        });
        
       
        // Gửi thông báo hoặc xử lý tiếp theo tùy thuộc vào dữ liệu
      } else {
        server.publish({
          topic: "smart-plug.delete-device-reply",
          payload: JSON.stringify({ message: "failed" }),
        });
        console.log("Dữ liệu nhận được không hợp lệ:", dataString);
      }
    } catch (error) {
      server.publish({
        topic: "smart-plug.delete-device-reply",
        payload: JSON.stringify({ message: "failed" }),
      });
      console.error("Lỗi khi xử lý dữ liệu nhận được:", error);
    }
    console.log(
      "-------------------------------------------------------------------------"
    );
  }
  if (packet.topic == "smart-plug.async") {
    if (packet.payload.toString() == "async"){
      getAllDevices((devices) => {
        if(devices){
          console.log("Lấy thành công tất cả device thành công",devices);
          server.publish({topic:"smart-plug.async-reply",payload:JSON.stringify({message:"success",devices})})
        }else{
          console.log("Lấy thành công tất cả device không thành công");
        }
      })
      
    }
  }
  if (packet.topic == "smart-plug.add-alarm") {
    console.log(packet.payload.toString());
  }
});

const { exec } = require("child_process");

// Đường dẫn đến file Python
const pythonScript = "../model.py";
const pythonScript1 = "../scheduler.py";
// Chạy file Python
exec(`python ${pythonScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Lỗi khi chạy file Python: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Lỗi tiêu chuẩn từ Python: ${stderr}`);
    return;
  }
  console.log(`Kết quả từ Python: ${stdout}`);
});
