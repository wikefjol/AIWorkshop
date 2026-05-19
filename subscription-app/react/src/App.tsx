import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './lib/components/Layout'
import { Dashboard } from './pages/Dashboard'

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
        element: <div className="text-gray-600">Subscriptions coming soon</div>,
      },
      {
        path: 'settings',
        element: <div className="text-gray-600">Settings coming soon</div>,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
