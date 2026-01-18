import { User } from '../../types';

interface AvatarProps {
  user: User | { username: string; avatar?: string; role?: string; isOnline?: boolean };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

const Avatar = ({ user, size = 'md', showStatus = false }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full flex-shrink-0`}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover border border-slate-200" />
      ) : (
        <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
          {user.username?.[0]?.toUpperCase() || '?'}
        </div>
      )}
      {user.role === 'admin' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-yellow-900 font-bold" title="Admin">★</span>
      )}
      {showStatus && user.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
