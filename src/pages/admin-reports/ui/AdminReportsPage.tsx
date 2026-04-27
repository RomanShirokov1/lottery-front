import { Button, Card, Form, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'react-toastify';
import {
  getAdminDraws,
  getAdminDrawReportCsv,
  getAdminDrawReportJson,
  type AdminDraw,
  getDrawApiErrorMessage,
  type AdminDrawReport,
  type TicketStatus,
} from '@/entities/draw';
import styles from './AdminReportsPage.module.css';

type ReportFormValues = {
  drawId: number;
};

const downloadCsv = (drawId: number, csv: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `draw-report-${drawId}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadJson = (drawId: number, data: AdminDrawReport) => {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `draw-report-${drawId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('ru-RU');
};

const STATUS_CHART_COLORS: Record<TicketStatus, string> = {
  WIN: '#16a34a',
  LOSE: '#dc2626',
  PENDING: '#64748b',
};

export const AdminReportsPage = () => {
  const [form] = Form.useForm<ReportFormValues>();
  const [searchParams] = useSearchParams();
  const [drawsLoading, setDrawsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [report, setReport] = useState<AdminDrawReport | null>(null);
  const [draws, setDraws] = useState<AdminDraw[]>([]);

  const getDrawId = async () => {
    const values = await form.validateFields(['drawId']);
    return values.drawId;
  };

  const handleLoadDraws = async () => {
    setDrawsLoading(true);

    try {
      const response = await getAdminDraws();
      setDraws(response);
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось загрузить список тиражей'));
    } finally {
      setDrawsLoading(false);
    }
  };

  const handleGetReport = async () => {
    setReportLoading(true);

    try {
      const drawId = await getDrawId();
      const response = await getAdminDrawReportJson(drawId);
      setReport(response);
      toast.success('Отчет загружен');
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось получить отчет'));
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadJson = async () => {
    if (!report) {
      return;
    }

    setJsonLoading(true);

    try {
      downloadJson(report.draw.id, report);
      toast.success('JSON отчет выгружен');
    } finally {
      setJsonLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    if (!report) {
      return;
    }

    setCsvLoading(true);

    try {
      const csv = await getAdminDrawReportCsv(report.draw.id);
      downloadCsv(report.draw.id, csv);
      toast.success('CSV отчет выгружен');
    } catch (error) {
      toast.error(getDrawApiErrorMessage(error, 'Не удалось получить CSV отчет'));
    } finally {
      setCsvLoading(false);
    }
  };

  const statusStats = useMemo(() => {
    const counters: Record<TicketStatus, number> = {
      PENDING: 0,
      WIN: 0,
      LOSE: 0,
    };

    if (!report) {
      return counters;
    }

    for (const ticket of report.tickets) {
      counters[ticket.status] += 1;
    }

    return counters;
  }, [report]);

  const statusChartData = useMemo(() => {
    return [
      { name: 'WIN', value: statusStats.WIN, fill: STATUS_CHART_COLORS.WIN },
      { name: 'LOSE', value: statusStats.LOSE, fill: STATUS_CHART_COLORS.LOSE },
      { name: 'PENDING', value: statusStats.PENDING, fill: STATUS_CHART_COLORS.PENDING },
    ];
  }, [statusStats]);

  useEffect(() => {
    void handleLoadDraws();
  }, []);

  useEffect(() => {
    const queryDrawId = Number(searchParams.get('drawId'));
    if (!Number.isFinite(queryDrawId) || queryDrawId <= 0) {
      return;
    }

    form.setFieldValue('drawId', queryDrawId);
    void handleGetReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Отчет по тиражу">
        <Form form={form} layout="vertical">
          <div className={styles.formRow}>
            <Form.Item
              className={styles.formCol}
              label="Тираж"
              name="drawId"
              rules={[{ required: true, message: 'Укажите ID тиража' }]}>
              <Select
                size="large"
                showSearch
                loading={drawsLoading}
                placeholder="Выберите тираж"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={draws.map((draw) => ({
                  value: draw.id,
                  label: `${draw.name} (ID: ${draw.id})`,
                }))}
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            size="large"
            loading={reportLoading}
            onClick={() => void handleGetReport()}>
            Получить отчет
          </Button>
        </Form>
      </Card>

      {report ? (
        <Card title={`Отчет по тиражу #${report.draw.id}`}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space wrap className={styles.reportActions}>
              <Button
                size="large"
                className={styles.downloadJsonBtn}
                loading={jsonLoading}
                onClick={() => void handleDownloadJson()}>
                Скачать JSON
              </Button>
              <Button
                size="large"
                className={styles.downloadCsvBtn}
                loading={csvLoading}
                onClick={() => void handleDownloadCsv()}>
                Скачать CSV
              </Button>
            </Space>

            <Space wrap>
              <Tag color="processing">{report.draw.status}</Tag>
              <Typography.Text strong>{report.draw.name}</Typography.Text>
              <Typography.Text type="secondary">Тип: {report.draw.lotteryTypeName}</Typography.Text>
            </Space>
            {report.draw.winningNumbers ? (
              <Space wrap>
                <Typography.Text>
                  Выигрышные числа: <b>{report.draw.winningNumbers}</b>
                </Typography.Text>
                {report.draw.winningBonus !== null ? (
                  <Typography.Text>
                    Бонус: <b>{report.draw.winningBonus}</b>
                  </Typography.Text>
                ) : null}
              </Space>
            ) : null}

            <div className={styles.statsRow}>
              <Card size="small" className={styles.statCard}>
                <Statistic title="Всего билетов" value={report.tickets.length} />
              </Card>
              <Card size="small" className={styles.statCard}>
                <Statistic title="WIN" value={statusStats.WIN} />
              </Card>
              <Card size="small" className={styles.statCard}>
                <Statistic title="LOSE" value={statusStats.LOSE} />
              </Card>
              <Card size="small" className={styles.statCard}>
                <Statistic title="PENDING" value={statusStats.PENDING} />
              </Card>
            </div>

            <div className={styles.chartsRow}>
              <Card size="small" className={styles.chartCard} title="Распределение статусов">
                <div className={styles.chartWrap}>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label>
                        {statusChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card size="small" className={styles.chartCard} title="Сравнение статусов">
                <div className={styles.chartWrap}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statusChartData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {statusChartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Table
              rowKey="id"
              size="small"
              dataSource={report.tickets}
              pagination={{ pageSize: 10 }}
              columns={[
                { title: 'ID', dataIndex: 'id', width: 70 },
                { title: 'User ID', dataIndex: 'userId', width: 90 },
                { title: 'Numbers', dataIndex: 'numbers' },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  render: (status: TicketStatus) => {
                    if (status === 'WIN') {
                      return <Tag color="success">WIN</Tag>;
                    }
                    if (status === 'LOSE') {
                      return <Tag color="error">LOSE</Tag>;
                    }
                    return <Tag color="default">PENDING</Tag>;
                  },
                },
                {
                  title: 'Created',
                  dataIndex: 'createdAt',
                  render: (value: string) => formatDateTime(value),
                },
              ]}
            />
          </Space>
        </Card>
      ) : null}
    </Space>
  );
};
