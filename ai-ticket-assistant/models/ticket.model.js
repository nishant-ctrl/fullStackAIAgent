import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            default: "TODO",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        priority: {
            type: String,
        },
        deadline: {
            type: Date,
        },
        helpfulNotes: {
            type: String,
        },
        relatedSkills: [String],
    },
    { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
