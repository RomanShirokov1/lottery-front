import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

export const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Страница не найдена"
      extra={
        <Button type="primary">
          <Link to={ROUTES.home}>На главную</Link>
        </Button>
      }
    />
  )
}
