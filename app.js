import express from "express";
import {
    checkIfDateEmpty,
    checkIfDatesAreValid,
    checkIfEndDateIsBigger,
    composeFlightData,
    processTicketsById,
    processFlightSeats,
    processTicketByDates,
} from "./helper.js";
const app = express();

app.use(express.json());

const ticketsByDates = {};
const tickets = {};
const flightSeats = {};

app.post("/api/tickets", (req, res) => {
    try {
        const {
            event: {
                ticketId,
                flightNumber,
                seatNumber,
                flightDate,
                ticketCost,
            },
        } = req.body;

        processTicketsById(tickets, ticketId);

        processTicketByDates(
            ticketsByDates,
            flightNumber,
            ticketCost,
            flightDate,
            seatNumber,
            flightSeats
        );

        processFlightSeats(flightSeats, flightNumber, seatNumber, ticketCost);

        res.status(200).json({ status: "success" });
        res.end();
    } catch (error) {
        let reason = error.message;
        res.status(400).json({
            status: "failed",
            reason,
        });
        res.end();
    }
});

app.get("/api/flights", async (req, res) => {
    try {
        checkIfDateEmpty(req.query);

        checkIfDatesAreValid(req.query);

        checkIfEndDateIsBigger(req.query);

        const flightData = await composeFlightData(
            req.query.startDate,
            req.query.endDate,
            ticketsByDates
        );

        res.status(200).json(flightData);
        res.end();
    } catch (error) {
        let reason = error.message;
        res.status(400).json({
            status: "failed",
            reason,
        });
        res.end();
    }
});

export default app;
