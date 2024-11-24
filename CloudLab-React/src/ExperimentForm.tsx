import React, { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, SelectChangeEvent } from '@mui/material';
import { Link } from 'react-router-dom';
import Variables from './Variables';
import { getCurrentUser } from 'aws-amplify/auth';

interface ExperimentFormProps {
  experimentName: string;
  onExperimentNameChange: (name: string) => void;
}

const ExperimentForm: React.FC<ExperimentFormProps> = ({ experimentName, onExperimentNameChange }) => {
  const [variables, setVariables] = useState<any[]>([]);
  const [goal, setGoal] = useState('minimize');
  const [populationSize, setPopulationSize] = useState<number>(10);
  
  // Feedback states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isSaved, setIsSaved] = useState(false);

  const addVariable = () => {
    setVariables([...variables, { name: '', min: '', max: '', type: 'continuous', customValues: [] }]);
  };

  const handleGoalChange = (event: SelectChangeEvent<string>) => {
    setGoal(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const currentUser = await getCurrentUser();
      const userId = currentUser.userId;

      const experimentData = {
        userId: userId,
        experimentName: experimentName,
        variables: variables,
        goal: goal,
        populationSize: populationSize,
        population: []
      };

      const response = await fetch('https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experimentData),
      });

      const result = await response.json();
      console.log('Experiment saved:', result);

      // Set success feedback
      setSnackbarMessage('Experiment saved successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsSaved(true); // Mark as saved
    } catch (error) {
      console.error('Error saving experiment:', error);

      // Set error feedback
      setSnackbarMessage('Error saving experiment. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5b577f' }}>
        {experimentName || "New Experiment"}
      </Typography>

      <TextField
        label="Experiment Name"
        value={experimentName}
        onChange={(e) => onExperimentNameChange(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Goal</InputLabel>
        <Select value={goal} onChange={handleGoalChange}>
          <MenuItem value="minimize">Minimize</MenuItem>
          <MenuItem value="maximize">Maximize</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Population Size"
        type="number"
        value={populationSize}
        onChange={(e) => setPopulationSize(Number(e.target.value))}
        fullWidth
        margin="normal"
        sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      />

      <Variables variables={variables} setVariables={setVariables} />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={addVariable}
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Add Variable
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleSubmit}
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Save Experiment
        </Button>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Navigation button after saving */}
      {isSaved && (
        <Box sx={{ mt: 3 }}>
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
      )}
    </Box>
  );
};

export default ExperimentForm;
