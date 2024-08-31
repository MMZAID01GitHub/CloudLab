import './App.css';

import { Amplify } from 'aws-amplify';
import { withAuthenticator, AuthenticatorProps } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';


// Configure Amplify
Amplify.configure(awsconfig);

interface AppProps extends AuthenticatorProps {
  signOut: () => void;
}

function App({ signOut }: AppProps) {
  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
