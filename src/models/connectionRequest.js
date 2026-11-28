

const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {

        fromUserId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User" //refrence to user collection so jojns cab be obtained
        },
        toUserId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: '{VALUE} is not supported'
            }
        }
    },
    {
        timestamps: true
    }
);

//compound index: one index on 2 fields together, speeds up searches that use both fromUserId and toUserId
//e.g. checking if a request between two users already exists
//field order matters: it also helps searches by fromUserId alone, but not by toUserId alone
connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save", function(){
    const connectionRequest=this;
    //check if from and to user IDs are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself")
    }
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema)


module.exports = ConnectionRequestModel