import app from "./app.js";
import request from "supertest";

const tickets = [
    {
        event: {
            ticketId: 1,
            flightDate: "2021-11-03",
            flightNumber: "AC1",
            seatNumber: "1A",
            ticketCost: 100000,
        },
    },
    {
        event: {
            ticketId: 2,
            flightDate: "2021-11-03",
            flightNumber: "AC1",
            seatNumber: "10A",
            ticketCost: 200000,
        },
    },
    {
        event: {
            ticketId: 3,
            flightDate: "2021-11-05",
            flightNumber: "AC2",
            seatNumber: "7C",
            ticketCost: 200000,
        },
    },
    {
        event: {
            ticketId: 4,
            flightDate: "2021-11-05",
            flightNumber: "AC2",
            seatNumber: "11A",
            ticketCost: 50000,
        },
    },
    {
        event: {
            ticketId: 5,
            flightDate: "2021-11-05",
            flightNumber: "AC10",
            seatNumber: "12C",
            ticketCost: 100000,
        },
    },
    {
        event: {
            ticketId: 6,
            flightDate: "2021-11-05",
            flightNumber: "AC10",
            seatNumber: "5A",
            ticketCost: 170000,
        },
    },
];

const badTicket = {
    event: {
        ticketId: 7,
        flightDate: "2021-11-03",
        flightNumber: "AC1",
        seatNumber: "1A",
        ticketCost: 100000,
    },
};

const successfulResponse = {
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

describe("POST /api/tickets", () => {
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[0]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[1]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[2]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[3]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[4]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[5]);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return 400 if tickerId is already present ", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(tickets[0]);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "ticketId already exits",
        });
    });
    test("it should return 400 if seat number is taken for that flight ", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .send(badTicket);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "seatNumber already taken",
        });
    });
});

describe("GET /api/flights", () => {
    test("it should return status 200 and successful response object", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-03", endDate: "2021-11-05" });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(successfulResponse);
    });
    test("it should return 400 if startDate is not given", async () => {
        const response = await request(app).get("/api/flights");
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "startDate is empty",
        });
    });
    test("it should return 400 if endDate is not given", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-01" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "endDate is empty",
        });
    });
    test("it should return 400 if startDate is not properly formatted", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-18-01", endDate: "2021-11-11" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "startDate format is invalid",
        });
    });
    test("it should return 400 if endDate is not properly formatted", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-01", endDate: "2021-14-11" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "endDate format is invalid",
        });
    });
    test("it should return 400 if endDate is before startDate", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-01", endDate: "2021-10-11" });
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "endDate cannot be before startDate",
        });
    });
});
