// src/components/InfoItem.jsx
import React from 'react';

export const InfoItem = ({ label, value }) => (
  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
    <p className="text-gray-500 text-xs uppercase font-medium">{label}</p>
    <p className="text-gray-900 font-semibold mt-1">{value || 'N/A'}</p>
  </div>
);