import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Issue } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
// This is needed because the default icons use relative paths that don't work in React
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface IssueMapProps {
  issues: Issue[];
  center: [number, number];
  onUpdateStatus?: (issueId: number, newStatus: Issue['status']) => void;
}

const IssueMap: React.FC<IssueMapProps> = ({ issues, center, onUpdateStatus }) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [proofPhotoUrl, setProofPhotoUrl] = useState('');
  const [newStatus, setNewStatus] = useState<Issue['status']>('Pending');
  
  const getMarkerColor = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return 'red';
      case 'In Progress': return 'orange';
      case 'Resolved': return 'green';
      default: return 'blue';
    }
  };
  
  const handleGiveDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowForm(true);
    setNewStatus(issue.status);
    setProofPhotoUrl('');
  };
  
  const handleSubmitDetails = () => {
    if (selectedIssue && onUpdateStatus) {
      onUpdateStatus(selectedIssue.id, newStatus);
      setShowForm(false);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedIssue(null);
  };

  return (
    <div className="relative">
      <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-md">
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {issues.map((issue) => (
            <Marker 
              key={issue.id} 
              position={issue.location}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{issue.description}</h3>
                  <p className="mb-2"><strong>Department:</strong> {issue.department}</p>
                  <p className="mb-2"><strong>Priority:</strong> {issue.priority}</p>
                  <p className="mb-2"><strong>Status:</strong> {issue.status}</p>
                  
                  <div className="mb-2">
                    <img 
                      src={issue.photo} 
                      alt="Issue" 
                      className="w-full max-w-[200px] rounded-md" 
                    />
                  </div>
                  
                  {onUpdateStatus && (
                    <div className="mt-4">
                      <button 
                        onClick={() => handleGiveDetails(issue)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        Give Details
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Interactive Form Modal */}
      {showForm && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Issue Details</h2>
              <button 
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Issue: {selectedIssue.description}</h3>
              <p className="text-sm text-gray-600 mb-2">Department: {selectedIssue.department}</p>
              <p className="text-sm text-gray-600 mb-4">Current Status: {selectedIssue.status}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Issue['status'])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proof Photo URL (required for Resolved status)
                </label>
                <input
                  type="text"
                  value={proofPhotoUrl}
                  onChange={(e) => setProofPhotoUrl(e.target.value)}
                  placeholder="https://example.com/proof.jpg"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  placeholder="Enter any additional details about the resolution..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDetails}
                disabled={newStatus === 'Resolved' && !proofPhotoUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueMap;