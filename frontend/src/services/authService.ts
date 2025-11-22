import { User } from '../types';

// Mock Database
const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', role: 'admin', avatar: '🛡️' },
  { id: '2', username: 'manager_jane', role: 'manager', avatar: '💼' },
  { id: '3', username: 'viewer_bob', role: 'viewer', avatar: '👀' },
];

export const login = async (username: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (!user) {
    throw new Error('User not found. Try "admin", "manager_jane", or "viewer_bob"');
  }
  
  return user;
};

export const getUsers = (): User[] => {
  return [...MOCK_USERS];
};

// Simulate admin actions
export const addUser = (username: string, role: any): User => {
  const newUser: User = {
    id: Date.now().toString(),
    username,
    role,
    avatar: '👤'
  };
  MOCK_USERS.push(newUser);
  return newUser;
};

export const removeUser = (id: string) => {
  const index = MOCK_USERS.findIndex(u => u.id === id);
  if (index !== -1) {
    MOCK_USERS.splice(index, 1);
  }
};