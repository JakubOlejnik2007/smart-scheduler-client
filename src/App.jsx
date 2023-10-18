import './App.css'
import GoogleAuth from './components/GoogleAuth'
import { GoogleOAuthProvider } from '@react-oauth/google'
function App() {

  return (
    <>
    <GoogleOAuthProvider clientId="898936791621-01qkppvr5vu4k9ae4p0mooqpnslmo1p2.apps.googleusercontent.com">
      <GoogleAuth></GoogleAuth></GoogleOAuthProvider>
    </>
  )
}

export default App
