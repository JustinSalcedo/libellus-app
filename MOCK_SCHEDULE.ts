import { ITask } from "./types";

const MOCK_SCHEDULE = [
	{
		id: "Ecb2IAHLQMob4RI6cZTy",
		name: "Sleep",
		start: "2023-03-27T06:00:00.000Z",
		end: "2023-03-27T14:00:00.000Z",
	},
	{
		id: "0qSiQAq4EJosfeSZbvsd",
		name: "Wake up!",
		start: "2023-03-27T14:00:00.000Z",
		end: "2023-03-27T14:15:00.000Z",
	},
	{
		id: "Iy1qRI92h6hLJWJZxY3B",
		name: "Coffee",
		start: "2023-03-27T14:15:00.000Z",
		end: "2023-03-27T14:45:00.000Z",
	},
	{
		id: "aljbK4pEdg4bUZlmqaOG",
		name: "Setup",
		start: "2023-03-27T14:45:00.000Z",
		end: "2023-03-27T15:00:00.000Z",
	},
	{
		id: "OKTYMzQgjFGJr8KLFq1a",
		name: "Work",
		start: "2023-03-27T15:00:00.000Z",
		end: "2023-03-27T19:00:00.000Z",
	},
	{
		id: "tER3FlFUZXSTqcQV4yqB",
		name: "Lunch",
		start: "2023-03-27T19:00:00.000Z",
		end: "2023-03-27T19:15:00.000Z",
	},
	{
		id: "MTUr97ZZxjbQkeIadxEG",
		name: "Work",
		start: "2023-03-27T19:15:00.000Z",
		end: "2023-03-27T21:15:00.000Z",
	},
	{
		id: "pICyxG4n6T8LszWfHdw7",
		name: "Check email",
		start: "2023-03-27T21:15:00.000Z",
		end: "2023-03-27T21:30:00.000Z",
	},
	{
		id: "xmMFZ0jfnfWyEes9XF0I",
		name: "Water district report",
		start: "2023-03-27T21:45:00.000Z",
		end: "2023-03-27T22:15:00.000Z",
	},
	{
		id: "hSnFKcymtZUA05nks0VT",
		name: "Errands",
		start: "2023-03-27T22:15:00.000Z",
		end: "2023-03-28T00:15:00.000Z",
	},
	{
		id: "EKtR8BYKECjgZMsIvcIg",
		name: "Fix router",
		start: "2023-03-28T00:30:00.000Z",
		end: "2023-03-28T01:30:00.000Z",
	},
	{
		id: "vGDhiSdUQs8VJOuL1uD1",
		name: "Clean office",
		start: "2023-03-28T01:30:00.000Z",
		end: "2023-03-28T02:00:00.000Z",
	},
	{
		id: "WMIEjbXpq6cXjD5AqWha",
		name: "NT Discussion",
		start: "2023-03-28T02:00:00.000Z",
		end: "2023-03-28T03:00:00.000Z",
	},
	{
		id: "u3ZIWy6o1kijRcezAFAp",
		name: "DD Discussion",
		start: "2023-03-28T03:15:00.000Z",
		end: "2023-03-28T04:15:00.000Z",
	},
	{
		id: "MOcSBuh6mlQyWGX1n2M5",
		name: "Shower",
		start: "2023-03-28T04:15:00.000Z",
		end: "2023-03-28T05:00:00.000Z",
	},
	{
		id: "A2XtrUAuCErukpZ7pLcc",
		name: "Dinner",
		start: "2023-03-28T05:00:00.000Z",
		end: "2023-03-28T05:30:00.000Z",
	},
	{
		id: "9RuYlLNi4dvMCVYem9aM",
		name: "Setup",
		start: "2023-03-28T05:30:00.000Z",
		end: "2023-03-28T05:45:00.000Z",
	},
	{
		id: "7nOn0R6Dh0lCGFf1Y7TG",
		name: "Brush teeth",
		start: "2023-03-28T05:45:00.000Z",
		end: "2023-03-28T06:00:00.000Z",
	},
	{
		id: "Z3Ij8yx4r8Rv6GkTk5yU",
		name: "Sleep",
		start: "2023-03-28T06:00:00.000Z",
		end: "2023-03-28T14:00:00.000Z",
	},
];

export default MOCK_SCHEDULE.map(
	(task) =>
		({ ...task, start: new Date(task.start), end: new Date(task.end) } as ITask)
);