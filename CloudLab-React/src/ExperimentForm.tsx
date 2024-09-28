import React, { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid2, SelectChangeEvent } from '@mui/material';
import VariableList from './VariableList';

const ExperimentForm = () => {
    const [experimentName, setExperimentName] = useState('');
    const [variables, setVariables] = useState<any[]>([]);
    const [goal, setGoal] = useState('minimize');

    const addVariable = () => {
        setVariables([...variables, { name: '', min: '', max: '', type: 'continuous', customValues: [] }]);
    };

    
    const handleGoalChange = (event: SelectChangeEvent<string>) => {
        setGoal(event.target.value as string);
    };

    const handleSubmit = () => {
        // Eventually, this is where we would handle form submission
        console.log('Experiment Name:', experimentName);
        console.log('Variables:', variables);
        console.log('Goal:', goal);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create New Experiment
            </Typography>

            {/* Experiment Name Field */}
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label="Experiment Name"
                        value={experimentName}
                        onChange={(e) => setExperimentName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Grid2>

                {/* Goal Dropdown */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Goal</InputLabel>
                        <Select value={goal} onChange={handleGoalChange}>
                            <MenuItem value="minimize">Minimize</MenuItem>
                            <MenuItem value="maximize">Maximize</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            {/* Variable List */}
            <VariableList variables={variables} setVariables={setVariables} />

            {/* Buttons */}
            <Grid2 container spacing={2} sx={{ mt: 2 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={addVariable}>
                        Add Variable
                    </Button>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <Button variant="contained" color="secondary" fullWidth onClick={handleSubmit}>
                        Save Experiment
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ExperimentForm;
