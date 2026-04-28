import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Modal, Space, Spin, Table, Tag, Typography } from 'antd'
import {
  getDrawApiErrorMessage,
  getUserTicketResult,
  getUserTickets,
  type TicketStatus,
  type UserTicket,
  type UserTicketResultResponse,
} from '@/entities/draw'

const PAGE_SIZE = 10

const STATUS_COLORS: Record<TicketStatus, string> = {
  PENDING: 'default',
  WIN: 'success',
  LOSE: 'error',
}

export const UserTicketsPage = () => {
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [resultModalOpen, setResultModalOpen] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)
  const [resultData, setResultData] = useState<UserTicketResultResponse | null>(null)
  const [resultTicketId, setResultTicketId] = useState<number | null>(null)

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true)
      setError(null)
      try {
        const offset = (page - 1) * PAGE_SIZE
        const response = await getUserTickets(PAGE_SIZE, offset)
        setTickets(response.tickets)
        setTotal(response.total)
      } catch (err) {
        setError(getDrawApiErrorMessage(err, 'Не удалось загрузить билеты'))
      } finally {
        setLoading(false)
      }
    }

    void loadTickets()
  }, [page])

  const onCheckResult = async (ticketId: number) => {
    setResultModalOpen(true)
    setResultLoading(true)
    setResultTicketId(ticketId)
    setResultData(null)
    try {
      const response = await getUserTicketResult(ticketId)
      setResultData(response)
    } catch (err) {
      setError(getDrawApiErrorMessage(err, 'Не удалось получить результат билета'))
      setResultModalOpen(false)
    } finally {
      setResultLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
      { title: 'Тираж', dataIndex: 'drawId', key: 'drawId', width: 100 },
      { title: 'Комбинация', dataIndex: 'numbers', key: 'numbers' },
      {
        title: 'Бонус',
        dataIndex: 'bonus',
        key: 'bonus',
        width: 100,
        render: (value: number | null) => value ?? '—',
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: TicketStatus) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
      },
      {
        title: 'Действия',
        key: 'actions',
        width: 170,
        render: (_: unknown, ticket: UserTicket) => (
          <Button onClick={() => void onCheckResult(ticket.id)}>Проверить результат</Button>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <Card title="Мои билеты">
        {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}

        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={tickets}
            pagination={{
              current: page,
              pageSize: PAGE_SIZE,
              total,
              onChange: (nextPage) => setPage(nextPage),
              showSizeChanger: false,
            }}
          />
        )}
      </Card>

      <Modal
        title={resultTicketId ? `Результат билета #${resultTicketId}` : 'Результат билета'}
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        footer={null}
      >
        {resultLoading ? (
          <Spin />
        ) : resultData ? (
          <Space direction="vertical">
            <Typography.Text>
              Статус:{' '}
              <Tag color={STATUS_COLORS[resultData.status]}>{resultData.status}</Tag>
            </Typography.Text>
            <Typography.Text>
              Выигрышная комбинация: {resultData.winningCombination ?? 'Пока недоступна'}
            </Typography.Text>
          </Space>
        ) : null}
      </Modal>
    </>
  )
}
