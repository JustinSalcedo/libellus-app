import { ITask } from "./types";

const MOCK_SCHEDULE = [
	{
		id: "YaLbTu5LhBDHr1OjErAP",
		name: "Sleep",
		start: "2023-03-26T06:00:00.000Z",
		end: "2023-03-26T14:00:00.000Z",
	},
	{
		id: "5QH0GhfiP38aMOPDGbsV",
		name: "Wake up!",
		start: "2023-03-26T14:00:00.000Z",
		end: "2023-03-26T14:15:00.000Z",
	},
	{
		id: "1l4qssCL6XJP8i6iHkyl",
		name: "Coffee",
		start: "2023-03-26T14:15:00.000Z",
		end: "2023-03-26T14:45:00.000Z",
	},
	{
		id: "SyeRlRH6gNWhQtsqUzlR",
		name: "Setup",
		start: "2023-03-26T14:45:00.000Z",
		end: "2023-03-26T15:00:00.000Z",
	},
	{
		id: "kXyb2ETPX59wRQrkMCyE",
		name: "Troubleshooting",
		start: "2023-03-26T15:00:00.000Z",
		end: "2023-03-26T16:00:00.000Z",
	},
	{
		id: "LgsDIphFJzkx1CBlpUmF",
		name: "Breakfast",
		start: "2023-03-26T16:00:00.000Z",
		end: "2023-03-26T16:30:00.000Z",
	},
	{
		id: "MfbjA8Atka85zyCS9iLs",
		name: "Libellus App",
		start: "2023-03-26T16:45:00.000Z",
		end: "2023-03-26T22:45:00.000Z",
	},
	{
		id: "ypgFHP6MYDeNHU9mcHWP",
		name: "NT Quizes",
		start: "2023-03-26T22:45:00.000Z",
		end: "2023-03-26T23:30:00.000Z",
	},
	{
		id: "oPtGCpBOtsGTKmCCIAvi",
		name: "DD Quizes",
		start: "2023-03-26T23:30:00.000Z",
		end: "2023-03-27T00:15:00.000Z",
	},
	{
		id: "bBoVB8fecEZxDOY75Guf",
		name: "DD Intro",
		start: "2023-03-27T00:15:00.000Z",
		end: "2023-03-27T00:30:00.000Z",
	},
	{
		id: "nF996Pc91cDLHi1EJOnu",
		name: "NT Project",
		start: "2023-03-27T00:45:00.000Z",
		end: "2023-03-27T01:45:00.000Z",
	},
	{
		id: "7UiEx0HhvO8fAhcQ8LoD",
		name: "DD Project",
		start: "2023-03-27T02:00:00.000Z",
		end: "2023-03-27T03:00:00.000Z",
	},
	{
		id: "NFO1YlUCED00WZqZWubQ",
		name: "DD Post notes",
		start: "2023-03-27T03:15:00.000Z",
		end: "2023-03-27T03:45:00.000Z",
	},
	{
		id: "kicRZ6JecoqPFfoZ0TOx",
		name: "NT Post notes",
		start: "2023-03-27T03:45:00.000Z",
		end: "2023-03-27T04:15:00.000Z",
	},
	{
		id: "f6LkXKPnHvOV0JzVgWZ5",
		name: "Dinner",
		start: "2023-03-27T04:15:00.000Z",
		end: "2023-03-27T04:45:00.000Z",
	},
	{
		id: "2bINDHaaEasIHabPvRGD",
		name: "Shower",
		start: "2023-03-27T04:45:00.000Z",
		end: "2023-03-27T05:30:00.000Z",
	},
	{
		id: "meFWA9WHpGQmDzpEMrPd",
		name: "Setup",
		start: "2023-03-27T05:30:00.000Z",
		end: "2023-03-27T05:45:00.000Z",
	},
	{
		id: "kwNlIX06aKXTHaJwJYqT",
		name: "Brush teeth",
		start: "2023-03-27T05:45:00.000Z",
		end: "2023-03-27T06:00:00.000Z",
	},
	{
		id: "lFQP57uWODloYH4yBpvg",
		name: "Sleep",
		start: "2023-03-27T07:00:00.000Z",
		end: "2023-03-27T15:00:00.000Z",
	},
];

export default MOCK_SCHEDULE.map(
  (task) =>
    ({ ...task, start: new Date(task.start), end: new Date(task.end) } as ITask)
);
