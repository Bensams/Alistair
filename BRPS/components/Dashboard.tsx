import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Users, Home, Vote, UserCheck, BadgeHelp, HeartHandshake, TrendingUp } from 'lucide-react';
import { loadResidents } from '../utils/storage';
import { Resident } from '../types/resident';

export function Dashboard() {
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    setResidents(loadResidents());
  }, []);

  const stats = {
    totalResidents: residents.length,
    males: residents.filter(r => r.gender === 'Male').length,
    females: residents.filter(r => r.gender === 'Female').length,
    voters: residents.filter(r => r.voterStatus === 'Registered').length,
    seniorCitizens: residents.filter(r => r.seniorCitizen).length,
    pwd: residents.filter(r => r.pwdStatus).length,
    indigent: residents.filter(r => r.indigent).length,
    households: new Set(residents.filter(r => r.householdHead).map(r => r.householdId || r.id)).size,
  };

  const StatCard = ({ icon: Icon, title, value, color, link }: any) => (
    <Link
      to={link}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of barangay resident statistics</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Residents"
          value={stats.totalResidents}
          color="bg-blue-500"
          link="/residents"
        />
        <StatCard
          icon={Home}
          title="Households"
          value={stats.households}
          color="bg-green-500"
          link="/residents?household=head"
        />
        <StatCard
          icon={Vote}
          title="Registered Voters"
          value={stats.voters}
          color="bg-purple-500"
          link="/residents?voter=registered"
        />
        <StatCard
          icon={UserCheck}
          title="Senior Citizens"
          value={stats.seniorCitizens}
          color="bg-orange-500"
          link="/residents?senior=true"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/residents?pwd=true" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <BadgeHelp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">PWD</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pwd}</p>
        </Link>
        <Link to="/residents?indigent=true" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Indigent</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.indigent}</p>
        </Link>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Gender Distribution</h3>
          </div>
          <div className="space-y-2">
            <Link to="/residents?gender=Male" className="flex justify-between hover:text-blue-600 transition-colors">
              <span className="text-gray-600">Male</span>
              <span className="font-semibold">{stats.males}</span>
            </Link>
            <Link to="/residents?gender=Female" className="flex justify-between hover:text-blue-600 transition-colors">
              <span className="text-gray-600">Female</span>
              <span className="font-semibold">{stats.females}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Residents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Recently Added Residents</h3>
          <Link to="/residents" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        {residents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No residents registered yet</p>
            <Link
              to="/residents/add"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Resident
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-gray-600 font-medium">Name</th>
                  <th className="pb-3 text-gray-600 font-medium">Age</th>
                  <th className="pb-3 text-gray-600 font-medium">Gender</th>
                  <th className="pb-3 text-gray-600 font-medium">Purok</th>
                  <th className="pb-3 text-gray-600 font-medium">Date Registered</th>
                </tr>
              </thead>
              <tbody>
                {residents.slice(-5).reverse().map((resident) => (
                  <tr key={resident.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">
                      <Link
                        to={`/residents/${resident.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {resident.lastName}, {resident.firstName} {resident.middleName}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-700">{resident.age}</td>
                    <td className="py-3 text-gray-700">{resident.gender}</td>
                    <td className="py-3 text-gray-700">{resident.purok}</td>
                    <td className="py-3 text-gray-700">
                      {new Date(resident.dateRegistered).toLocaleDateString()}
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