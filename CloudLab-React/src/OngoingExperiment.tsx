import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TextField } from '@mui/material';

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
  fitnessScores?: number[]; // New state for fitness scores
}

const OngoingExperiment: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>(); // Get experimentId from route params
  const [experimentData, setExperimentData] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(false); // For tracking loading state of the button

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

        // Initialize fitness scores array with '0' for each member if it doesn't exist
        const initialFitnessScores = experiment.population?.map(() => 0) || [];

        setExperimentData({
          ...experiment,
          fitnessScores: initialFitnessScores,
        });
      } else {
        console.error('Invalid response structure:', parsedBody);
      }
    } catch (error) {
      console.error('Error fetching experiment data:', error);
    }
  };

  // Function to handle the "Generate Next Generation" button click
  const generateNextGeneration = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments/ongoing?experimentId=${experimentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate next generation');
      }

      const responseData = await response.json();
      const updatedExperiment = JSON.parse(responseData.body);
      console.log("Updated Experiment:", updatedExperiment.population);

      if (updatedExperiment) {
        // Assuming the response contains a new population
        const experiment: Experiment = {
          ...experimentData!,
          population: updatedExperiment.population,
        };

        setExperimentData(experiment); // Update the experiment data with the new population
        console.log('New population generated:', experiment.population);
      }
    } catch (error) {
      console.error('Error generating next generation:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle fitness score change
  const handleFitnessScoreChange = (e: React.ChangeEvent<HTMLInputElement>, memberIndex: number) => {
    const updatedScores = [...(experimentData?.fitnessScores || [])];
    updatedScores[memberIndex] = parseFloat(e.target.value);
    setExperimentData({ ...experimentData!, fitnessScores: updatedScores });
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

      {/* MUI Button with consistent styling */}
      <Button
        variant="contained"
        color="primary"
        onClick={generateNextGeneration}
        disabled={loading} // Disable while loading
        sx={{ margin: '16px 0' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Next Generation'}
      </Button>

      {/* Show population table if there are members in the population */}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFitnessScoreChange(e, memberIndex)} // Explicitly typing the event
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
    </Box>
  );
};

export default OngoingExperiment;
