import React, { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid2, SelectChangeEvent } from '@mui/material';
import VariableList from './VariableList';
import { getCurrentUser } from 'aws-amplify/auth';


interface ExperimentFormProps {
  showForm: boolean;
  onStartNewExperiment: () => void;
  experimentName: string;
  onExperimentNameChange: (name: string) => void;
}

const ExperimentForm: React.FC<ExperimentFormProps> = ({ showForm, onStartNewExperiment, experimentName, onExperimentNameChange }) => {
    const [variables, setVariables] = useState<any[]>([]);
    const [goal, setGoal] = useState('minimize');
    const [populationSize, setPopulationSize] = useState<number>(10); // default population size

    const addVariable = () => {
        setVariables([...variables, { name: '', min: '', max: '', type: 'continuous', customValues: [] }]);
    };

    const handleGoalChange = (event: SelectChangeEvent<string>) => {
        setGoal(event.target.value as string);
    };

    const handleSubmit = async () => {
        try {
            // Get the current authenticated user's information
            const currentUser = await getCurrentUser(); // This retrieves the current user
            
            // Ensure you extract the userId correctly
            const userId = currentUser.userId; // Adjust based on the actual structure returned
            
            // Prepare the experiment data
            const experimentData = {
                userId: userId, // Use the userId from getCurrentUser
                experimentName: experimentName,
                variables: variables,
                goal: goal,
                populationSize: populationSize
            };
    
            // Make the API request to save the experiment
            const response = await fetch('https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(experimentData),
            });
    
            const result = await response.json();
            console.log('Experiment saved:', result);
        } catch (error) {
            console.error('Error saving experiment:', error);
        }
    };
    

    if (!showForm) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onStartNewExperiment}
          sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: '0.75rem 1.5rem' }}
        >
          Create New Experiment
        </Button>
      );
    }

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
                        <Select
                          value={goal}
                          onChange={handleGoalChange}
                          sx={{ }} 
                        >
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

            <VariableList variables={variables} setVariables={setVariables} />

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
        </Box>
    );
};

export default ExperimentForm;
