import { Box, Typography } from '@mui/material';
const MarketingPage = () => {
  return (
    <Box
      sx={{
        marginTop: '2rem',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ marginTop: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500 }}>
        How does Differential Evolution work?
      </Typography>
      <Typography variant="body1" sx={{ marginTop: '0.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        DE is a powerful optimization algorithm used to solve complex problems by iterating over generations.
        It evolves a population of solutions by introducing mutation and crossover to improve performance. With
        each generation, it gets closer to the optimal solution for your experimental setup.
      </Typography>

      <Typography variant="h5" sx={{ marginTop: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500 }}>
        Why CloudLab?
      </Typography>
      <Typography variant="body1" sx={{ marginTop: '0.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        CloudLab takes the complexity out of setting up and running experiments. By integrating cutting-edge optimization
        techniques like DE, it enables researchers to find the best configurations with fewer trials, saving time and resources.
        Whether you're experimenting in biology, chemistry, or any field, CloudLab streamlines the process and delivers
        high-quality results.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: '2rem', fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Start optimizing your experiments with CloudLab today and let data drive your discoveries.
      </Typography>
    </Box>
  );
};

export default MarketingPage;
