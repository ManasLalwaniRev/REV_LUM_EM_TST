// src/components/ManageDatabasePage.jsx
import React from 'react';

const ManageDatabasePage = ({ setCurrentPage }) => {
  // Dummy data for the Manage Database page
  const dbEntries = [
    {
      id: 1,
      tableName: 'Users',
      recordCount: 150,
      lastUpdated: '2025-08-05',
      status: 'Active',
    },
    {
      id: 2,
      tableName: 'Transactions',
      recordCount: 12345,
      lastUpdated: '2025-08-05',
      status: 'Active',
    },
    {
      id: 3,
      tableName: 'Charges',
      recordCount: 5678,
      lastUpdated: '2025-08-04',
      status: 'Active',
    },
    {
      id: 4,
      tableName: 'Vendors',
      recordCount: 75,
      lastUpdated: '2025-07-30',
      status: 'Active',
    },
    {
      id: 5,
      tableName: 'AuditLogs',
      recordCount: 98765,
      lastUpdated: '2025-08-05',
      status: 'Archived',
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white">
      <div className="bg-gray-700 p-8 rounded-xl shadow-lg w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Manage Database</h1>

        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-600">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Table Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Record Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {dbEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {entry.tableName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {entry.recordCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {entry.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-400 hover:text-indigo-200 mr-4">Edit</button>
                    <button className="text-red-400 hover:text-red-200">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDatabasePage;
