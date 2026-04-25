import { Button, Card, Form, Input, InputNumber, List, Space, Switch, Tag, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  createLotteryType,
  getDrawApiErrorMessage,
  getLotteryTypes,
  type CreateLotteryTypePayload,
  type LotteryType,
} from '@/entities/draw'
import styles from './AdminLotteryTypesPage.module.css'

type LotteryTypeFormValues = {
  name: string
  numbersCount: number
  minNumber: number
  maxNumber: number
  hasBonus: boolean
  bonusMin?: number
  bonusMax?: number
  description?: string
}

export const AdminLotteryTypesPage = () => {
  const [form] = Form.useForm<LotteryTypeFormValues>()
  const hasBonus = Form.useWatch('hasBonus', form) ?? false
  const [types, setTypes] = useState<LotteryType[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const loadTypes = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getLotteryTypes()
      setTypes(data)
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось загрузить типы лотерей'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTypes()
  }, [loadTypes])

  const handleCreate = async (values: LotteryTypeFormValues) => {
    setCreating(true)

    try {
      const payload: CreateLotteryTypePayload = {
        name: values.name.trim().toUpperCase(),
        numbersCount: values.numbersCount,
        minNumber: values.minNumber,
        maxNumber: values.maxNumber,
        hasBonus: values.hasBonus,
        description: values.description?.trim() || undefined,
      }

      if (values.hasBonus) {
        payload.bonusMin = values.bonusMin
        payload.bonusMax = values.bonusMax
      }

      await createLotteryType(payload)
      toast.success('Тип лотереи создан')
      form.resetFields()
      form.setFieldValue('hasBonus', false)
      await loadTypes()
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось создать тип лотереи'))
    } finally {
      setCreating(false)
    }
  }

  const sortedTypes = useMemo(() => {
    return [...types].sort((left, right) => left.name.localeCompare(right.name))
  }, [types])

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Создать тип лотереи">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ hasBonus: false }}
          onFinish={(values) => void handleCreate(values)}
        >
          <div className={styles.formRow}>
            <Form.Item
              className={styles.formCol}
              label="Код типа"
              name="name"
              rules={[
                { required: true, message: 'Введите код типа' },
                {
                  pattern: /^[A-Z_]{3,30}$/,
                  message: 'Только A-Z и _, длина 3..30',
                },
              ]}
            >
              <Input size="large" placeholder="Например: CLASSIC" />
            </Form.Item>

            <Form.Item
              className={styles.formCol}
              label="Количество чисел"
              name="numbersCount"
              rules={[{ required: true, message: 'Укажите количество чисел' }]}
            >
              <InputNumber size="large" min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className={styles.formRow}>
            <Form.Item
              className={styles.formCol}
              label="Минимальное число"
              name="minNumber"
              rules={[{ required: true, message: 'Укажите minNumber' }]}
            >
              <InputNumber size="large" min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              className={styles.formCol}
              label="Максимальное число"
              name="maxNumber"
              rules={[{ required: true, message: 'Укажите maxNumber' }]}
            >
              <InputNumber size="large" min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item label="Бонусный шар" name="hasBonus" valuePropName="checked">
            <Switch />
          </Form.Item>

          {hasBonus ? (
            <div className={styles.bonusBlock}>
              <p className={styles.bonusTitle}>Диапазон бонусного шара</p>
              <div className={styles.formRow}>
                <Form.Item
                  className={styles.formCol}
                  label="bonusMin"
                  name="bonusMin"
                  rules={[{ required: true, message: 'Укажите bonusMin' }]}
                >
                  <InputNumber size="large" min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  className={styles.formCol}
                  label="bonusMax"
                  name="bonusMax"
                  rules={[{ required: true, message: 'Укажите bonusMax' }]}
                >
                  <InputNumber size="large" min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </div>
          ) : null}

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={3} placeholder="Опционально" />
          </Form.Item>

          <Button type="primary" size="large" htmlType="submit" loading={creating}>
            Создать тип
          </Button>
        </Form>
      </Card>

      <Card title="Список типов лотерей" loading={loading}>
        <List
          dataSource={sortedTypes}
          locale={{ emptyText: 'Типы лотерей пока не созданы' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Typography.Text strong>{item.name}</Typography.Text>
                    {item.hasBonus ? <Tag color="gold">BONUS</Tag> : null}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={2}>
                    <Typography.Text type="secondary">
                      Основной диапазон: {item.minNumber}..{item.maxNumber}, чисел: {item.numbersCount}
                    </Typography.Text>
                    {item.hasBonus ? (
                      <Typography.Text type="secondary">
                        Бонусный диапазон: {item.bonusMin}..{item.bonusMax}
                      </Typography.Text>
                    ) : null}
                    {item.description ? <Typography.Text>{item.description}</Typography.Text> : null}
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
