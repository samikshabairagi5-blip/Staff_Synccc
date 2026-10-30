import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Calendar,
  MapPin,
  Shield,
  Heart,
  Sparkles,
  Save,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { employees, updateEmployee } = useHRM();

  const currentEmp = employees.find((e) => e.employeeId === user?.employeeId) || {
    id: user?.id || 'usr_01',
    employeeId: user?.employeeId || 'EMP-1003',
    name: user?.name || 'Sarah Jenkins',
    email: user?.email || 'sarah.jenkins@nexushr.io',
    phone: '+1 (555) 456-7890',
    department: user?.department || 'Engineering',
    designation: user?.designation || 'Senior Full-Stack Engineer',
    salary: 135000,
    dateOfJoining: '2022-03-15',
    status: 'active' as const,
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    emergencyContact: {
      name: 'Michael Jenkins',
      relation: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    skills: ['TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'AWS Cloud'],
    address: '442 Silicon Blvd, Suite 300, San Francisco, CA',
    leaveBalance: { annual: 14, sick: 8, casual: 4, maternity: 60 },
    performanceScore: 4.8
  };

  // Editable fields
  const [phone, setPhone] = useState(currentEmp.phone);
  const [address, setAddress] = useState(currentEmp.address);
  const [emergencyName, setEmergencyName] = useState(currentEmp.emergencyContact.name);
  const [emergencyRelation, setEmergencyRelation] = useState(currentEmp.emergencyContact.relation);
  const [emergencyPhone, setEmergencyPhone] = useState(currentEmp.emergencyContact.phone);
  const [skills, setSkills] = useState<string[]>(currentEmp.skills);
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setPhone(currentEmp.phone);
    setAddress(currentEmp.address);
    setEmergencyName(currentEmp.emergencyContact.name);
    setEmergencyRelation(currentEmp.emergencyContact.relation);
    setEmergencyPhone(currentEmp.emergencyContact.phone);
    setSkills(currentEmp.skills);
  }, [currentEmp.id]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    const updates = {
      phone,
      address,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone
      },
      skills
    };

    updateEmployee(currentEmp.id, updates);
    updateProfile({ phone });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Employee Profile & Personal Information
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your employment credentials, emergency contacts, technical capabilities, and home address.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Changes Saved!' : 'Save Profile Updates'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Official Employment Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 text-xs">
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
            <img
              src={currentEmp.avatar}
              alt={currentEmp.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
            />
            <h2 className="text-lg font-bold text-slate-900">{currentEmp.name}</h2>
            <p className="text-xs text-indigo-600 font-semibold">{currentEmp.designation}</p>
            <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px]">
              {currentEmp.employeeId}
            </span>
          </div>

          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Employment Details
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Department
              </span>
              <span className="font-semibold text-slate-800">{currentEmp.department}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Joining
              </span>
              <span className="font-semibold text-slate-800">{currentEmp.dateOfJoining}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Direct Manager
              </span>
              <span className="font-semibold text-slate-800">{currentEmp.managerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Employment Status</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold uppercase text-[10px]">
                {currentEmp.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Performance Rating</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                ★ {currentEmp.performanceScore} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Personal Info & Emergency Contact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              Contact & Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    disabled
                    value={currentEmp.email}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Residential Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Designated Emergency Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Technical Skills & Competencies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Technical Skills & Specialties
              </h3>
              <span className="text-slate-400 text-[11px]">{skills.length} skills added</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill (e.g. Kubernetes, Redis, System Architecture)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
