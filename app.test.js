import app from "./app.js";
import request from "supertest";

const ticket1 = {
    event: {
        ticketId: 1,
        flightDate: "2021-11-01",
        flightNumber: "AC1",
        seatNumber: "1A",
        ticketCost: 100000,
    },
};
const ticket2 = {
    event: {
        ticketId: 2,
        flightDate: "2021-11-01",
        flightNumber: "AC1",
        seatNumber: "2A",
        ticketCost: 100000,
    },
};
const ticket3 = {
    event: {
        ticketId: 3,
        flightDate: "2021-11-01",
        flightNumber: "AC1",
        seatNumber: "2A",
        ticketCost: 100000,
    },
};

describe("POST /api/tickets", () => {
    test("it should return status 200  and success status", async () => {
        const response = await request(app).post("/api/tickets").send(ticket1);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });
    test("it should return status 200  and success status", async () => {
        const response = await request(app).post("/api/tickets").send(ticket2);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({ status: "success" });
    });

    test("it should return 400 if tickerId is already present ", async () => {
        const response = await request(app).post("/api/tickets").send(ticket2);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "ticketId already exits",
        });
    });
    test("it should return 400 if seat number is taken for that flight ", async () => {
        const response = await request(app).post("/api/tickets").send(ticket3);
        console.log(response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "seatNumber already taken",
        });
    });
});

describe("GET /api/flights", () => {
    test("it should return status 200", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-01", endDate: "2021-11-02" })
            .send(ticket1);
        expect(response.statusCode).toBe(200);
    });
    test("it should return 400 if startDate is not given", async () => {
        const response = await request(app).get("/api/flights").send(ticket1);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "startDate is empty",
        });
    });
    test("it should return 400 if endDate is not given", async () => {
        const response = await request(app)
            .get("/api/flights")
            .query({ startDate: "2021-11-01" })
            .send(ticket1);
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            status: "failed",
            reason: "endDate is empty",
        });
    });
});
