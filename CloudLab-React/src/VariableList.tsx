import React from 'react';
import VariableInput from './VariableInput';

interface VariableListProps {
    variables: any[];
    setVariables: React.Dispatch<React.SetStateAction<any[]>>;
}

const VariableList: React.FC<VariableListProps> = ({ variables, setVariables }) => {
    const updateVariable = (index: number, updatedVariable: any) => {
        const newVariables = variables.map((variable, i) =>
            i === index ? updatedVariable : variable
        );
        setVariables(newVariables);
    };

    return (
        <div>
            {variables.map((variable, index) => (
                <VariableInput
                    key={index}
                    index={index}
                    variable={variable}
                    updateVariable={updateVariable}
                />
            ))}
        </div>
    );
};

export default VariableList;
