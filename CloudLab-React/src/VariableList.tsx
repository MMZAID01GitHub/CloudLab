import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Grid2, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

interface Variable {
    name: string;
    min: string;
    max: string;
    type: string;
    customValues: string[];
}

interface VariableListProps {
    variables: Variable[];
    setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
}

const VariableList: React.FC<VariableListProps> = ({ variables, setVariables }) => {
    const handleInputChange = (index: number, key: keyof Variable, value: string) => {
        const newVariables = [...variables];
        if (key !== 'customValues') {
            newVariables[index][key] = value;
        }
        setVariables(newVariables);
    };

    const handleDeleteVariable = (index: number) => {
        const newVariables = variables.filter((_, i) => i !== index);
        setVariables(newVariables);
    };

    return (
        <>
            {variables.map((variable, index) => (
                <Accordion key={index} sx={{ mb: 2, borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Typography variant="subtitle1" sx={{ color: '#333' }}>
                            Variable {index + 1}: {variable.name || 'Unnamed'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Name"
                                    value={variable.name}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                    fullWidth
                                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Min Value"
                                    value={variable.min}
                                    onChange={(e) => handleInputChange(index, 'min', e.target.value)}
                                    fullWidth
                                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Max Value"
                                    value={variable.max}
                                    onChange={(e) => handleInputChange(index, 'max', e.target.value)}
                                    fullWidth
                                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    label="Type"
                                    value={variable.type}
                                    onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                                    fullWidth
                                    sx={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </Grid2>
                            <Grid2 size={12}>
                                <IconButton onClick={() => handleDeleteVariable(index)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default VariableList;
