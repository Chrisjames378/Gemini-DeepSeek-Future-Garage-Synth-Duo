import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { README_CONTENT } from './readmeData';

// Scopes required for Google Docs & Google Drive file creation
export const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token for Google Docs permissions');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface CreatedGoogleDoc {
  documentId: string;
  title: string;
  url: string;
}

/**
 * Creates a new Google Doc with the README markdown/text and returns the editable document link.
 */
export const createGoogleDocFromReadme = async (
  customTitle?: string,
  content: string = README_CONTENT
): Promise<CreatedGoogleDoc> => {
  let token = cachedAccessToken;
  if (!token) {
    const res = await googleSignIn();
    if (!res?.accessToken) {
      throw new Error('Google Sign-in is required to create a Google Doc.');
    }
    token = res.accessToken;
  }

  const title = customTitle || 'Ghostform • Future Garage Synth Studio - README';

  // 1. Create a blank Google Document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
    }),
  });

  if (!createRes.ok) {
    const errorJson = await createRes.json().catch(() => ({}));
    throw new Error(
      errorJson?.error?.message || `Failed to create Google Doc (Status ${createRes.status})`
    );
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. Insert the formatted README text into the newly created Google Doc
  const batchRes = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: `${content}\n\nGenerated automatically via Ghostform Future Garage Synth Studio on Google AI Studio.\nTime: ${new Date().toLocaleString()}`,
            },
          },
        ],
      }),
    }
  );

  if (!batchRes.ok) {
    console.warn('Doc content insertion notice:', await batchRes.text());
  }

  return {
    documentId,
    title,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
  };
};
