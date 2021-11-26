import express from "express";
import { isMatch, compareAsc, addDays, format } from "date-fns";
const app = express();

app.use(express.json());

const tickets = {};
const flightSeats = {};
const ticketsByDates = {};

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

        if (tickets.hasOwnProperty(ticketId)) {
            throw new Error("ticketId already exits");
        } else {
            tickets[ticketId] = "";
        }

        if (ticketsByDates.hasOwnProperty(flightDate)) {
            if (ticketsByDates[flightDate].hasOwnProperty(flightNumber)) {
                let seat = {};
                seat[seatNumber] = ticketCost;
                let oldSeats = flightSeats[flightNumber];
                ticketsByDates[flightDate][flightNumber] = {
                    ...oldSeats,
                    ...seat,
                };
            } else {
                let seat = {};
                seat[seatNumber] = ticketCost;
                ticketsByDates[flightDate][`${flightNumber}`] = seat;
            }
        } else {
            let seat = {};
            seat[seatNumber] = ticketCost;
            let flightSeatObj = {};
            flightSeatObj[flightNumber] = seat;
            ticketsByDates[flightDate] = flightSeatObj;
        }

        if (flightSeats.hasOwnProperty(flightNumber)) {
            if (flightSeats[`${flightNumber}`].hasOwnProperty(seatNumber)) {
                throw new Error("seatNumber already taken");
            } else {
                if (flightSeats.hasOwnProperty(flightNumber)) {
                    let seat = {};
                    seat[seatNumber] = ticketCost;
                    const oldSeats = flightSeats[flightNumber];
                    flightSeats[flightNumber] = { ...oldSeats, ...seat };
                } else {
                    let seat = {};
                    seat[seatNumber] = ticketCost;
                    flightSeats[flightNumber] = { ...seat };
                }
            }
        } else {
            let seat = {};
            seat[seatNumber] = ticketCost;
            flightSeats[`${flightNumber}`] = seat;
        }

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
        if (!req.query.hasOwnProperty("startDate")) {
            throw new Error("startDate is empty");
        }
        if (!req.query.hasOwnProperty("endDate")) {
            throw new Error("endDate is empty");
        }
        if (req.query.startDate) {
            const isValidFormat = isMatch(req.query.startDate, "yyyy-MM-dd");
            if (!isValidFormat) {
                throw new Error("startDate format is invalid");
            }
        }
        if (req.query.endDate) {
            const isValidFormat = isMatch(req.query.endDate, "yyyy-MM-dd");
            if (!isValidFormat) {
                throw new Error("endDate format is invalid");
            }
        }

        if (req.query.startDate && req.query.endDate) {
            const isEndDateBigger = compareAsc(
                new Date(req.query.endDate),
                new Date(req.query.startDate)
            );
            if (isEndDateBigger === -1) {
                throw new Error("endDate cannot be before startDate");
            }
        }

        const flightData = {
            dates: [],
        };

        console.log(JSON.stringify(flightSeats, null, 2));

        console.log(JSON.stringify(ticketsByDates, null, 2));
        const dates = await dateArray(req.query.startDate, req.query.endDate);

        dates.forEach((date) => {
            if (ticketsByDates.hasOwnProperty(date)) {
                flightData.dates.push({
                    date: date,
                    flights: calculateFlight(date),
                });
            } else {
                flightData.dates.push({
                    date: date,
                    flights: [],
                });
            }
        });

        console.log(JSON.stringify(flightData, null, 2));

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

function calculateFlight(date) {
    const result = [];
    const flightArray = Object.keys(ticketsByDates[date]);
    for (let flight of flightArray) {
        const rev = Object.values(ticketsByDates[date][flight]);
        const cost = rev.reduce((acc, price) => acc + price);
        result.push({
            flightNumber: flight,
            revenue: cost,
            occupiedSeats: Object.keys(ticketsByDates[date][flight]),
        });
    }
    return result;
}

async function dateArray(sDate, eDate) {
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    const dateRange = [];
    dateRange.push(formatDate(startDate));

    let currentDate = startDate;
    while (currentDate < endDate) {
        currentDate = addDays(new Date(currentDate), 1);
        dateRange.push(formatDate(currentDate));
    }
    return dateRange;
}

function formatDate(date) {
    return format(new Date(addDays(new Date(date), 1)), "yyyy-MM-dd");
}

export default app;
