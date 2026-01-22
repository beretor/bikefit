import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const Login = ({ onSuccess, onError }) => {
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => onSuccess(codeResponse),
        onError: (error) => onError(error),
        scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
        flow: 'implicit', // Using implicit specifically for simple client-side access
    });

    return (
        <div className="login-container glass" style={{ padding: '3rem', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(45deg, #FFB7B2, #68D2E7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Family Photos</h1>
            <p style={{ marginBottom: '2rem', color: '#ccc' }}>
                Connect your Google Photos account to view your family memories in a beautiful gallery.
            </p>
            <button className="btn-primary" onClick={() => login()}>
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
