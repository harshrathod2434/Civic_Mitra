import React from 'react';
import { Department } from '../../types';
import { DEPARTMENTS } from '../../data/mockData';

interface DepartmentSelectorProps {
  selectedDepartment: Department | null;
  onSelectDepartment: (department: Department) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ 
  selectedDepartment, 
  onSelectDepartment 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Select Department</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {DEPARTMENTS.map((department) => (
          <button
            key={department}
            className={`p-4 rounded-lg border-2 transition-colors ${selectedDepartment === department 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
            onClick={() => onSelectDepartment(department)}
          >
            {department}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSelector;