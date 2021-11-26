import { isMatch, compareAsc, addDays, format } from "date-fns";

export function processTicketByDates(
    ticketsByDates,
    flightNumber,
    ticketCost,
    flightDate,
    seatNumber,
    flightSeats
) {
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
}

export function processFlightSeats(
    flightSeats,
    flightNumber,
    seatNumber,
    ticketCost
) {
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
}

export function checkIfDateEmpty(query) {
    if (!query.hasOwnProperty("startDate")) {
        throw new Error("startDate is empty");
    }
    if (!query.hasOwnProperty("endDate")) {
        throw new Error("endDate is empty");
    }
}

export function checkIfDatesAreValid(query) {
    if (query.startDate) {
        const isValidFormat = isMatch(query.startDate, "yyyy-MM-dd");
        if (!isValidFormat) {
            throw new Error("startDate format is invalid");
        }
    }
    if (query.endDate) {
        const isValidFormat = isMatch(query.endDate, "yyyy-MM-dd");
        if (!isValidFormat) {
            throw new Error("endDate format is invalid");
        }
    }
}

export function checkIfEndDateIsBigger(query) {
    if (query.startDate && query.endDate) {
        const isEndDateBigger = compareAsc(
            new Date(query.endDate),
            new Date(query.startDate)
        );
        if (isEndDateBigger === -1) {
            throw new Error("endDate cannot be before startDate");
        }
    }
}

export function calculateFlight(date, ticketsByDates) {
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

export async function composeFlightData(startDate, endDate, ticketsByDates) {
    const flightData = {
        dates: [],
    };
    const dates = await dateArray(startDate, endDate);
    dates.forEach((date) => {
        if (ticketsByDates.hasOwnProperty(date)) {
            flightData.dates.push({
                date: date,
                flights: calculateFlight(date, ticketsByDates),
            });
        } else {
            flightData.dates.push({
                date: date,
                flights: [],
            });
        }
    });

    return flightData;
}

export async function dateArray(sDate, eDate) {
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

export function processTicketsById(tickets, ticketId) {
    if (tickets.hasOwnProperty(ticketId)) {
        throw new Error("ticketId already exits");
    } else {
        tickets[ticketId] = "";
    }
}

export function formatDate(date) {
    return format(new Date(addDays(new Date(date), 1)), "yyyy-MM-dd");
}
