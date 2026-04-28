import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Descriptions, Empty, Row, Space, Spin, Tag, Typography } from 'antd'
import {
  buyTicketForDraw,
  getAdminDraws,
  getDrawApiErrorMessage,
  getLotteryTypes,
  type AdminDraw,
  type LotteryType,
  type UserTicket,
} from '@/entities/draw'

export const UserDrawsPage = () => {
  const [draws, setDraws] = useState<AdminDraw[]>([])
  const [lotteryTypes, setLotteryTypes] = useState<Record<string, LotteryType>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyingDrawId, setBuyingDrawId] = useState<number | null>(null)
  const [lastTicket, setLastTicket] = useState<UserTicket | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [drawsData, typesData] = await Promise.all([getAdminDraws(), getLotteryTypes()])

        const typesMap = typesData.reduce<Record<string, LotteryType>>((acc, item) => {
          acc[item.name] = item
          return acc
        }, {})

        setDraws(drawsData)
        setLotteryTypes(typesMap)
      } catch (err) {
        setError(getDrawApiErrorMessage(err, 'Не удалось загрузить тиражи'))
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const activeDraws = useMemo(
    () => draws.filter((draw) => draw.status === 'ACTIVE'),
    [draws],
  )

  const onBuyTicket = async (drawId: number) => {
    setBuyingDrawId(drawId)
    setError(null)

    try {
      const createdTicket = await buyTicketForDraw(drawId)
      setLastTicket(createdTicket)
    } catch (err) {
      setError(
        getDrawApiErrorMessage(
          err,
          'Не удалось купить билет. Проверьте, что backend поддерживает POST /draws/{drawId}/tickets',
        ),
      )
    } finally {
      setBuyingDrawId(null)
    }
  }

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Доступные тиражи">
        {error ? <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} /> : null}

        {activeDraws.length === 0 ? (
          <Empty description="Сейчас нет активных тиражей" />
        ) : (
          <Row gutter={[16, 16]}>
            {activeDraws.map((draw) => {
              const lotteryType = lotteryTypes[draw.lotteryTypeName]

              return (
                <Col key={draw.id} xs={24} md={12} xl={8}>
                  <Card
                    title={draw.name}
                    extra={<Tag color="green">ACTIVE</Tag>}
                    actions={[
                      <Button
                        key="buy"
                        type="primary"
                        loading={buyingDrawId === draw.id}
                        onClick={() => void onBuyTicket(draw.id)}
                      >
                        Купить билет
                      </Button>,
                    ]}
                  >
                    <Space direction="vertical" size={8}>
                      <Typography.Text type="secondary">
                        Тип: {draw.lotteryTypeName}
                      </Typography.Text>
                      {draw.description ? (
                        <Typography.Paragraph style={{ marginBottom: 0 }}>
                          {draw.description}
                        </Typography.Paragraph>
                      ) : null}
                      {lotteryType ? (
                        <Typography.Text type="secondary">
                          Формат: {lotteryType.numbersCount} чисел ({lotteryType.minNumber}..{lotteryType.maxNumber})
                        </Typography.Text>
                      ) : null}
                    </Space>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )}
      </Card>

      {lastTicket ? (
        <Card title="Последний купленный билет">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID билета">{lastTicket.id}</Descriptions.Item>
            <Descriptions.Item label="Тираж">{lastTicket.drawId}</Descriptions.Item>
            <Descriptions.Item label="Комбинация">{lastTicket.numbers}</Descriptions.Item>
            <Descriptions.Item label="Бонус">
              {lastTicket.bonus ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Статус">{lastTicket.status}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : null}
    </Space>
  )
}
