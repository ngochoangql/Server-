const fs = require("fs");
function getDeviceById(deviceId, callback) {
  fs.readFile("../Data/devices.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp JSON:", err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const devices = jsonData.devices;
      const device = devices.find((d) => d.id === deviceId);
      callback(device);
    } catch (error) {
      console.error("Lỗi khi phân tích cú pháp JSON:", error);
      callback(null);
    }
  });
}

function updateDeviceById(deviceId, newData) {
  fs.readFile("../Data/devices.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp JSON:", err);
      return;
    }
    try {
      // Phân tích cú pháp dữ liệu JSON
      const jsonData = JSON.parse(data);
      // Tìm kiếm thiết bị theo ID và cập nhật dữ liệu mới
      const updatedData = jsonData.devices.map((device) => {
        if (device.id === deviceId) {
          return { ...device, ...newData };
        }
        return device;
      });
      // Cập nhật dữ liệu mới
      jsonData.devices = updatedData;
      // Ghi lại dữ liệu vào tệp JSON
      fs.writeFile(
        "../Data/devices.json",
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Lỗi khi ghi lại tệp JSON:", err);
          } else {
            console.log("Dữ liệu đã được cập nhật thành công.");
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khi phân tích cú pháp JSON:", error);
    }
  });
}

function addDevice(newDevice) {
  fs.readFile("../Data/devices.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp JSON:", err);
      return;
    }
    try {
      // Phân tích cú pháp dữ liệu JSON
      const jsonData = JSON.parse(data);
      // Thêm thiết bị mới vào mảng devices
      jsonData.devices.push(newDevice);
      // Ghi lại dữ liệu vào tệp JSON
      fs.writeFile(
        "../Data/devices.json",
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Lỗi khi ghi lại tệp JSON:", err);
          } else {
            console.log("Thiết bị đã được thêm vào thành công.");
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khi phân tích cú pháp JSON:", error);
    }
  });
}
function getAllDevices(callback) {
  fs.readFile("../Data/devices.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp JSON:", err);
      return;
    }
    try {
      // Phân tích cú pháp dữ liệu JSON
      const jsonData = JSON.parse(data);
      // Trả về mảng các thiết bị
      const devices = jsonData.devices;
      // console.log("Danh sách thiết bị:", devices);
      callback(devices) ;
    } catch (error) {
      console.error("Lỗi khi phân tích cú pháp JSON:", error);
      callback(null);
    }
  });
}

function deleteDeviceById(idToDelete, callback) {
  fs.readFile("../Data/devices.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp JSON:", err);
      callback(false);
      return;
    }
    try {
      // Phân tích cú pháp dữ liệu JSON
      const jsonData = JSON.parse(data);
      // Lọc ra thiết bị cần xóa
      const updatedDevices = jsonData.devices.filter(device => device.id !== idToDelete);
      // Kiểm tra xem có thiết bị nào bị xóa không
      if (updatedDevices.length === jsonData.devices.length) {
        console.log("Không tìm thấy thiết bị với ID:", idToDelete);
        callback(false);
        return;
      }
      // Cập nhật danh sách thiết bị mới
      jsonData.devices = updatedDevices;
      // Ghi lại dữ liệu vào tệp JSON
      fs.writeFile("../Data/devices.json", JSON.stringify(jsonData, null, 2), "utf8", err => {
        if (err) {
          console.error("Lỗi khi ghi lại tệp JSON:", err);
          callback(false);
          return;
        }
        console.log("Thiết bị đã được xóa thành công.");
        const file1Path = "../Data/DataChart/"+idToDelete+".json"
        const file2Path = "../Data/DataParameter/"+idToDelete+".json"
        fs.unlink(file1Path, (err) => {
          if (err) {
            console.error(`Lỗi khi xóa ${file1Path}:`, err);
            callback(false);
            return;
          }
          console.log(`${file1Path} đã được xóa thành công.`);
          // Sau khi xóa file1, xóa file2
          fs.unlink(file2Path, (err) => {
            if (err) {
              console.error(`Lỗi khi xóa ${file2Path}:`, err);
              callback(false);
              return;
            }
            console.log(`${file2Path} đã được xóa thành công.`);
            callback(true);
          });
        });
        callback(true);
      });
    } catch (error) {
      console.error("Lỗi khi phân tích cú pháp JSON:", error);
      callback(false);
    }
  });
}



module.exports = {
  getDeviceById,
  updateDeviceById,
  addDevice,
  getAllDevices,
  deleteDeviceById
};
