import { AxiosError } from 'axios'
import { api } from '@/shared/api/base'

export type DrawStatus = 'DRAFT' | 'ACTIVE' | 'FINISHED' | 'CANCELLED'

export type AdminDraw = {
  id: number
  name: string
  lotteryTypeName: string
  status: DrawStatus
  winningNumbers: string | null
  winningBonus: number | null
  createdAt: string
  finishedAt: string | null
  description: string | null
}

export type LotteryType = {
  name: string
  numbersCount: number
  minNumber: number
  maxNumber: number
  hasBonus: boolean
  bonusMin: number | null
  bonusMax: number | null
  description: string | null
}

export type CreateDrawPayload = {
  name: string
  lotteryTypeName: string
  description?: string
}

export type CreateLotteryTypePayload = {
  name: string
  numbersCount: number
  minNumber: number
  maxNumber: number
  hasBonus: boolean
  bonusMin?: number
  bonusMax?: number
  description?: string
}

export type TicketStatus = 'PENDING' | 'WIN' | 'LOSE'

export type AdminTicket = {
  id: number
  drawId: number
  userId: number
  numbers: string
  bonus: number | null
  status: TicketStatus
  createdAt: string
}

export type AdminDrawReport = {
  draw: AdminDraw
  tickets: AdminTicket[]
}

type ApiErrorResponse = {
  message?: string
}

export const getAdminDraws = async () => {
  const response = await api.get<AdminDraw[]>('/draws')
  return response.data
}

export const getAdminDrawById = async (drawId: number) => {
  const response = await api.get<AdminDraw>(`/draws/${drawId}`)
  return response.data
}

export const createAdminDraw = async (payload: CreateDrawPayload) => {
  const response = await api.post<AdminDraw>('/draws', payload)
  return response.data
}

export const startAdminDraw = async (drawId: number) => {
  const response = await api.post<AdminDraw>(`/draws/${drawId}/start`)
  return response.data
}

export const finishAdminDraw = async (drawId: number) => {
  const response = await api.post<AdminDraw>(`/draws/${drawId}/finish`)
  return response.data
}

export const cancelAdminDraw = async (drawId: number) => {
  await api.post(`/draws/${drawId}/cancel`)
}

export const getLotteryTypes = async () => {
  const response = await api.get<LotteryType[]>('/lottery-types')
  return response.data
}

export const createLotteryType = async (payload: CreateLotteryTypePayload) => {
  const response = await api.post<LotteryType>('/lottery-types', payload)
  return response.data
}

export const getAdminDrawReportJson = async (drawId: number) => {
  const response = await api.get<AdminDrawReport>(`/reports/draws/${drawId}`, {
    params: { format: 'json' },
  })
  return response.data
}

export const getAdminDrawReportCsv = async (drawId: number) => {
  const response = await api.get<string>(`/reports/draws/${drawId}`, {
    params: { format: 'csv' },
    responseType: 'text',
  })
  return response.data
}

export const getDrawApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return axiosError.response?.data?.message ?? fallback
  }

  return fallback
}
