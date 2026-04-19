import { Button, Card, Flex, Space, Typography } from 'antd'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/entities/auth'
import { api } from '@/shared/api/base'
import { useAppStore } from '@/shared/store/app.store'

export const HomePage = () => {
  const logout = useAuthStore((state) => state.logout)
  const { ticketsCount, incrementTickets, resetTickets } = useAppStore()

  const handleHealthCheck = async () => {
    try {
      await api.get('/health')
      toast.success('Backend health check done')
    } catch {
      toast.info('Backend is not connected yet')
    }
  }

  const handleLogout = () => {
    logout()
    resetTickets()
    toast.warning('Session cleared')
  }

  return (
    <Flex justify="center" align="center" className="page-center">
      <Card
        title="Lottery Front"
        style={{ width: 'min(560px, 100%)' }}
        extra={<Typography.Text type="secondary">Protected Area</Typography.Text>}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Protected app area. Auth page is available at `/auth`.
          </Typography.Paragraph>

          <Flex gap={8} wrap="wrap">
            <Button type="primary" onClick={incrementTickets}>
              +1 ticket ({ticketsCount})
            </Button>
            <Button onClick={handleHealthCheck}>Check API</Button>
            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Space>
      </Card>
    </Flex>
  )
}
