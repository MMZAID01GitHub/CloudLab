import { useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
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
            <TextField
                label="Experiment Name"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Goal</InputLabel>
                <Select value={goal} onChange={handleGoalChange}>
                    <MenuItem value="minimize">Minimize</MenuItem>
                    <MenuItem value="maximize">Maximize</MenuItem>
                </Select>
            </FormControl>

            <VariableList variables={variables} setVariables={setVariables} />

            <Button variant="contained" color="primary" onClick={addVariable} sx={{ mt: 2 }}>
                Add Variable
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit} sx={{ mt: 2, ml: 2 }}>
                Save Experiment
            </Button>
        </Box>
    );
};

export default ExperimentForm;
