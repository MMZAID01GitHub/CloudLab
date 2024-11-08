import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getCurrentUser } from 'aws-amplify/auth';

interface Variable {
  name: string;
  min: string;
  max: string;
  type: string;
  customValues?: string[]; // Optional array
}

interface Experiment {
  experimentName: string;
  goal: string;
  populationSize: number;
  variables: Variable[];
  experimentId: string;  // Add experimentId
  userId: string;        // Add userId
}

const ExperimentList: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiments = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching experiments...');
    
      try {
        const currentUser = await getCurrentUser();
        const userId = currentUser.userId; // Adjust if 'sub' is not the correct field
    
        const response = await fetch(`https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch experiments');
        }
    
        const data = await response.json();
        console.log("data", data);

        // Parse the 'body' field to get the actual data
        const parsedBody = JSON.parse(data.body); // Parse the body string to a JSON object
        console.log('Parsed body:', parsedBody);
    
        // Ensure experiments data is well-formed
        const experiments = Array.isArray(parsedBody.experiments) ? parsedBody.experiments.map((experiment: Partial<Experiment>) => ({
          experimentName: experiment.experimentName || 'Unnamed Experiment',
          goal: experiment.goal || 'No goal specified',
          populationSize: experiment.populationSize || 0,
          variables: experiment.variables || [], // Default to empty array if undefined
          experimentId: experiment.experimentId || '', // Default empty if missing
          userId: experiment.userId || '', // Default empty if missing
        })) : [];
        console.log('Experiments:', experiments);
        setExperiments(experiments);
      } catch (error) {
        console.error('Error fetching experiments:', error);
        setError('Failed to load experiments');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  if (loading) {
    return <Typography>Loading experiments...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (experiments.length === 0) {
    return <Typography>No experiments found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#5b577f' }}>
        My Experiments
      </Typography>
      {experiments.map((experiment, index) => (
        <Accordion key={index} sx={{ mb: 2, borderRadius: '4px', border: '1px solid #e0e0e0' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              {experiment.experimentName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <strong>Goal:</strong> {experiment.goal}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <strong>Population Size:</strong> {experiment.populationSize}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <strong>Variables:</strong>
            </Typography>
            {experiment.variables.map((variable, i) => (
              <Box key={i} sx={{ p: 1, mb: 1, border: '1px solid #ddd', borderRadius: '4px' }}>
                <Typography variant="body2" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Name:</strong> {variable.name}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Type:</strong> {variable.type}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Min:</strong> {variable.min} | <strong>Max:</strong> {variable.max}
                </Typography>
                {variable.type === 'discrete' && variable.customValues && (
                  <Typography variant="body2" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <strong>Custom Values:</strong> {variable.customValues.join(', ')}
                  </Typography>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ExperimentList;
