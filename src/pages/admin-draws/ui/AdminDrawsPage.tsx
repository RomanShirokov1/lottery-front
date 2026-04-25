import { Button, Card, Form, Input, List, Select, Space, Tag, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  cancelAdminDraw,
  createAdminDraw,
  finishAdminDraw,
  getAdminDraws,
  getDrawApiErrorMessage,
  getLotteryTypes,
  startAdminDraw,
  type AdminDraw,
} from '@/entities/draw'
import { ROUTES } from '@/shared/config/routes'
import styles from './AdminDrawsPage.module.css'

type CreateDrawFormValues = {
  name: string
  lotteryTypeName: string
  description?: string
}

const STATUS_COLOR: Record<AdminDraw['status'], string> = {
  DRAFT: 'default',
  ACTIVE: 'processing',
  FINISHED: 'success',
  CANCELLED: 'error',
}

const formatDateTime = (value: string | null) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('ru-RU')
}

export const AdminDrawsPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm<CreateDrawFormValues>()
  const [draws, setDraws] = useState<AdminDraw[]>([])
  const [lotteryTypeOptions, setLotteryTypeOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [actionDrawId, setActionDrawId] = useState<number | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const [drawsData, lotteryTypes] = await Promise.all([getAdminDraws(), getLotteryTypes()])
      setDraws(drawsData)
      setLotteryTypeOptions(lotteryTypes.map((item) => item.name))
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось загрузить тиражи и типы лотерей'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleCreate = async (values: CreateDrawFormValues) => {
    setCreating(true)

    try {
      await createAdminDraw({
        name: values.name.trim(),
        lotteryTypeName: values.lotteryTypeName,
        description: values.description?.trim() || undefined,
      })

      toast.success('Тираж создан')
      form.resetFields()
      await loadData()
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось создать тираж'))
    } finally {
      setCreating(false)
    }
  }

  const handleAction = async (
    drawId: number,
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setActionDrawId(drawId)

    try {
      await action()
      toast.success(successMessage)
      await loadData()
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось выполнить действие'))
    } finally {
      setActionDrawId(null)
    }
  }

  const sortedDraws = useMemo(() => {
    return [...draws].sort((left, right) => right.id - left.id)
  }, [draws])

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Создать тираж">
        <Form form={form} layout="vertical" onFinish={(values) => void handleCreate(values)}>
          <div className={styles.formRow}>
            <Form.Item
              className={styles.formCol}
              label="Название"
              name="name"
              rules={[{ required: true, message: 'Введите название тиража' }]}
            >
              <Input size="large" placeholder="Например: Весенний розыгрыш" />
            </Form.Item>

            <Form.Item
              className={styles.formCol}
              label="Тип лотереи"
              name="lotteryTypeName"
              rules={[{ required: true, message: 'Выберите тип лотереи' }]}
            >
              <Select
                size="large"
                placeholder="Выберите тип"
                options={lotteryTypeOptions.map((item) => ({ label: item, value: item }))}
              />
            </Form.Item>
          </div>

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} placeholder="Опционально" />
          </Form.Item>

          <Button type="primary" size="large" htmlType="submit" loading={creating}>
            Создать тираж
          </Button>
        </Form>
      </Card>

      <Card title="Список тиражей" loading={loading}>
        <List
          dataSource={sortedDraws}
          locale={{ emptyText: 'Тиражей пока нет' }}
          renderItem={(draw) => (
            <List.Item
              actions={[
                draw.status === 'DRAFT' ? (
                  <Button
                    key={`start-${draw.id}`}
                    type="link"
                    className={styles.actionStart}
                    loading={actionDrawId === draw.id}
                    onClick={() =>
                      void handleAction(draw.id, () => startAdminDraw(draw.id), 'Тираж запущен')
                    }
                  >
                    Запустить
                  </Button>
                ) : null,
                draw.status === 'ACTIVE' ? (
                  <Button
                    key={`finish-${draw.id}`}
                    type="link"
                    className={styles.actionFinish}
                    loading={actionDrawId === draw.id}
                    onClick={() =>
                      void handleAction(draw.id, () => finishAdminDraw(draw.id), 'Тираж завершен')
                    }
                  >
                    Завершить
                  </Button>
                ) : null,
                draw.status === 'DRAFT' || draw.status === 'ACTIVE' ? (
                  <Button
                    key={`cancel-${draw.id}`}
                    danger
                    type="link"
                    className={styles.actionCancel}
                    loading={actionDrawId === draw.id}
                    onClick={() =>
                      void handleAction(draw.id, () => cancelAdminDraw(draw.id), 'Тираж отменен')
                    }
                  >
                    Отменить
                  </Button>
                ) : null,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Typography.Text strong>{draw.name}</Typography.Text>
                    <Tag color={STATUS_COLOR[draw.status]}>{draw.status}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={2}>
                    <Typography.Text type="secondary">
                      ID: {draw.id} | Тип: {draw.lotteryTypeName}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      Создан: {formatDateTime(draw.createdAt)}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      Завершен: {formatDateTime(draw.finishedAt)}
                    </Typography.Text>
                    {draw.description ? <Typography.Text>{draw.description}</Typography.Text> : null}
                    <Button
                      type="link"
                      className={styles.actionDetails}
                      onClick={() => navigate(`${ROUTES.adminReports}?drawId=${draw.id}`)}
                    >
                      К отчету
                    </Button>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  )
}
