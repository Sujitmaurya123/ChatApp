import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
    {
        message: {
            text: { type: String, required: true },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", MessageSchema);

