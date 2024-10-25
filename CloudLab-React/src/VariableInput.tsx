import React from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface VariableInputProps {
    index: number;
    variable: any;
    updateVariable: (index: number, variable: any) => void;
}

const VariableInput: React.FC<VariableInputProps> = ({ index, variable, updateVariable }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateVariable(index, { ...variable, [name]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent<any>) => {
        const { name, value } = e.target;
        updateVariable(index, { ...variable, [name as string]: value });
    };

    return (
        <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
            <TextField
                label="Variable Name"
                name="name"
                value={variable.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff' }}  {/* Background set to white */}
            />
            <TextField
                label="Min Value"
                name="min"
                type="number"
                value={variable.min}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff' }}  {/* Background set to white */}
            />
            <TextField
                label="Max Value"
                name="max"
                type="number"
                value={variable.max}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff' }}  {/* Background set to white */}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Type</InputLabel>
                <Select
                    name="type"
                    value={variable.type}
                    onChange={handleSelectChange}
                    sx={{ backgroundColor: '#fff' }}  {/* Background set to white */}
                >
                    <MenuItem value="continuous">Continuous</MenuItem>
                    <MenuItem value="discrete">Discrete</MenuItem>
                </Select>
            </FormControl>
            {variable.type === 'discrete' && (
                <TextField
                    label="Custom Discrete Values (comma-separated)"
                    name="customValues"
                    value={variable.customValues}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#fff' }}  {/* Background set to white */}
                />
            )}
        </Box>
    );
};

export default VariableInput;
