
import React from 'react';
import type { User, System } from '../types';
import PermissionPill from './PermissionPill';
import { MailIcon, BriefcaseIcon, EditIcon, DeleteIcon, CompanyIcon, ComputerIcon, AssetIcon } from './icons';

interface UserListProps {
  users: User[];
  systems: System[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, systems, onEditUser, onDeleteUser }) => {
  const systemsMap: Map<string, System> = new Map(systems.map(system => [system.id, system]));

  if (users.length === 0) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">No Users Found</h2>
            <p className="mt-2 text-slate-500">Try adjusting your search term.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map(user => (
        <div 
          key={user.id} 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="p-6 flex-grow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img className="h-14 w-14 rounded-full object-cover" src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white dark:ring-slate-800`} title={user.status === 'active' ? 'Active' : 'Blocked'}></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                  <MailIcon className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
              <p className="flex items-center gap-2">
                <BriefcaseIcon className="w-4 h-4 flex-shrink-0 text-slate-400"/>
                <span className="font-medium">{user.title}</span>
              </p>
               <p className="flex items-center gap-2">
                <CompanyIcon className="w-4 h-4 flex-shrink-0 text-slate-400"/>
                <span>{user.company}</span>
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                 <p className="flex items-center gap-2">
                  <ComputerIcon className="w-4 h-4 flex-shrink-0 text-slate-400"/>
                  <span>{user.computerName}</span>
                </p>
                 <p className="flex items-center gap-2">
                  <AssetIcon className="w-4 h-4 flex-shrink-0 text-slate-400"/>
                  <span>{user.assetCode}</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System Access</h4>
              <div className="flex flex-col gap-1.5 min-h-[24px]">
                {user.permissions.length > 0 ? (
                  user.permissions.map(permission => {
                    const system = systemsMap.get(permission.systemId);
                    return system ? (
                        <div key={permission.systemId} className="flex items-baseline">
                            <PermissionPill name={system.name} />
                            {permission.details && (
                                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {permission.details}
                                </span>
                            )}
                        </div>
                    ) : null;
                  })
                ) : (
                  <span className="text-sm italic text-slate-400">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-2 border-t border-slate-200 dark:border-slate-700">
             <button
              onClick={() => onEditUser(user)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-brand-secondary"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
             <button
              onClick={() => onDeleteUser(user)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-red-500"
            >
              <DeleteIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;