

const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Types.ObjectId
        },
        toUserId: {
            type: mongoose.Types.ObjectId
        },
        status: {
            type: String,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: '{VALUE} is not supported'
            }
        }
    },
    {
        timestamps: true
    }
);


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectRequestSchema)


module.exports = ConnectionRequestModel