import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema(
    {
        
    },
    {timestamps:true});

export const Ticket=mongoose.model("Ticket",ticketSchema)