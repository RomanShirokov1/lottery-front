import { Button, Card, Flex, Typography } from 'antd'
import { useAuthStore } from '@/entities/auth'

export const UserDashboardPage = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <Flex justify="center" align="center" className="page-center">
      <Card title="User Area" style={{ width: 'min(480px, 100%)' }}>
        <Typography.Paragraph>
          User pages will be added here.
        </Typography.Paragraph>
        <Button onClick={logout}>Logout</Button>
      </Card>
    </Flex>
  )
}
