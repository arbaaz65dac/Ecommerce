import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const profile = useSelector(state => state.auth.profile);

  if (!profile) {
    return (
      <section className='max-container min-h-screen flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold mb-4'>No user logged in</h1>
      </section>
    );
  }

  return (
    <section className='max-container min-h-screen flex flex-col items-center justify-center py-16'>
      <div className='bg-white shadow-lg rounded-xl p-8 flex flex-col items-center w-full max-w-md'>
        <img src={profile.avatar} alt='avatar' className='w-24 h-24 rounded-full border mb-4' />
        <h1 className='text-3xl font-bold mb-2'>{profile.name}</h1>
        <p className='text-lg text-gray-600 mb-2'>{profile.email}</p>
        <button className='mt-4 bg-coral-red text-white px-6 py-2 rounded-full font-semibold'>Edit Profile</button>
      </div>
    </section>
  );
};

export default UserProfile; 