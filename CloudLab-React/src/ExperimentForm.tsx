import React, { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid2, SelectChangeEvent, Snackbar, Alert } from '@mui/material';
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

  const addVariable = () => {
    setVariables([...variables, { name: '', min: '', max: '', type: 'continuous', customValues: [] }]);
  };

  const handleGoalChange = (event: SelectChangeEvent<string>) => {
    setGoal(event.target.value as string);
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

      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Experiment Name"
            value={experimentName}
            onChange={(e) => onExperimentNameChange(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Goal</InputLabel>
            <Select value={goal} onChange={handleGoalChange}>
              <MenuItem value="minimize">Minimize</MenuItem>
              <MenuItem value="maximize">Maximize</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Population Size"
            type="number"
            value={populationSize}
            onChange={(e) => setPopulationSize(Number(e.target.value))}
            fullWidth
            margin="normal"
            sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
        </Grid2>
      </Grid2>

      <Variables variables={variables} setVariables={setVariables} />

      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={addVariable}
            sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Add Variable
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleSubmit}
            sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Save Experiment
          </Button>
        </Grid2>
      </Grid2>

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
    </Box>
  );
};

export default ExperimentForm;
