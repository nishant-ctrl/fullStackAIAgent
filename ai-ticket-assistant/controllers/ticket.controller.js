
import { inngest } from "../inngest/client.js";
import { Ticket } from "../models/ticket.model.js";

export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res
                .status(400)
                .json({ message: "Title and description are required" });
        }
        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString(),
        });
        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                craetedBy:req.user._id.toString()
            },
        });
        return res.status(201).json({message:"Ticket created and processing started",ticket:newTicket})
    } catch (error) {
        console.error("Error creating ticket ",error.message)
        return res.status(500).json({message:"Error while creating ticket"})
    }
};

