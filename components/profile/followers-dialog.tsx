// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\components\profile\followers-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';

type FollowersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  userId: string;
  type: 'followers' | 'following';
};

export function FollowersDialog({
  open,
  onOpenChange,
  title,
  userId,
  type,
}: FollowersDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && userId) {
      fetchUsers();
    }
  }, [open, userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(`Error loading ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-t-2 border-red-500 border-solid rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            {type === 'followers'
              ? 'No followers yet'
              : 'Not following anyone yet'}
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.profilePicture || ''}
                      alt={user.username}
                    />
                    <AvatarFallback className="bg-zinc-800 text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <Link
                      href={`/profile/${user.id}`}
                      className="font-medium hover:text-red-400 truncate"
                    >
                      {user.username}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
