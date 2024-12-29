import React from "react";
import SignInButton from "./sign-in/sign-in-btn";
import { decodeUser } from "@/app/data-fetching";

export default async function AuthStatus() {
  const user = await decodeUser();
  return user ? <div>{user.nickname}</div> : <SignInButton />;
}
