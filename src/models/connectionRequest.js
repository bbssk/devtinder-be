

const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true
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