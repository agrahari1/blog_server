const mongoose = require("mongoose");
const permissionSchema = mongoose.Schema({
   permission_name:{
    type:String,
    required:true
   },
   is_default:{
    type:Number,
    default:0  // 0 -> Not default , 1 -> default
   }

});
const Permission = new mongoose.model("Permission", permissionSchema);
module.exports = Permission;



// Only for Admin