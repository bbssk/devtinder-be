

const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
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
            required: true,
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

connectionRequestSchema.pre("save", function(){
    const connectionRequest=this;
    //check if from and to user IDs are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself")
    }
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)


module.exports = ConnectionRequestModel