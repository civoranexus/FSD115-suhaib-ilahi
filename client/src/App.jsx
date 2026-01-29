import { BrowserRouter, Route , Routes } from 'react-router-dom'
import UserLayout from './components/layout/UserLayout'
import Home from './pages/Home'
import {Toaster} from 'sonner'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetail from './components/products/ProductDetail'
import Checkout from './components/cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetails from './pages/OrderDetails'
import MyOrderPage from './pages/MyOrderPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminHomepage from './pages/AdminHomepage'
import UserManagement from './components/admin/UserManagement'
import ProductManagement from './components/admin/ProductManagement'
import EditProduct from './components/admin/EditProduct'
import OrderManagement from './components/admin/OrderManagement'
import { Provider } from 'react-redux'
import store from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      <Route path='/' element={<UserLayout/>}>
      <Route index element={<Home/>} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='collections/:collection' element={<CollectionPage/>} />
      <Route path='products/:id' element={<ProductDetail/>}/>
      <Route path='checkout' element={<Checkout/>} />
      <Route path='order-confirmation' element={<OrderConfirmationPage/>} />
      <Route path='order-details/:id' element={<OrderDetails/>} />
      <Route path='my-orders' element={<MyOrderPage/>} />
      </Route>
      {/* <Route>{AdminLayoaut}</Route> */}
      <Route path='/admin' element={<AdminLayout/>}>
      <Route index element={<AdminHomepage/>}/>
      <Route path='users' element={<UserManagement/>}/>
      <Route path='products' element={<ProductManagement/>}/>
      <Route path='products/:id' element={<EditProduct/>}/>
      <Route path='order-management' element={<OrderManagement/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App