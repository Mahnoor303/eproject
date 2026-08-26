import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  UserCog,
  UserPlus,
  Trash2,
  ShieldCheck,
  BookOpen,
  BarChart3,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateRole: (id: number, newRole: UserRole) => void;
  onDeleteUser: (id: number) => void;
  currentUserId: number;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateRole,
  onDeleteUser,
  currentUserId,
}) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    onAddUser({
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@edupredict.edu`,
      role,
      password: `${role}123`,
    });

    setUsername('');
    setName('');
    setEmail('');
    setRole('teacher');
    setSuccessMsg(`User created successfully with role ${role}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserCog className="w-6 h-6 text-blue-600" />
          <span>User &amp; Permission Access Control</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage local administrative credentials, instructor roles, and student access accounts.
        </p>
      </div>

      {/* Grid: Create User & Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Create User Form (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Add System User</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. jdoe"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jdoe@edupredict.edu"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Permission *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="teacher">Teacher (Class roster &amp; student monitoring)</option>
                <option value="analyst">Analyst (Data analytics &amp; reports)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                * Note: Students register via public portal. Administrators are managed separately.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors mt-2"
            >
              Provision Account
            </button>
          </form>

          {successMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Users Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Accounts ({users.length})</h3>
            <span className="text-xs text-slate-500">Role-Based Access Control</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Modify Role</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.id === currentUserId && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            @{u.username} &bull; {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : u.role === 'teacher'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'analyst'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-700"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {u.id !== currentUserId ? (
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
