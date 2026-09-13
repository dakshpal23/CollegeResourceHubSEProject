import React from 'react';
import { FiSearch } from 'react-icons/fi';

const ResourceFilters = ({ filters, branches, sortOptions, onFilterChange, onSearch }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2">
        <form onSubmit={onSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(event) => onFilterChange('search', event.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </form>
      </div>

      <div>
        <select
          value={filters.branch}
          onChange={(event) => onFilterChange('branch', event.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {branches.map(branch => (
            <option key={branch.value} value={branch.value}>
              {branch.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <select
          value={filters.sort}
          onChange={(event) => onFilterChange('sort', event.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="mt-4">
      <input
        type="text"
        placeholder="Filter by subject..."
        value={filters.subject}
        onChange={(event) => onFilterChange('subject', event.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  </div>
);

export default ResourceFilters;
