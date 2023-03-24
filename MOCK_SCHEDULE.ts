import { ITask } from "./types";

const MOCK_SCHEDULE = [
	{
		id: "6pXrKo3oXJSoAmpk1DNE",
		name: "Sleep",
		start: "2023-03-24T06:00:00.000Z",
		end: "2023-03-24T14:00:00.000Z",
	},
	{
		id: "orfjgkrDsvqdhtaIlH92",
		name: "Wake up!",
		start: "2023-03-24T14:00:00.000Z",
		end: "2023-03-24T14:15:00.000Z",
	},
	{
		id: "t5TGiBySIuFNFM1BJGH1",
		name: "Coffee",
		start: "2023-03-24T14:15:00.000Z",
		end: "2023-03-24T14:45:00.000Z",
	},
	{
		id: "IEriGLaEJUaGZtq3yl5B",
		name: "Setup",
		start: "2023-03-24T14:45:00.000Z",
		end: "2023-03-24T15:00:00.000Z",
	},
	{
		id: "3lgP5t5p22P1UFI9T3jV",
		name: "Work",
		start: "2023-03-24T15:00:00.000Z",
		end: "2023-03-24T19:00:00.000Z",
	},
	{
		id: "zyCHzIcZ2Km7js9XojW4",
		name: "Lunch",
		start: "2023-03-24T19:00:00.000Z",
		end: "2023-03-24T19:15:00.000Z",
	},
	{
		id: "NVHE3aRla102cyiF9WiH",
		name: "Work",
		start: "2023-03-24T19:15:00.000Z",
		end: "2023-03-24T21:15:00.000Z",
	},
	{
		id: "vhZ1x0FTHIfwSJ2ltRMH",
		name: "Check email",
		start: "2023-03-24T21:15:00.000Z",
		end: "2023-03-24T21:30:00.000Z",
	},
	{
		id: "r6KZFH5oGoObBzoAG1qy",
		name: "Network setup",
		start: "2023-03-24T21:45:00.000Z",
		end: "2023-03-24T22:45:00.000Z",
	},
	{
		id: "yXCALpAiqeK0nmVKv7FQ",
		name: "NT Discussion",
		start: "2023-03-24T23:00:00.000Z",
		end: "2023-03-25T00:00:00.000Z",
	},
	{
		id: "6JuKlDSSnTorhkQsSMTX",
		name: "Groceries",
		start: "2023-03-25T00:15:00.000Z",
		end: "2023-03-25T01:15:00.000Z",
	},
	{
		id: "0v0WBpdzxZVlb2VyyymC",
		name: "Libellus App",
		start: "2023-03-25T01:15:00.000Z",
		end: "2023-03-25T03:15:00.000Z",
	},
	{
		id: "UZ2pbLEbWLRa9VZ15mDr",
		name: "Dinner",
		start: "2023-03-25T03:15:00.000Z",
		end: "2023-03-25T03:30:00.000Z",
	},
	{
		id: "0oonzgFm6JpEK24m9I7e",
		name: "Shower",
		start: "2023-03-25T03:30:00.000Z",
		end: "2023-03-25T04:00:00.000Z",
	},
	{
		id: "z0AWfy2lw8Yl9AhS6vE4",
		name: "Setup",
		start: "2023-03-25T04:00:00.000Z",
		end: "2023-03-25T04:15:00.000Z",
	},
	{
		id: "ey9BhdtQmcCFgft4OYnk",
		name: "Brush teeth",
		start: "2023-03-25T04:15:00.000Z",
		end: "2023-03-25T04:30:00.000Z",
	},
	{
		id: "cc6BN0kmwGiJLRviMIcB",
		name: "Sleep",
		start: "2023-03-25T06:00:00.000Z",
		end: "2023-03-25T14:00:00.000Z",
	},
];

export default MOCK_SCHEDULE.map(task => ({ ...task, start: new Date(task.start), end: new Date(task.end) } as ITask))