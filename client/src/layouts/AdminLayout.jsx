import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import AdminSidebar from '../components/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1">
          <div className="container-section">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
