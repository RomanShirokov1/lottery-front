import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/shared/assets/styles/index.css';
import { App } from '@/app/App';

createRoot(document.getElementById('root')!).render(<App />);
