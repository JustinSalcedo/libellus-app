import { ITask } from "./types";

const MOCK_SCHEDULE = [
	{
		id: "SQpJ4668zM9Qq2cvEtt3",
		name: "Sleep",
		start: "2023-03-28T06:00:00.000Z",
		end: "2023-03-28T14:00:00.000Z",
	},
	{
		id: "v4jfol5HeXPNVevIKk5f",
		name: "Wake up!",
		start: "2023-03-28T14:00:00.000Z",
		end: "2023-03-28T14:15:00.000Z",
	},
	{
		id: "Tyvolc4ZTiCCnH23oll8",
		name: "Coffee",
		start: "2023-03-28T14:15:00.000Z",
		end: "2023-03-28T14:45:00.000Z",
	},
	{
		id: "3IqY9okMxNrwVBhaSts2",
		name: "Setup",
		start: "2023-03-28T14:45:00.000Z",
		end: "2023-03-28T15:00:00.000Z",
	},
	{
		id: "wdNxfI2Nx69K2ioyiPZQ",
		name: "Work",
		start: "2023-03-28T15:00:00.000Z",
		end: "2023-03-28T19:00:00.000Z",
	},
	{
		id: "RkeQROsSRfca6geinnOt",
		name: "Lunch",
		start: "2023-03-28T19:00:00.000Z",
		end: "2023-03-28T19:15:00.000Z",
	},
	{
		id: "ZKx8K8YtNgQI2sM298G7",
		name: "Work",
		start: "2023-03-28T19:15:00.000Z",
		end: "2023-03-28T21:15:00.000Z",
	},
	{
		id: "uVxOZqNtC94mOXPhEMNW",
		name: "Check email",
		start: "2023-03-28T21:15:00.000Z",
		end: "2023-03-28T21:30:00.000Z",
	},
	{
		id: "55xltb11azfimZiLwuZE",
		name: "Water tank",
		start: "2023-03-28T21:45:00.000Z",
		end: "2023-03-28T22:00:00.000Z",
	},
	{
		id: "UomxxiIlEWgyQfupJxA1",
		name: "Arrange office",
		start: "2023-03-28T22:00:00.000Z",
		end: "2023-03-28T23:00:00.000Z",
	},
	{
		id: "OcJYRikQWc9Xg91MTEUb",
		name: "Libellus App",
		start: "2023-03-28T23:15:00.000Z",
		end: "2023-03-29T01:15:00.000Z",
	},
	{
		id: "0ITQPDV4IP6OU116IqBD",
		name: "Libellus App",
		start: "2023-03-29T01:30:00.000Z",
		end: "2023-03-29T03:30:00.000Z",
	},
	{
		id: "JRyizewOBTqoIwaBB52T",
		name: "Dinner",
		start: "2023-03-29T03:45:00.000Z",
		end: "2023-03-29T04:15:00.000Z",
	},
	{
		id: "EIe0LDGornSTWDG69ioG",
		name: "DD Discussion",
		start: "2023-03-29T04:15:00.000Z",
		end: "2023-03-29T05:15:00.000Z",
	},
	{
		id: "ZGSEmJksaXphkxEbcssW",
		name: "Shower",
		start: "2023-03-29T05:15:00.000Z",
		end: "2023-03-29T06:00:00.000Z",
	},
	{
		id: "EVmSVeJrX5IGMRnf73mp",
		name: "Brush teeth",
		start: "2023-03-29T06:00:00.000Z",
		end: "2023-03-29T06:15:00.000Z",
	},
	{
		id: "zwLhND0n8EI8P3RcizD0",
		name: "Setup",
		start: "2023-03-29T06:15:00.000Z",
		end: "2023-03-29T06:30:00.000Z",
	},
	{
		id: "54IrHfC5aC8JuRDwrTQ2",
		name: "Sleep",
		start: "2023-03-29T07:00:00.000Z",
		end: "2023-03-29T15:00:00.000Z",
	},
];

export default MOCK_SCHEDULE.map(
	(task) =>
		({ ...task, start: new Date(task.start), end: new Date(task.end) } as ITask)
);