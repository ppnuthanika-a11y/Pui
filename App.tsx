
import React, { useState, useMemo } from 'react';
import type { User, System, Permission } from './types';
import Header from './components/Header';
import UserList from './components/UserList';
import UserFormModal from './components/UserFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import { ShieldCheckIcon, AddUserIcon } from './components/icons';

const SYSTEMS_DATA: System[] = [
  { id: 'ad', name: 'Active Directory', description: 'User authentication and authorization.' },
  { id: 'eservice', name: 'E-Service', description: 'Customer support and ticketing system.' },
  { id: 'exact', name: 'Exact ERP', description: 'Financial and resource planning.' },
  { id: 'mail', name: 'Email Account', description: 'Standard corporate email access.' },
  { id: 'groupmail', name: 'Group Mailboxes', description: 'Access to shared mailboxes.' },
  { id: 'devops', name: 'DevOps Platform', description: 'CI/CD and code repository access.' },
  { id: 'bi', name: 'BI Tools', description: 'Business Intelligence and reporting.' },
  { id: 'hrfocus', name: 'HR Focus', description: 'Human Resources management system.' },
  { id: 'onedrive', name: 'OneDrive', description: 'Cloud storage and file sharing.' },
  { id: 'office365', name: 'Office 365', description: 'Productivity suite access.' },
  { id: 'msteam', name: 'MS Teams', description: 'Collaboration and communication platform.' },
];

const USERS_DATA: User[] = [
  { 
    id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', title: 'Senior Software Engineer', company: 'Innovate Inc.',
    status: 'active', quotaEmail: '50GB', computerName: 'INNOV-LT-001', assetCode: 'ASSET-10234',
    permissions: [
      { systemId: 'devops', details: 'Contributor' }, 
      { systemId: 'eservice', details: 'Level 2 Agent' }, 
      { systemId: 'mail', details: '' },
      { systemId: 'ad', details: 'alice.j' }
    ] 
  },
  { 
    id: 2, name: 'Bob Williams', email: 'bob.w@example.com', title: 'Project Manager', company: 'Innovate Inc.',
    status: 'active', quotaEmail: '25GB', computerName: 'INNOV-LT-002', assetCode: 'ASSET-10235',
    permissions: [
      { systemId: 'exact', details: 'Read-only' }, 
      { systemId: 'bi', details: 'Sales Dashboard' }, 
      { systemId: 'groupmail', details: 'project-leads@example.com' },
      { systemId: 'msteam', details: '' }
    ] 
  },
  { 
    id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', title: 'System Administrator', company: 'Solutions Co.',
    status: 'blocked', quotaEmail: '50GB', computerName: 'SOL-LT-003', assetCode: 'ASSET-20567',
    permissions: [
      { systemId: 'ad', details: 'charlie.b' },
      { systemId: 'mail', details: '' },
      { systemId: 'devops', details: 'Admin' },
      { systemId: 'eservice', details: 'Admin' },
      { systemId: 'office365', details: 'Global Admin' }
    ] 
  },
  { 
    id: 4, name: 'Diana Miller', email: 'diana.m@example.com', title: 'Marketing Head', company: 'Solutions Co.',
    status: 'active', quotaEmail: '25GB', computerName: 'SOL-LT-004', assetCode: 'ASSET-20568',
    permissions: [
      { systemId: 'groupmail', details: 'marketing-team@example.com' },
      { systemId: 'bi', details: 'Marketing Dashboard' },
      { systemId: 'mail', details: '' }
    ] 
  },
];

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [systems] = useState<System[]>(SYSTEMS_DATA);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingUser(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setIsFormModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
    setUserToDelete(null);
  };

  const handleSaveUser = (userToSave: Omit<User, 'id'> & { id?: number }) => {
    if (modalMode === 'add') {
      setUsers(prevUsers => [
        ...prevUsers,
        { ...userToSave, id: Date.now() } as User,
      ]);
    } else {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userToSave.id ? (userToSave as User) : user
        )
      );
    }
    handleCloseModal();
  };

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
    }
    handleCloseModal();
  };
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800/50 shadow-lg rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-8 h-8 text-brand-secondary"/>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">User Permissions</h1>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 lg:w-80 pl-4 pr-10 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                    />
                    <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white font-semibold rounded-full shadow-md transition-all duration-300"
                >
                    <AddUserIcon className="w-5 h-5" />
                    <span>Add User</span>
                </button>
              </div>
          </div>
        </div>
        
        <UserList 
            users={filteredUsers} 
            systems={systems}
            onEditUser={handleOpenEditModal} 
            onDeleteUser={handleDeleteRequest}
        />

        {isFormModalOpen && (
          <UserFormModal
            mode={modalMode}
            user={editingUser}
            allSystems={systems}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
          />
        )}

        {userToDelete && (
            <ConfirmationModal
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
                onConfirm={confirmDeleteUser}
                onCancel={handleCloseModal}
                confirmText="Delete"
                confirmColor="red"
            />
        )}
      </main>
    </div>
  );
};

export default App;