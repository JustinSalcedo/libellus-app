export interface ITask {
    id?: string
    name: string
    start: Date
    end: Date
}

export type ModalName = "" | "task-history" | "schedule-editor" | "schedule-created" | "settings"

export type DateRangeMode = 'today' | 'custom'

export type Theme = 'light' | 'dark' | 'system'

export type EditorMode = 'form' | 'prompt'

// sR = schedule range
export interface ISettings { sRDateRange: DateRangeMode, sRStart: Date, sREnd: Date, theme: Theme, editor: EditorMode }