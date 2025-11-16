
import React, { useState, useEffect, useCallback } from 'react';
import type { User, System, Permission } from '../types';
import { suggestPermissionsForUser } from '../services/geminiService';
import { AILogo, CloseIcon } from './icons';

interface UserFormModalProps {
  mode: 'add' | 'edit';
  user: User | null;
  allSystems: System[];
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> & { id?: number }) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ mode, user, allSystems, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || '',
    company: user?.company || '',
    status: user?.status || 'active',
    quotaEmail: user?.quotaEmail || '',
    computerName: user?.computerName || '',
    assetCode: user?.assetCode || '',
  });

  const [permissionDetails, setPermissionDetails] = useState<Map<string, string>>(
    new Map(user?.permissions.map(p => [p.systemId, p.details]))
  );
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: 'active' | 'blocked') => {
    setFormData(prev => ({...prev, status}));
  };

  const handlePermissionChange = (systemId: string) => {
    setPermissionDetails(prev => {
      const newMap = new Map(prev);
      if (newMap.has(systemId)) {
        newMap.delete(systemId);
      } else {
        newMap.set(systemId, '');
      }
      return newMap;
    });
  };

  const handlePermissionDetailChange = (systemId: string, details: string) => {
    setPermissionDetails(prev => {
        const newMap = new Map(prev);
        newMap.set(systemId, details);
        return newMap;
    });
  };

  const handleSuggestPermissions = async () => {
    if (!formData.title) {
        setError("Please enter a job title to get suggestions.");
        return;
    }
    setIsSuggesting(true);
    setError(null);
    try {
      const suggestedSystemIds = await suggestPermissionsForUser(formData.title, allSystems);
      const newPermissions = new Map<string, string>();
      suggestedSystemIds.forEach(id => {
        newPermissions.set(id, '');
      });
      setPermissionDetails(newPermissions);
    } catch (err) {
      setError('Failed to get AI suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSave = () => {
    const permissions: Permission[] = Array.from(permissionDetails.entries()).map(([systemId, details]) => ({
        systemId,
        details
    }));

    const userToSave = {
      ...formData,
      permissions,
    };

    if (mode === 'edit' && user) {
      onSave({ ...userToSave, id: user.id });
    } else {
      onSave(userToSave);
    }
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const renderInputField = (label: string, name: keyof typeof formData, placeholder = '') => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-secondary"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{mode === 'add' ? 'Add New User' : 'Edit User'}</h2>
            <p className="text-slate-500 dark:text-slate-400">{mode === 'edit' ? `Editing details for ${user?.name}` : 'Enter the details for the new user.'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-secondary">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert"><p>{error}</p></div>}
          
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">User Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {renderInputField("Full Name", "name")}
            {renderInputField("Email", "email")}
            {renderInputField("Job Title", "title")}
            {renderInputField("Company", "company")}
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <div className="flex gap-2">
                    <button onClick={() => handleStatusChange('active')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${formData.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Active</button>
                    <button onClick={() => handleStatusChange('blocked')} className={`flex-1 py-2 rounded-md font-semibold transition-colors ${formData.status === 'blocked' ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>Blocked</button>
                </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Asset &amp; Quota</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {renderInputField("Computer Name", "computerName")}
            {renderInputField("Asset Code", "assetCode")}
            {renderInputField("Email Quota", "quotaEmail", "e.g., 50GB")}
          </div>

          <div className="mb-4 p-4 rounded-lg bg-brand-light/20 dark:bg-brand-dark/20 border border-brand-secondary/30">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">System Permissions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Select systems and use AI to suggest permissions based on job title.</p>
                </div>
                <button
                    onClick={handleSuggestPermissions}
                    disabled={isSuggesting}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                    {isSuggesting ? (<><AILogo className="w-5 h-5 animate-pulse-fast" /><span>Suggesting...</span></>) : (<><AILogo className="w-5 h-5" /><span>Suggest Permissions</span></>)}
                </button>
              </div>
          </div>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSystems.map(system => (
              <div key={system.id} className={`p-4 rounded-lg transition-colors ${permissionDetails.has(system.id) ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissionDetails.has(system.id)}
                      onChange={() => handlePermissionChange(system.id)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                    />
                    <div className="ml-3 flex-1">
                        <span className="text-slate-700 dark:text-slate-200 font-medium">{system.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{system.description}</p>
                    </div>
                </label>
                {permissionDetails.has(system.id) && (
                    <div className="mt-2 pl-8">
                        <input
                            type="text"
                            placeholder="Enter details (e.g., username, group name)"
                            value={permissionDetails.get(system.id) || ''}
                            onChange={(e) => handlePermissionDetailChange(system.id, e.target.value)}
                            className="w-full text-sm px-2 py-1 rounded-md bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                        />
                    </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 font-semibold transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-brand-secondary hover:bg-brand-dark text-white font-semibold transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;