import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Search, Filter, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { loadResidents, deleteResident } from '../utils/storage';
import { Resident } from '../types/resident';

export function ResidentsList() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('');
  const [filterPurok, setFilterPurok] = useState<string>('');
  const [filterHousehold, setFilterHousehold] = useState<string>('');
  const [filterVoter, setFilterVoter] = useState<string>('');
  const [filterPWD, setFilterPWD] = useState<boolean | null>(null);
  const [filterSenior, setFilterSenior] = useState<boolean | null>(null);
  const [filterIndigent, setFilterIndigent] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadData();
    
    // Apply filters from URL params
    const gender = searchParams.get('gender');
    const household = searchParams.get('household');
    const voter = searchParams.get('voter');
    const pwd = searchParams.get('pwd');
    const senior = searchParams.get('senior');
    const indigent = searchParams.get('indigent');

    if (gender) {
      setFilterGender(gender);
      setShowFilters(true);
    }
    if (household) {
      setFilterHousehold(household);
      setShowFilters(true);
    }
    if (voter) {
      setFilterVoter(voter);
      setShowFilters(true);
    }
    if (pwd === 'true') {
      setFilterPWD(true);
      setShowFilters(true);
    }
    if (senior === 'true') {
      setFilterSenior(true);
      setShowFilters(true);
    }
    if (indigent === 'true') {
      setFilterIndigent(true);
      setShowFilters(true);
    }
  }, [searchParams]);

  const loadData = () => {
    setResidents(loadResidents());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteResident(id);
      loadData();
    }
  };

  const filteredResidents = residents.filter(resident => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchLower) ||
      resident.lastName.toLowerCase().includes(searchLower) ||
      resident.middleName.toLowerCase().includes(searchLower) ||
      resident.address.toLowerCase().includes(searchLower);
    
    const matchesGender = !filterGender || resident.gender === filterGender;
    const matchesPurok = !filterPurok || resident.purok === filterPurok;
    const matchesHousehold = !filterHousehold || 
      (filterHousehold === 'head' && resident.householdHead) ||
      (filterHousehold === 'member' && !resident.householdHead);
    const matchesVoter = !filterVoter || 
      (filterVoter === 'registered' && resident.voterStatus === 'Registered') ||
      (filterVoter === 'not-registered' && resident.voterStatus === 'Not Registered');
    const matchesPWD = !filterPWD || resident.pwdStatus;
    const matchesSenior = !filterSenior || resident.seniorCitizen;
    const matchesIndigent = !filterIndigent || resident.indigent;

    return matchesSearch && matchesGender && matchesPurok && matchesHousehold && 
           matchesVoter && matchesPWD && matchesSenior && matchesIndigent;
  });

  const puroks = Array.from(new Set(residents.map(r => r.purok))).sort();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Residents Directory</h2>
          <p className="text-gray-600">Total: {filteredResidents.length} resident(s)</p>
        </div>
        <Link
          to="/residents/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Resident
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purok</label>
              <select
                value={filterPurok}
                onChange={(e) => setFilterPurok(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {puroks.map(purok => (
                  <option key={purok} value={purok}>{purok}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Household</label>
              <select
                value={filterHousehold}
                onChange={(e) => setFilterHousehold(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="head">Household Head</option>
                <option value="member">Household Member</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voter Status</label>
              <select
                value={filterVoter}
                onChange={(e) => setFilterVoter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="registered">Registered</option>
                <option value="not-registered">Not Registered</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filters</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterPWD ?? false}
                  onChange={(e) => setFilterPWD(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">PWD Only</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterSenior ?? false}
                  onChange={(e) => setFilterSenior(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Senior Citizens Only</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterIndigent ?? false}
                  onChange={(e) => setFilterIndigent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Indigent Only</label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredResidents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No residents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Civil Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResidents.map((resident) => (
                  <tr 
                    key={resident.id} 
                    onClick={() => navigate(`/residents/${resident.id}`)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {resident.lastName}, {resident.firstName} {resident.middleName}
                        {resident.suffix && ` ${resident.suffix}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {resident.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {resident.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {resident.purok}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {resident.civilStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {resident.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/residents/${resident.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/residents/${resident.id}/edit`}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(resident.id, `${resident.firstName} ${resident.lastName}`)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}