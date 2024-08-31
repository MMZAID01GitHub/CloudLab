import './App.css';

import { Amplify } from 'aws-amplify';
import { withAuthenticator, AuthenticatorProps } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';



// Configure Amplify
Amplify.configure(awsconfig);

interface AppProps extends AuthenticatorProps {
  signOut: () => void;
}

function App({ signOut }: AppProps) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user && user.signInDetails?.loginId) {
          // Extract part before @
          const emailPart = user.signInDetails.loginId.split('@')[0];
          setUsername(emailPart);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome, {username ? username : 'Loading...'}</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
