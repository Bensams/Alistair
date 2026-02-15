import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getResidentById, deleteResident } from '../utils/storage';
import { Resident } from '../types/resident';

export function ResidentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);

  useEffect(() => {
    if (id) {
      const data = getResidentById(id);
      if (data) {
        setResident(data);
      } else {
        navigate('/residents');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (resident && confirm(`Are you sure you want to delete ${resident.firstName} ${resident.lastName}?`)) {
      deleteResident(resident.id);
      navigate('/residents');
    }
  };

  if (!resident) {
    return <div>Loading...</div>;
  }

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <dt className="text-sm text-gray-600 mb-1">{label}</dt>
      <dd className="text-gray-900">{value || 'N/A'}</dd>
    </div>
  );

  const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
      active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
    }`}>
      {active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {label}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/residents')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Residents
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/residents/${resident.id}/edit`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
            {resident.profilePicture ? (
              <img src={resident.profilePicture} alt={`${resident.firstName} ${resident.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {resident.firstName} {resident.middleName} {resident.lastName}
              {resident.suffix && ` ${resident.suffix}`}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {resident.age} years old
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {resident.gender}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {resident.civilStatus}
              </span>
              {resident.householdHead && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Household Head
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {resident.contactNumber}
              </div>
              {resident.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {resident.email}
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {resident.purok}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Personal Information
          </h3>
          <dl>
            <InfoRow label="Birth Date" value={new Date(resident.birthDate).toLocaleDateString()} />
            <InfoRow label="Age" value={resident.age} />
            <InfoRow label="Gender" value={resident.gender} />
            <InfoRow label="Civil Status" value={resident.civilStatus} />
          </dl>
        </div>

        {/* Contact & Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Contact & Address
          </h3>
          <dl>
            <InfoRow label="Contact Number" value={resident.contactNumber} />
            <InfoRow label="Email" value={resident.email} />
            <InfoRow label="Address" value={resident.address} />
            <InfoRow label="Purok" value={resident.purok} />
          </dl>
        </div>

        {/* Economic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Economic Information
          </h3>
          <dl>
            <InfoRow label="Occupation" value={resident.occupation} />
            <InfoRow label="Monthly Income" value={resident.monthlyIncome} />
          </dl>
        </div>

        {/* Household Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Household Information
          </h3>
          <dl>
            <InfoRow label="Household Head" value={resident.householdHead ? 'Yes' : 'No'} />
            <InfoRow label="Household ID" value={resident.householdId} />
          </dl>
        </div>

        {/* Status Information */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Status Information
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <StatusBadge active={resident.voterStatus === 'Registered'} label="Registered Voter" />
            <StatusBadge active={resident.pwdStatus} label="PWD" />
            <StatusBadge active={resident.seniorCitizen} label="Senior Citizen" />
            <StatusBadge active={resident.indigent} label="Indigent" />
          </div>
          <dl>
            <InfoRow 
              label="Date Registered" 
              value={new Date(resident.dateRegistered).toLocaleDateString()} 
            />
          </dl>
        </div>

        {/* Remarks */}
        {resident.remarks && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Remarks
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{resident.remarks}</p>
          </div>
        )}
      </div>
    </div>
  );
}