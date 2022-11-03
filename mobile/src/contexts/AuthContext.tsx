import { createContext, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface User {
  name: string;
  avatarUrl: string;
}

export interface AuthContextData {
  user: User;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({} as User);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '113738162399-ko5ps7br2m8qej6ih26qs981ascbtd15.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  })

  async function signIn() {
    try {
      setIsSigningIn(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signInWithGoogle(accessToken: string) {
    console.log(accessToken)
  }

  useEffect(() => {
    if (response?.type === 'success' && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{ user, signIn, isSigningIn }}>
      {children}
    </AuthContext.Provider>
  )
}