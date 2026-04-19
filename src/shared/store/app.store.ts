import { create } from 'zustand'

type AppState = {
  ticketsCount: number
  incrementTickets: () => void
  resetTickets: () => void
}

export const useAppStore = create<AppState>((set) => ({
  ticketsCount: 0,
  incrementTickets: () =>
    set((state) => ({
      ticketsCount: state.ticketsCount + 1,
    })),
  resetTickets: () => set({ ticketsCount: 0 }),
}))
