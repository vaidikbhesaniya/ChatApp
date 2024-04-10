"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Register(): React.ReactNode {
  const [user, setUser] = React.useState({
    email: '',
    password: ''
  })
  const router = useRouter();

  async function registerUser() {
    try {
      const reponse = await axios.post('/api/sendMail', user);
      console.log(reponse);

      if (reponse.status === 200) {
        setUser({
          email: '',
          password: ''
        })
        router.push('/verify');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder='Email'
        required
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        type="password"
        placeholder='Password'
        required
      />
      <button type="submit" onClick={registerUser}>Register</button>
    </div>
  )
}
