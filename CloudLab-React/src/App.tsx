import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, AuthenticatorProps } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import ExperimentForm from './ExperimentForm';
import ExperimentList from './ExperimentList';

Amplify.configure(awsconfig);

interface AppProps extends AuthenticatorProps {
  signOut?: () => void;
}

function App({ signOut }: AppProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'list' | null>(null);
  const [experimentName, setExperimentName] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (user && user.signInDetails?.loginId) {
          const emailPart = user.signInDetails.loginId.split('@')[0];
          setUsername(emailPart);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
  }, []);

  const handleStartNewExperiment = () => {
    setViewMode('form');
  };

  const handleViewExperiments = () => {
    setViewMode('list');
  };

  const handleExperimentNameChange = (name: string) => {
    setExperimentName(name);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="welcome-message">
          Welcome to CloudLab{username ? `, ${username}!` : '!'}
        </h1>
        <p className="tagline">Optimize and streamline your experiments with ease</p>
        <button className="sign-out-button" onClick={() => signOut && signOut()}>
          Sign out
        </button>
      </header>
      <main className="main-content">
        {username && (
          viewMode === null ? (
            <>
              <button
                className="create-experiment-button"
                onClick={handleStartNewExperiment}
              >
                Create New Experiment
              </button>
              <button
                className="view-experiments-button"
                onClick={handleViewExperiments}
              >
                View My Experiments
              </button>
            </>
          ) : viewMode === 'form' ? (
            <ExperimentForm
              experimentName={experimentName}
              onExperimentNameChange={handleExperimentNameChange}
            />
          ) : (
            <ExperimentList />
          )
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(App);
