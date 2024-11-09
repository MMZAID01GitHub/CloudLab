import './App.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, AuthenticatorProps } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import ExperimentForm from './ExperimentForm';
import ExperimentList from './ExperimentList';
import MarketingPage from './MarketingPage'; // Import MarketingPage

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

  const handleGoHome = () => {
    setViewMode(null); // Go back to the home screen
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="welcome-message">
          Welcome to CloudLab{username ? `, ${username}!` : '!'}
        </h1>
        <p className="tagline">Optimize and streamline your experiments with ease</p>
        <Button
          variant="contained"
          color="secondary"
          className="sign-out-button"
          onClick={() => signOut && signOut()}
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          Sign out
        </Button>
      </header>
      <main className="main-content">
        {username && (
          <>
            {viewMode === null ? (
              <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartNewExperiment}
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Create New Experiment
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleViewExperiments}
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  View My Experiments
                </Button>
              </Box>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGoHome}
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Back to Home
                </Button>
                {viewMode === 'form' ? (
                  <ExperimentForm
                    experimentName={experimentName}
                    onExperimentNameChange={handleExperimentNameChange}
                  />
                ) : (
                  <ExperimentList />
                )}
              </>
            )}

            {/* Conditionally render the MarketingPage */}
            {viewMode === null && <MarketingPage />}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(App);
