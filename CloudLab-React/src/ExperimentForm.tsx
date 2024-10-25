import React, { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid2, SelectChangeEvent } from '@mui/material';
import VariableList from './VariableList';

interface ExperimentFormProps {
  showForm: boolean;
  onStartNewExperiment: () => void;
  experimentName: string;
  onExperimentNameChange: (name: string) => void;
}

const ExperimentForm: React.FC<ExperimentFormProps> = ({ showForm, onStartNewExperiment, experimentName, onExperimentNameChange }) => {
    const [variables, setVariables] = useState<any[]>([]);
    const [goal, setGoal] = useState('minimize');

    const addVariable = () => {
        setVariables([...variables, { name: '', min: '', max: '', type: 'continuous', customValues: [] }]);
    };

    const handleGoalChange = (event: SelectChangeEvent<string>) => {
        setGoal(event.target.value as string);
    };

    const handleSubmit = () => {
        console.log('Experiment Name:', experimentName);
        console.log('Variables:', variables);
        console.log('Goal:', goal);
    };

    if (!showForm) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onStartNewExperiment}
          sx={{ fontFamily: 'Poppins, sans-serif', padding: '0.75rem 1.5rem' }}
        >
          Create New Experiment
        </Button>
      );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
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
                        sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff' }}  
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Goal</InputLabel>
                        <Select
                          value={goal}
                          onChange={handleGoalChange}
                          sx={{ backgroundColor: '#fff' }} 
                        >
                            <MenuItem value="minimize">Minimize</MenuItem>
                            <MenuItem value="maximize">Maximize</MenuItem>
                        </Select>
                    </FormControl>
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
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
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
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Save Experiment
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ExperimentForm;
