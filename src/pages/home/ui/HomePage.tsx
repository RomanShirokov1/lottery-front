import { Button, Card, Flex, Space, Typography } from 'antd'
import { toast } from 'react-toastify'
import { useAppStore } from '@/shared/store/app.store'
import { removeAuthToken, setAuthToken } from '@/shared/lib/cookies/auth-token'
import { api } from '@/shared/api/base'

export const HomePage = () => {
  const { ticketsCount, incrementTickets, resetTickets } = useAppStore()

  const handleFakeLogin = async () => {
    setAuthToken('hackathon-temp-token')
    toast.success('Токен сохранен в cookie')

    try {
      await api.get('/health')
    } catch {
      toast.info('Бэкенд пока не подключен, это нормально для старта')
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    resetTickets()
    toast.warning('Cookie очищены')
  }

  return (
    <Flex justify="center" align="center" className="page-center">
      <Card
        title="Lottery Front"
        style={{ width: 'min(560px, 100%)' }}
        extra={<Typography.Text type="secondary">FSD starter</Typography.Text>}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Базовый каркас готов: роутинг, `antd`, `axios`, `zustand`, cookies и
            toast-уведомления.
          </Typography.Paragraph>

          <Flex gap={8} wrap="wrap">
            <Button type="primary" onClick={incrementTickets}>
              +1 билет ({ticketsCount})
            </Button>
            <Button onClick={handleFakeLogin}>Проверка API/Cookie</Button>
            <Button danger onClick={handleLogout}>
              Очистить состояние
            </Button>
          </Flex>
        </Space>
      </Card>
    </Flex>
  )
}
