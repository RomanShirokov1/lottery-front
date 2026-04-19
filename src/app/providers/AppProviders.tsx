import type { PropsWithChildren } from 'react'
import { ConfigProvider } from 'antd'
import { ToastContainer } from 'react-toastify'

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#f59e0b',
          borderRadius: 10,
          fontFamily: "'EuclidCircularA', 'Segoe UI', sans-serif",
        },
      }}
    >
      {children}
      <ToastContainer position="top-right" autoClose={2500} />
    </ConfigProvider>
  )
}
