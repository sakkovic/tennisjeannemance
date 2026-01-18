import { useState } from 'react';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../firebase';

const Auth = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [level, setLevel] = useState('Beginner');

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                if (!username) return toast.error("Username required");
                const res = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'users', res.user.uid), {
                    username,
                    email,
                    level,
                    role: 'user',
                    createdAt: serverTimestamp(),
                    lastSeen: new Date().toISOString(),
                    isOnline: true
                });
                toast.success("Account created!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            // Check if user doc exists, if not create it (handled in PlayerPortal effect? No, better here)
            // But PlayerPortal effect creates it if missing?
            // Let's create it here to be safe and set defaults
            // Actually, best practice is to check existence.
            // For now, I'll rely on the fact that if it's a new user, we might want to set username.
            // But Google provides displayName.
            // Let's keep it simple: just sign in. The PlayerPortal main effect checks for user doc.
            // Wait, PlayerPortal main effect listens to user doc logic:
            /*
            if (authUser) {
                const userRef = doc(db, 'users', authUser.uid);
                await setDoc(userRef, { ... }, { merge: true });
            }
            */
            // So we are good.
            toast.success("Signed in with Google");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Tennis JM</h1>
                    <p className="text-slate-500">Player Portal & Messenger</p>
                </div>

                <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setIsRegistering(false)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isRegistering ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsRegistering(true)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isRegistering ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {isRegistering && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Self Rating</label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                            >
                                <option value="Beginner">Beginner (1.0 - 2.5)</option>
                                <option value="Intermediate">Intermediate (3.0 - 4.0)</option>
                                <option value="Advanced">Advanced (4.5+)</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                        {isRegistering ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Google
                </button>
            </div>
        </div>
    );
};

export default Auth;
