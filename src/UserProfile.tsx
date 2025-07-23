import React, { useState, useEffect } from 'react';

interface User {
  id?: number;
  name?: string;
  email?: string;
  bio?: string;
}

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User>({});
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const userData: any = await response.json();
      setUser(userData);
    } catch (error: any) {
      console.log('Error fetching user:', error);
    }
    setLoading(false);
  };

  const handleSave = async (): Promise<void> => {
    // TODO: adicionar validação antes de salvar
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (response.ok) {
      setEditing(false);
      alert('Profile updated successfully!');
    } else {
      alert('Error updating profile');
    }
  };

  const handleInputChange = (field: string, valor: any) => {
    setUser({ ...user, [field]: valor });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      
      {editing ? (
        <div>
          <input 
            value={user.name || ''} 
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Name"
          />
          <input 
            value={user.email || ''} 
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Email"  
          />
          <textarea 
            value={user.bio || ''} 
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Bio"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
