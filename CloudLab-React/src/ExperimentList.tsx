import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCurrentUser } from 'aws-amplify/auth';
import Grid2 from '@mui/material/Grid2'; // Import Grid2

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // Snackbar message

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

  const handleDeleteClick = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedExperiment) {
      try {
        const response = await fetch(`https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments?experimentId=${selectedExperiment.experimentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (response.ok) {
          // Remove the deleted experiment from the list
          setExperiments(prevExperiments => prevExperiments.filter(exp => exp.experimentId !== selectedExperiment.experimentId));
          setSnackbarMessage('Experiment deleted successfully');
          setSnackbarOpen(true);
        } else {
          throw new Error('Failed to delete experiment');
        }
      } catch (error) {
        console.error('Error deleting experiment:', error);
        setSnackbarMessage('Failed to delete experiment');
        setSnackbarOpen(true);
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
            <IconButton
              onClick={() => handleDeleteClick(experiment)}
              sx={{ marginLeft: 'auto', color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Grid2 container spacing={2} sx={{ mb: 1 }}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Goal:</strong> {experiment.goal}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Population Size:</strong> {experiment.populationSize}
                </Typography>
              </Grid2>
            </Grid2>

            <Typography variant="body1" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', mt: 1 }}>
              <strong>Variables:</strong>
            </Typography>
            {experiment.variables.map((variable, i) => (
              <Accordion key={i} sx={{ mb: 1, borderRadius: '4px', border: '1px solid #ddd' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {variable.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
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
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this experiment? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success or failure */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ExperimentList;
