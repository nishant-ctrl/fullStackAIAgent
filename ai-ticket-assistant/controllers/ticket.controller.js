import { inngest } from "../inngest/client.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTicket = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
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
            craetedBy: req.user._id.toString(),
        },
    });
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newTicket,
                "Ticket created and processing started"
            )
        );
});

export const getTickets = asyncHandler(async (req, res) => {
    const user = req.user;
    let tickets = [];
    if (user.role !== "user") {
        tickets = await Ticket.find()
            .populate("assignedTo", ["email", "_id"])
            .sort({ createdAt: -1 });
    } else {
        tickets = await Ticket.find({ createdBy: user._id })
            .select("title description status createdAt")
            .sort({ createdAt: -1 });
    }
    return res
        .status(200)
        .json(new ApiResponse(200, tickets, "Fetched tickets"));
});

export const getTicket = asyncHandler(async (req, res) => {
    const user = req.user;
    let ticket;
    if (user.role !== "user") {
        ticket = await Ticket.findById(req.params.id).populate("assignedTo", [
            "email",
            "_id",
        ]);
    } else {
        ticket = Ticket.findOne({
            createdBy: user._id,
            _id: req.params.id,
        }).select("title description status createdAt");

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        return res
            .status(200)
            .json(new ApiResponse(200, ticket, "Fetched ticket"));
    }
});
