import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Sparkles,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import {
  createGoogleDocFromReadme,
  googleSignIn,
  logout,
  initAuth,
  CreatedGoogleDoc,
} from '../googleDocsService';
import { README_CONTENT } from '../readmeData';
import { User } from 'firebase/auth';

interface GoogleDocsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle?: string;
  tempo?: number;
}

export const GoogleDocsExportModal: React.FC<GoogleDocsExportModalProps> = ({
  isOpen,
  onClose,
  trackTitle = 'Ghostform • Future Garage Synth Studio',
  tempo = 132,
}) => {
  const [docTitle, setDocTitle] = useState(
    `Ghostform • Future Garage Synth Studio - README & Release Notes`
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdDoc, setCreatedDoc] = useState<CreatedGoogleDoc | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  const handleCreateDoc = async () => {
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const doc = await createGoogleDocFromReadme(docTitle, README_CONTENT);
      setCreatedDoc(doc);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to create Google Doc. Please check permissions.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(README_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>Export README.md to Google Docs</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                  Google Workspace
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Generate an official Google Doc with documentation, sound architecture, and DAW instructions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Account / Auth Bar */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 text-xs">
                {currentUser.displayName ? currentUser.displayName[0] : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="font-medium text-slate-200">
                {currentUser.displayName || currentUser.email}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900">
                Connected
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span>Google Account required for document creation.</span>
            </div>
          )}

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-300 text-[11px] flex items-center gap-1 hover:underline transition"
            >
              <LogOut className="w-3 h-3" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              {isAuthenticating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isAuthenticating ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">Document Title</label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* README Preview & Contents */}
        <div className="flex-1 min-h-[160px] max-h-[220px] bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[11px] text-slate-400 scrollbar-thin scrollbar-thumb-slate-800 relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={handleCopyReadme}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{README_CONTENT}</pre>
        </div>

        {/* Success or Error Notice */}
        {createdDoc && (
          <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <div>
                <span className="font-bold block">Document Created Successfully!</span>
                <span className="text-[11px] text-emerald-400/80">{createdDoc.title}</span>
              </div>
            </div>
            <a
              href={createdDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition flex-shrink-0"
            >
              <span>Open Google Doc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-950/70 border border-rose-800 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-500">
            Google Docs API v1 • drive.file scope
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCreateDoc}
              disabled={isCreating || isAuthenticating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-950/50 active:scale-95"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <FileText className="w-4 h-4 text-white" />
              )}
              <span>{isCreating ? 'Creating Google Doc...' : 'Export to Google Docs'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
