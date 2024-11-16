import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';

// Define types for the experiment data structure
interface Variable {
  name: string;
}

interface Experiment {
  experimentName: string;
  goal: string;
  populationSize: number;
  variables: Variable[];
  experimentId: string;
  userId: string;
  population?: number[][]; // Population is now a 2D array of numbers (as per your description)
  fitnessScores?: (number | null)[]; // Allow null values
}

const OngoingExperiment: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>(); // Get experimentId from route params
  const [experimentData, setExperimentData] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(false); // For tracking loading state of the button
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Function to fetch experiment data
  const fetchExperimentData = async () => {
    try {
      const response = await fetch(
        `https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments?experimentId=${experimentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch experiment data');
      }

      const responseData = await response.json();
      const parsedBody = JSON.parse(responseData.body);
      console.log('ParsedBody of Experiment:', parsedBody);

      if (parsedBody && parsedBody.experiment) {
        const experiment: Experiment = parsedBody.experiment;
        console.log('Experiment data:', experiment);

        const initialFitnessScores = experiment.population?.map(() => null) || [];
        setExperimentData({ ...experiment, fitnessScores: initialFitnessScores });

      } else {
        console.error('Invalid response structure:', parsedBody);
      }
    } catch (error) {
      console.error('Error fetching experiment data:', error);
    }
  };

  // Function to handle the "Generate Next Generation" button click
  const generateNextGeneration = async () => {
    setLoading(true);
  
    // Validate fitness scores
    if (experimentData?.fitnessScores?.some((score) => score === null)) {
      setSnackbar({
        open: true,
        message: 'Please fill out all fitness scores before submitting.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }
  
    const requestData = {
      population: experimentData?.population,
      fitnessScores: experimentData?.fitnessScores?.map((score) => score ?? 0), // Default to 0 if null (if required)
    };
  
    try {
      const response = await fetch(
        `https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments/ongoing?experimentId=${experimentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify(requestData),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to generate next generation');
      }
  
      const responseData = await response.json();
      const updatedExperiment = JSON.parse(responseData.body);
  
      if (updatedExperiment) {
        const experiment: Experiment = {
          ...experimentData!,
          population: updatedExperiment.population,
          fitnessScores: updatedExperiment.fitnessScores || experimentData!.fitnessScores,
        };
  
        setExperimentData(experiment);
        setSnackbar({ open: true, message: 'Next generation generated successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error generating next generation:', error);
      setSnackbar({ open: true, message: 'Failed to generate next generation.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  

  // Function to handle fitness score change
  const handleFitnessScoreChange = (e: React.ChangeEvent<HTMLInputElement>, memberIndex: number) => {
    const updatedScores = [...(experimentData?.fitnessScores || [])];
    const inputValue = e.target.value;
    updatedScores[memberIndex] = inputValue === '' ? null : parseFloat(inputValue);
    setExperimentData({ ...experimentData!, fitnessScores: updatedScores });
  };
  

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (experimentId) {
      fetchExperimentData();
    }
  }, [experimentId]);

  if (!experimentData) {
    return <div>Loading experiment data...</div>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ongoing Experiment: {experimentData.experimentName}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Goal: {experimentData.goal}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Population Size: {experimentData.populationSize}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={generateNextGeneration}
        disabled={loading}
        sx={{ margin: '16px 0' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Next Generation and Submit Fitness Scores'}
      </Button>

      {experimentData.population && experimentData.population.length > 0 ? (
        <>
          <Typography variant="h5" gutterBottom>
            Population Table
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  {experimentData.variables.map((variable, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {variable.name}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Fitness Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {experimentData.population.map((member, memberIndex) => (
                  <TableRow key={memberIndex} hover>
                    {member.map((value, varIndex) => (
                      <TableCell key={varIndex} align="center">
                        {value}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={experimentData.fitnessScores?.[memberIndex] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFitnessScoreChange(e, memberIndex)}
                        size="small"
                        variant="outlined"
                        sx={{ width: '70px' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <div>No population generated yet.</div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OngoingExperiment;
