const mongoose = require("mongoose");
const userPermissionSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "userModel",
  },
  permissions: [
    {
      permission_name: String,
      permission_value: [Number], // 0 ->create , 1 ->read ,2 ->update/edit ,3 ->delete
    },
  ],
});
const UserPermission = new mongoose.model("UserPermission", userPermissionSchema);
module.exports = UserPermission;
