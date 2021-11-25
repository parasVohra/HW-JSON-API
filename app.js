import express from "express";
const app = express();

app.use(express.json());

const tickets = {};
const flights = {};
const flightData = {
    dates: [
        {
            date: "2021-11-03",
            flights: [
                {
                    flightNumber: "AC1",
                    revenue: 300000,
                    occupiedSeats: ["1A", "10A"],
                },
            ],
        },
        {
            date: "2021-11-04",
            flights: [],
        },
        {
            date: "2021-11-05",
            flights: [
                {
                    flightNumber: "AC2",
                    revenue: 250000,
                    occupiedSeats: ["7C", "11A"],
                },
                {
                    flightNumber: "AC10",
                    revenue: 270000,
                    occupiedSeats: ["12C", "5A"],
                },
            ],
        },
    ],
};

app.post("/api/tickets", (req, res) => {
    try {
        const {
            event: { ticketId, flightNumber, seatNumber },
        } = req.body;

        console.log("tickets: ", tickets);
        console.log("flights: ", flights);

        if (tickets.hasOwnProperty(ticketId)) {
            throw new Error("ticket");
        }
        if (Object.keys(flights).length !== 0) {
            console.log(flights);
            const flightSeats = flights[flightNumber];
            if (flightSeats.hasOwnProperty(seatNumber)) {
                throw new Error("seat");
            }
        }
        tickets[ticketId] = req.body;
        const seat = {};
        seat[seatNumber] = true;
        if (Object.keys(flights).length !== 0) {
            const oldSeats = flights[flightNumber];
            flights[flightNumber] = { ...oldSeats, ...seat };
        } else {
            flights[flightNumber] = { ...seat };
        }

        res.status(200).json({ status: "success" });
        res.end();
    } catch (error) {
        console.log(error.message);
        if (error.message === "ticket") {
            res.status(400).json({
                status: "failed",
                reason: "ticketId already exits",
            });
            res.end();
        }
        if (error.message === "seat") {
            res.status(400).json({
                status: "failed",
                reason: "seatNumber already taken",
            });
            res.end();
        }
    }
});

app.get("/api/flights", (req, res) => {
    try {
        console.log(req.query);
        if (!req.query.hasOwnProperty("startDate")) {
            throw new Error("startDate");
        }
        if (!req.query.hasOwnProperty("endDate")) {
            throw new Error("endDate");
        }
        res.status(200).send();
        res.end();
    } catch (error) {
        console.log(error.message);
        let reason = "";
        if (error.message === "startDate") {
            reason = "startDate is empty";
        }
        if (error.message === "endDate") {
            reason = "endDate is empty";
        }
        res.status(400).json({
            status: "failed",
            reason,
        });
        res.end();
    }
});

export default app;
