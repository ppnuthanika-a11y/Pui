
export interface System {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  systemId: string;
  details: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  title: string;
  company: string;
  status: 'active' | 'blocked';
  permissions: Permission[];
  quotaEmail: string;
  computerName: string;
  assetCode: string;
}