/* @layer electron-main @kind logic */
import type { SignInProvider } from '../secrets.type';

const signInStatus = async (
  { isSignedIn, tokenSecret }: Pick<SignInProvider, 'isSignedIn' | 'tokenSecret'>,
  has: (name: string) => Promise<boolean>,
): Promise<boolean | null> => {
  try {
    if (isSignedIn) return Boolean(await isSignedIn());
    if (tokenSecret) return await has(tokenSecret);
    return null;
  } catch {
    return null;
  }
};

export { signInStatus };
