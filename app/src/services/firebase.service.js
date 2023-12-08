import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../configs/firebase.config';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => signInWithPopup(auth, provider);
