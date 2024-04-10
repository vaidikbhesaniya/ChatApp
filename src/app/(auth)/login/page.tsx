"use client"

import axios from 'axios';
import React, { useState } from 'react'

export default function Login(): React.ReactNode {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  async function handleLogin() {
    console.log(user);
    const response = await axios.post('/api/login', user);
    console.log(response);
  }

  return (
    <div>
      <input
        type="email"
        placeholder='Email'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        type="password"
        placeholder='Password'
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
