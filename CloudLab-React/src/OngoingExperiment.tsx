import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button'; // MUI Button import
import { CircularProgress } from '@mui/material'; // If needed for loading state

// Define types for the experiment data structure
interface Variable {
  name: string;
  min: string;
  max: string;
  type: string;
  customValues: string[];
}

interface PopulationMember {
  variables: Variable[];
  fitnessScore?: number;
}

interface Experiment {
  experimentName: string;
  goal: string;
  populationSize: number;
  variables: Variable[];
  experimentId: string;
  userId: string;
  population?: PopulationMember[]; // population is optional
}

const OngoingExperiment: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>(); // Get experimentId from route params
  const [experimentData, setExperimentData] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(false); // For tracking loading state of the button

  // Function to fetch experiment data
  const fetchExperimentData = async () => {
    try {
      const response = await fetch(
        `https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments?experimentId=${experimentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch experiment data');
      }

      const responseData = await response.json();
      const parsedBody = JSON.parse(responseData.body);
      console.log('ParsedBody of Experiment:', parsedBody);

      if (parsedBody && parsedBody.experiment) {
        const experiment: Experiment = parsedBody.experiment;
        console.log('Experiment data:', experiment);

        setExperimentData(experiment);
      } else {
        console.error('Invalid response structure:', parsedBody);
      }
    } catch (error) {
      console.error('Error fetching experiment data:', error);
    }
  };

  // Function to handle the "Generate Next Generation" button click
  const generateNextGeneration = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `https://q3cyzs78u4.execute-api.us-east-1.amazonaws.com/dev/experiments/ongoing?experimentId=${experimentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to generate next generation');
      }
  
      const responseData = await response.json();
      const updatedExperiment = JSON.parse(responseData.body);
      console.log("Updated Experiment:", updatedExperiment.population);
  
      if (updatedExperiment) {
        // Transform the population data
        const transformedPopulation = updatedExperiment.population.map((member: any[]) => {
          return {
            variables: member.map((value, index) => ({
              name: `Variable ${index + 1}`, // Customize names as needed
              min: value.toString(),
              max: value.toString(),
              type: 'numeric', // or another type if applicable
              customValues: [], // Define this if applicable
            })),
            fitnessScore: null, // You can set this if applicable
          };
        });
  
        const experiment: Experiment = {
          ...updatedExperiment.experiment,
          population: transformedPopulation, // Add the transformed population
        };
  
        setExperimentData(experiment); // Update the experiment data with the new population
        console.log('New population generated:', experiment.population);
      }
    } catch (error) {
      console.error('Error generating next generation:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  useEffect(() => {
    if (experimentId) {
      fetchExperimentData();
    }
  }, [experimentId]);

  if (!experimentData) {
    return <div>Loading experiment data...</div>;
  }

  return (
    <div>
      <h1>Ongoing Experiment: {experimentData.experimentName}</h1>
      <div>Goal: {experimentData.goal}</div>
      <div>Population Size: {experimentData.populationSize}</div>

      {/* MUI Button with consistent styling */}
      <Button
        variant="contained"
        color="primary"
        onClick={generateNextGeneration}
        disabled={loading} // Disable while loading
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Next Generation'}
      </Button>

    {/* Show population table if there are members in the population */}
    {experimentData.population && experimentData.population.length > 0 ? (
      <>
        <h2>Population Table</h2>
        <table>
          <thead>
            <tr>
              <th>Variable Name</th>
              <th>Min</th>
              <th>Max</th>
              <th>Type</th>
              <th>Fitness Score</th>
            </tr>
          </thead>
          <tbody>
            {experimentData.population.map((member, index) => (
              <tr key={index}>
                {member.variables.map((variable, varIndex) => (
                  <React.Fragment key={varIndex}>
                    <td>{variable.name}</td>
                    <td>{variable.min}</td>
                    <td>{variable.max}</td>
                    <td>{variable.type}</td>
                  </React.Fragment>
                ))}
                <td>{member.fitnessScore || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <div>No population generated yet.</div>
    )}

    </div>
  );
};

export default OngoingExperiment;
