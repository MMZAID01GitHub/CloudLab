import './App.css';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { withAuthenticator, AuthenticatorProps } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import react-router components
import ExperimentForm from './ExperimentForm';
import ExperimentList from './ExperimentList';
import MarketingPage from './MarketingPage';
import OngoingExperiment from './OngoingExperiment'; // Import the new OngoingExperiment component

Amplify.configure(awsconfig);

interface AppProps extends AuthenticatorProps {
  signOut?: () => void;
}

function App({ signOut }: AppProps) {
  const [username, setUsername] = useState<string | null>(null);
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

  const handleExperimentNameChange = (name: string) => {
    setExperimentName(name);
  };

  return (
    <Router>
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
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <Button
                        component={Link}
                        to="/create-experiment"
                        variant="contained"
                        color="primary"
                        sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        Create New Experiment
                      </Button>
                      <Button
                        component={Link}
                        to="/experiments"
                        variant="contained"
                        color="primary"
                        sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        View My Experiments
                      </Button>
                    </Box>
                    <MarketingPage />
                  </>
                }
              />
              <Route
                path="/create-experiment"
                element={
                  <>
                    <Button
                      component={Link}
                      to="/"
                      variant="contained"
                      color="primary"
                      sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      Back to Home
                    </Button>
                    <ExperimentForm
                      experimentName={experimentName}
                      onExperimentNameChange={handleExperimentNameChange}
                    />
                  </>
                }
              />
              <Route
                path="/experiments"
                element={
                  <>
                    <Button
                      component={Link}
                      to="/"
                      variant="contained"
                      color="primary"
                      sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      Back to Home
                    </Button>
                    <ExperimentList />
                  </>
                }
              />
              <Route
                path="/ongoing-experiment/:experimentId"
                element={
                  <>
                    <Button
                      component={Link}
                      to="/experiments"
                      variant="contained"
                      color="primary"
                      sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      Back to Experiments
                    </Button>
                    <OngoingExperiment />
                  </>
                }
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
