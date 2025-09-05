import React, { useState, useRef, useEffect, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import { Issue } from "../../types";

// Priority order for sorting
const PRIORITY_ORDER = {
  "Very High": 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

interface IssueListProps {
  issues: Issue[];
  onUpdateStatus: (
    issueId: number,
    newStatus: Issue["status"],
    proofPhoto?: string
  ) => void;
}

const IssueList: React.FC<IssueListProps> = ({ issues, onUpdateStatus }) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>("");
  const [newStatus, setNewStatus] = useState<Issue["status"]>("Pending");
  const [notes, setNotes] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const [notificationFading, setNotificationFading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<keyof Issue | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const modalRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const openIssueDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setProofPhotoUrl(""); // Start with blank field for department to fill
    setNewStatus(issue.status);
    setNotes("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedIssue(null);
      setProofPhotoUrl("");
      setNewStatus("Pending");
      setNotes("");
    }, 300);
  };

  const handleSort = (column: keyof Issue) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: keyof Issue) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const handleStatusUpdate = () => {
    if (!selectedIssue) return;

    onUpdateStatus(selectedIssue.id, newStatus, proofPhotoUrl);
    closeModal();

    // Show success notification
    setNotification(`Issue #${selectedIssue.id} status updated successfully!`);

    // Auto-dismiss notification
    setTimeout(() => {
      setNotificationFading(true);
      setTimeout(() => {
        setNotification("");
        setNotificationFading(false);
      }, 500);
    }, 3000);
  };

  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "Very High":
        return "bg-red-100 text-red-800 border border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Sort and filter issues based on user selection
  const sortedAndLimitedIssues = useMemo(() => {
    let sortedIssues = [...issues];

    // Apply sorting if a column is selected
    if (sortBy) {
      sortedIssues.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        // Get values based on sort column
        switch (sortBy) {
          case 'id':
            aVal = Number(a.id);
            bVal = Number(b.id);
            break;
          case 'category':
            aVal = a.category.toLowerCase();
            bVal = b.category.toLowerCase();
            break;
          case 'priority':
            aVal = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER];
            bVal = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER];
            break;
          case 'status':
            aVal = a.status.toLowerCase();
            bVal = b.status.toLowerCase();
            break;
          case 'reportedDate':
            aVal = new Date(a.reportedDate).getTime();
            bVal = new Date(b.reportedDate).getTime();
            break;
          default:
            aVal = a[sortBy];
            bVal = b[sortBy];
            if (typeof aVal === 'string') {
              aVal = aVal.toLowerCase();
              bVal = bVal.toLowerCase();
            }
        }

        // Compare values
        let result = 0;
        if (aVal < bVal) result = -1;
        else if (aVal > bVal) result = 1;
        
        // Apply sort direction
        return sortDirection === 'asc' ? result : -result;
      });
    } else {
      // Default sorting by priority then by date if no column is selected
      sortedIssues.sort((a, b) => {
        const priorityDiff = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] - 
                           PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
      });
    }
    
    // Limit to reasonable number for performance
    return sortedIssues.slice(0, 200);
  }, [issues, sortBy, sortDirection]);

  // Get image for issue - use the actual Cloudinary photo from the issue data
  const getIssueImage = (issue: Issue) => {
    return issue.photo; // Use the actual Cloudinary image URL from the issue data
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Issues</h2>
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            {sortedAndLimitedIssues.length} of {issues.length}{" "}
            {issues.length === 1 ? "issue" : "issues"} shown
            {sortBy && (
              <span className="ml-2 text-blue-600">
                (Sorted by {sortBy} {sortDirection === 'asc' ? '↑' : '↓'})
              </span>
            )}
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No issues found
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              No issues found for the selected category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {getSortIcon('priority')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('reportedDate')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('reportedDate')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndLimitedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {issue.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {issue.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {issue.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(issue.reportedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => openIssueDetails(issue)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
                      >
                        <svg
                          className="-ml-0.5 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Issue Details */}
      <CSSTransition
        in={showModal}
        timeout={300}
        classNames="modal"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div className="fixed inset-0 z-[9999] overflow-y-auto" ref={nodeRef}>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center p-4 z-[1000] overflow-y-auto py-10">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {selectedIssue && (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" ref={modalRef}>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Issue #{selectedIssue.id} Details
                        </h3>
                        <button
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Issue Details */}
                      <div className="mt-2 grid grid-cols-1 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-md font-medium mb-2 text-gray-700">
                            Issue Information
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Category:</span>{" "}
                            {selectedIssue.category}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Description:</span>{" "}
                            {selectedIssue.description}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Address:</span>{" "}
                            {selectedIssue.address}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Reported Date:</span>{" "}
                            {selectedIssue.reportedDate}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Priority:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(
                                selectedIssue.priority
                              )}`}
                            >
                              {selectedIssue.priority}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Current Status:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                selectedIssue.status
                              )}`}
                            >
                              {selectedIssue.status}
                            </span>
                          </p>

                          {/* Image */}
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Issue Photo:
                            </p>
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={getIssueImage(selectedIssue)}
                                alt={`${selectedIssue.category} issue at ${selectedIssue.address}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://via.placeholder.com/800x400?text=Image+Not+Available";
                                }}
                                onLoad={() => console.log('Image loaded successfully in modal:', selectedIssue.photo)}
                              />
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                {selectedIssue.category}
                              </div>
                            </div>

                            {/* Extra Info */}
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Reported</p>
                                <p className="font-medium">
                                  {new Date(
                                    selectedIssue.reportedDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Department</p>
                                <p className="font-medium">
                                  {selectedIssue.department}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Address</p>
                                <p className="font-medium">
                                  {selectedIssue.address || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Status</p>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    selectedIssue.status === "Resolved"
                                      ? "bg-green-100 text-green-800"
                                      : selectedIssue.status === "In Progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {selectedIssue.status}
                                </span>
                              </div>
                            </div>

                            {/* Status update */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Status
                              </label>
                              <select
                                value={newStatus}
                                onChange={(e) =>
                                  setNewStatus(e.target.value as Issue["status"])
                                }
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </div>

                            {/* Proof photo */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Proof Photo URL{" "}
                                {newStatus === "Resolved" && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={proofPhotoUrl}
                                onChange={(e) => setProofPhotoUrl(e.target.value)}
                                placeholder="https://example.com/proof.jpg"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                              {newStatus === "Resolved" && !proofPhotoUrl && (
                                <p className="mt-1 text-sm text-red-500">
                                  Required for resolved status
                                </p>
                              )}
                            </div>

                            {/* Notes */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Notes
                              </label>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Add any additional information about this status update..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={newStatus === "Resolved" && !proofPhotoUrl}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      Update Status
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 ${
            notificationFading ? "animate-fade-out" : "animate-fade-in-out"
          }`}
          role="alert"
        >
          <p className="font-bold">Success!</p>
          <p>{notification}</p>
        </div>
      )}

      {/* Styles */}
      <style>{`
        /* Modal Animation */
        .modal-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .modal-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        .modal-exit {
          opacity: 1;
        }
        .modal-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }

        /* Notification Animation */
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 3.5s ease-in-out;
        }
        .animate-fade-out {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.5s, transform 0.5s;
        }
      `}</style>
    </>
  );
};

export default IssueList;
