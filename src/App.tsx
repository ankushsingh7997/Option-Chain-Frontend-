import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './graphql/user/user'
import { setUserData, clearUserData } from './store/slices/userSlice'
import { selectUserData, userLoggedIn } from './store/selectors'
import Dashboard from './pages/Dashboard'
import Broker from './pages/Broker'
import SignIn from './pages/SignIn'
import ProtectedRoute from './Protection/protectedRoute'
import './App.css'
import SignUp from './pages/Signup'
import Loading from './components/ui/general/Loader'
import { useBrokerData } from './hooks/useBrokerData'
import ToastContainer from './components/ui/general/ToastContainer'

function App() {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const isLoggedIn = useSelector(userLoggedIn)
  
  const { data, loading, error } = useQuery(getUser, {errorPolicy: 'all',fetchPolicy: 'cache-and-network'})

  const { triggerLazyFetch } = useBrokerData({fetchPolicy: 'lazy',autoFetch: true,});

  useEffect(() => {
    if (data?.getUser) {
      const { status, data: userInfo } = data.getUser
      if (status ) dispatch(setUserData({name: userInfo.name,email: userInfo.email,number: userInfo.number, loginStatus:true}))
      else dispatch(clearUserData())
    }
  }, [data, dispatch])


  useEffect(() => {
    if (error) dispatch(clearUserData())
  }, [error, dispatch])


  useEffect(() => {
    if (isLoggedIn && userData && !loading) {
      triggerLazyFetch();
    }
  }, [isLoggedIn, userData, loading, triggerLazyFetch])

  if (loading && !userData) {
    return <Loading />
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/signin" 
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />
          } 
        />
        <Route 
          path="/signup" 
          element={ <SignUp/> } 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn} isLoading={loading}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/broker"
          element={
            <ProtectedRoute isAuthenticated={isLoggedIn} isLoading={loading}>
              <Broker />
            </ProtectedRoute>
          }
        />
      
        <Route 
          path="/" 
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/signin"} replace />
          } 
        />
        
        <Route 
          path="*" 
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/signin"} replace />
          } 
        />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App