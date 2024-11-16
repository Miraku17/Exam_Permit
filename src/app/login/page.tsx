import React from 'react'
import { getServerSession } from "next-auth";
import LoginPage from '@/components/login/logIn'
import { redirect } from "next/navigation";
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/home");
  return (
    <LoginPage />
  )
}
