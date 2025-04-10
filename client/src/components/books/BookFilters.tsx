import React from 'react';

interface BookFiltersProps {
  filters: {
    search: string;
    author: string;
    available: string;
    sortBy: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4 lg:space-y-0 lg:flex lg:gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex gap-2 flex-wrap lg:flex-nowrap">
        <select
          value={filters.author}
          onChange={(e) => onFilterChange('author', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les auteurs</option>
          {/* Les options seront remplies dynamiquement */}
        </select>

        <select
          value={filters.available}
          onChange={(e) => onFilterChange('available', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les livres</option>
          <option value="true">Disponibles</option>
          <option value="false">Empruntés</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="title">Titre</option>
          <option value="author">Auteur</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
  );
};