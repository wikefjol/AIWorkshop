import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './lib/components/Layout'
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscriptions'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />,
      },
      {
        path: 'settings',
        element: <div className="p-4 text-gray-500">Settings coming soon</div>,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
