import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Gallery from './components/Gallery'
import { getPhotos } from './services/googlePhotos'

function App() {
  const [token, setToken] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLoginSuccess = (tokenResponse) => {
    setToken(tokenResponse.access_token);
  };

  const handleLoginError = (error) => {
    console.error('Login Failed:', error);
    setError('Failed to login via Google.');
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      getPhotos(token)
        .then(data => {
          setPhotos(data.mediaItems || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to fetch photos.');
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <>
      <header style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 300, letterSpacing: '2px' }}>FAMILY<span style={{ fontWeight: 700 }}>MOMENTS</span></h2>
      </header>

      <main>
        {error && <div style={{ color: '#ff6b6b', padding: '1rem' }}>{error}</div>}

        {!token ? (
          <Login onSuccess={handleLoginSuccess} onError={handleLoginError} />
        ) : (
          <>
            {loading ? <p>Loading memories...</p> : <Gallery photos={photos} />}
          </>
        )}
      </main>
    </>
  )
}

export default App
