export interface ITask {
    id?: string
    name: string
    start: Date
    end: Date
}

export type ModalName = "" | "task-history" | "schedule-editor" | "schedule-created" | "settings"

export interface ScheduleRangeSettings { dateRange: 'today' | 'custom', startDate: Date, endDate: Date }

export type Theme = 'light' | 'dark' | 'system'

export interface Settings { schedule: ScheduleRangeSettings, theme: Theme, editor: 'form' | 'prompt' }