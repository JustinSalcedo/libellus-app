import { createContext } from "react";
import { ITask, ModalName, Theme, DateRangeMode } from "../types";

export const ViewContext = createContext({
    isModalOn: false,
    launchModal: (value: boolean) => {},
    activeModal: '',
    setActiveModal: (modalName: ModalName) => {}
})

export const SettingsContext = createContext({
    sRDateRange: 'today' as DateRangeMode,
    sRStart: new Date(),
    sREnd: new Date(),
    setSRRangeMode: (rangeMode: DateRangeMode) => {},
    setSRRangeDates: (dates: { sRStart: Date, sREnd: Date }) => {},
    theme: 'system' as Theme,
    getTheme: () => 'system' as Theme,
    setTheme: (theme: Theme) => {},
    editor: 'form' as 'form' | 'prompt',
    setEditor: (editor: 'form' | 'prompt') => {},
    saveSettings: async () => {} 
})

export const ScheduleContext = createContext({
    schedule: [] as ITask[],
    setSchedule: (schedule: ITask[]) => {},
    // refreshSchedule: (loadOnly?: boolean) => {}
    refreshSchedule: () => {}
})