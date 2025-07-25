'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';


type Role = 'admin' | 'teacher' | 'student';

interface SessionUser {
  avatarUrl:string
  id: string;
  name: string;
  phone?: string;
  role: Role;
  RegNo: string;
  classId?: string;
  imageUrl?: string;
}

const editableFields: Array<keyof Pick<SessionUser, 'name' |  'phone' | 'classId'>> = [

  'name',
  'phone',
  'classId',
];

export default function ProfileView() {
  const { data: session } = useSession({ required: true });
  const user = session?.user as SessionUser | undefined;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<SessionUser | null>(null);
  const [preview, setPreview] = useState<string | undefined>(user?.imageUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
      setPreview(user.avatarUrl);
    }
  }, [user]);

  if (!user || !formData) return <div>loading..</div>;

  const isAdmin = user.role === 'admin';
  const canEdit = isAdmin || ['teacher', 'student'].includes(user.role);

  async function uploadImage(file: File) {
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.url as string;
  }

  async function saveField(field: Partial<SessionUser>) {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
      if (!res.ok) throw new Error('Save error');
      const updated = await res.json();
      setFormData(updated);
      setPreview(updated.avatarUrl);
      await signIn('credentials', { redirect: false }); // refresh session
      toast.success('Profile updated');
    } catch {
      toast.error('Error saving');
    } finally {
      setSaving(false);
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (formData && formData[name as keyof SessionUser] !== value) {
      saveField({ [name]: value });
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      toast.error('Only images ≤ 2MB are allowed');
      return;
    }

    setSaving(true);
    try {
      const url = await uploadImage(file);
      await saveField({ avatarUrl: url });
      setPreview(url);
    } catch {
      toast.error('Upload error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative group w-24 h-24">
          <Avatar className="w-24 h-24">
            {preview ? <AvatarImage src={preview} alt="Avatar" /> : <AvatarFallback>{user.name[0]}</AvatarFallback>}
          </Avatar>

          {editMode && canEdit && (
            <>
              <label
                htmlFor="file-upload"
                className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full cursor-pointer group-hover:scale-105 transition-transform shadow"
                title="Change profile image"
              >
                <Edit className="text-white w-4 h-4" />
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                  aria-label="Upload profile image"
                disabled={saving}
              />
            </>
          )}
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
       
        </div>
      </div>

      <div className="space-y-4">
        {editableFields.map((field) => (
          <div key={field}>
            <Label htmlFor={field} className="block mb-1 capitalize">
              {field}
            </Label>
            <Input
              id={field}
              name={field}
              value={formData?.[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              onBlur={handleBlur}
              disabled={!editMode || (field !== 'phone' && !isAdmin)}
            />
          </div>
        ))}

        <div>
          <Label className="block mb-1">Registration Number</Label>
          <Input value={user.RegNo} disabled className="bg-gray-100" />
        </div>
        <div>
          <Label className="block mb-1">Role</Label>
          <Input value={user.role} disabled className="bg-gray-100" />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFormData(user);
                setPreview(user.imageUrl);
                setEditMode(false);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={() => saveField(formData)} disabled={saving}>
              {saving ? 'Saving...' : 'Save All'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
