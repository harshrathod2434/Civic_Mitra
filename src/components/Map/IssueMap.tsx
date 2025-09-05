import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Issue } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
// This is needed because the default icons use relative paths that don't work in React
const createMarkerIcon = (color: string) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create icons for different statuses
const pendingIcon = createMarkerIcon('red');
const inProgressIcon = createMarkerIcon('orange');
const resolvedIcon = createMarkerIcon('green');

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
  
  const getMarkerIcon = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return pendingIcon;
      case 'In Progress': return inProgressIcon;
      case 'Resolved': return resolvedIcon;
      default: return pendingIcon;
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
              icon={getMarkerIcon(issue.status)}
            >
            <Popup maxWidth={300} minWidth={250}>
                <div className="p-3 min-w-[250px]">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">{issue.description}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <p className="text-sm"><strong>Category:</strong> {issue.category}</p>
                    <p className="text-sm"><strong>Department:</strong> {issue.department}</p>
                    <p className="text-sm"><strong>Priority:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        issue.priority === 'Very High' ? 'bg-red-100 text-red-800' :
                        issue.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.priority}
                      </span>
                    </p>
                    <p className="text-sm flex items-center">
                      <strong>Status:</strong> 
                      <span 
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          issue.status === 'Resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : issue.status === 'In Progress'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </p>
                    <p className="text-sm"><strong>Address:</strong> {issue.address}</p>
                    <p className="text-sm"><strong>Reported:</strong> {issue.reportedDate}</p>
                  </div>
                  
                  <div className="mb-3">
                    <strong className="text-sm">Issue Photo:</strong>
                    <div className="mt-2">
                      <img 
                        src={issue.photo} 
                        alt={`${issue.category} issue at ${issue.address}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-200 shadow-sm" 
                        onError={(e) => {
                          console.error('Image failed to load:', issue.photo);
                          const target = e.currentTarget;
                          target.src = 'https://via.placeholder.com/200x128/e5e7eb/6b7280?text=Image+Not+Available';
                          target.className = 'w-full h-32 object-cover rounded-md border border-gray-200 shadow-sm opacity-50';
                        }}
                        onLoad={() => console.log('Image loaded successfully:', issue.photo)}
                      />
                    </div>
                  </div>
                  
                  {onUpdateStatus && (
                    <div className="mt-4">
                      <button 
                        onClick={() => handleGiveDetails(issue)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full transition-colors duration-200"
                      >
                        Update Status
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