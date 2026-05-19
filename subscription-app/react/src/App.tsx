import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './lib/components/Layout'
import Subscriptions from './pages/Subscriptions'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div className="p-4">Dashboard coming soon</div>,
      },
      {
        path: 'subscriptions',
        element: <Subscriptions />,
      },
      {
        path: 'settings',
        element: <div className="p-4">Settings coming soon</div>,
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
