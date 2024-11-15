import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

interface Variable {
  name: string;
  min: string;
  max: string;
  type: 'continuous' | 'discrete';
  customValues: string[];
  intervalSize?: string; // Optional interval size for continuous variables
}

interface VariablesProps {
  variables: Variable[];
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>;
}

const Variables: React.FC<VariablesProps> = ({ variables, setVariables }) => {
  const handleInputChange = <K extends keyof Variable>(
    index: number,
    key: K,
    value: Variable[K]
  ) => {
    const updatedVariables = [...variables];
    updatedVariables[index][key] = value;
    setVariables(updatedVariables);
  };

  const handleDeleteVariable = (index: number) => {
    const updatedVariables = variables.filter((_, i) => i !== index);
    setVariables(updatedVariables);
  };

  return (
    <>
      {variables.map((variable, index) => (
        <Accordion key={index} sx={{ mb: 2, borderRadius: '4px', border: '1px solid #e0e0e0' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Variable {index + 1}: {variable.name || 'Unnamed'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  value={variable.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  fullWidth
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Min Value"
                  value={variable.min}
                  onChange={(e) => handleInputChange(index, 'min', e.target.value)}
                  fullWidth
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Max Value"
                  value={variable.max}
                  onChange={(e) => handleInputChange(index, 'max', e.target.value)}
                  fullWidth
                  sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Type</InputLabel>
                  <Select
                    value={variable.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'continuous' || value === 'discrete') {
                        handleInputChange(index, 'type', value);
                      }
                    }}
                    sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <MenuItem value="continuous">Continuous</MenuItem>
                    <MenuItem value="discrete">Discrete</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {variable.type === 'discrete' && (
                <Grid item xs={12}>
                  <TextField
                    label="Custom Discrete Values (comma-separated)"
                    value={variable.customValues.join(', ')}
                    onChange={(e) =>
                      handleInputChange(index, 'customValues', e.target.value.split(',').map((val) => val.trim()))
                    }
                    fullWidth
                    sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  />
                </Grid>
              )}
              {variable.type === 'continuous' && (
                <Grid item xs={12}>
                  <TextField
                    label="Interval Size"
                    type="number"
                    value={variable.intervalSize || ''}
                    onChange={(e) => handleInputChange(index, 'intervalSize', e.target.value)}
                    fullWidth
                    sx={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    helperText="The size of the interval between values for continuous variables."
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <IconButton onClick={() => handleDeleteVariable(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Variables;
