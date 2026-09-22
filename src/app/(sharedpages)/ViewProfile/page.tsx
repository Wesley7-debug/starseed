'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Edit, User } from 'lucide-react';
import PageHeader from '@/components/reusable/PageHeader';

type Role = 'admin' | 'teacher' | 'student';

interface SessionUser {
  avatarUrl: string;
  id: string;
  name: string;
  phone?: string;
  role: Role;
  RegNo: string;
  classId?: string;
  imageUrl?: string;
}

const editableFields: Array<keyof Pick<SessionUser, 'name' | 'phone' | 'classId'>> = [
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
      await signIn('credentials', { redirect: false });
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
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:px-8 lg:py-7 space-y-6">
      <PageHeader
        title="Profile"
        description="View and edit your profile"
        icon={<User className="size-5" />}
      />

      {/* Avatar Card */}
      <div className="ax-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group w-24 h-24">
            <Avatar className="w-24 h-24 border-2 border-[#e8e3ee]">
              {preview ? (
                <AvatarImage src={preview} alt="Avatar" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-[#f0ebff] text-[#8c6be8] text-2xl font-bold">
                  {user.name[0]}
                </AvatarFallback>
              )}
            </Avatar>

            {editMode && canEdit && (
              <>
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-[#8c6be8] text-white cursor-pointer group-hover:scale-105 transition-transform shadow-md"
                  title="Change profile image"
                >
                  <Edit className="size-4" />
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
            <h2 className="text-xl font-bold text-[#1f2130]">{user.name}</h2>
            <p className="text-sm text-[#777489]">{user.RegNo}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-[#f0ebff] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8c6be8]">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Fields Card */}
      <div className="ax-card p-6 space-y-4">
        <h3 className="text-[15px] font-semibold text-[#1f2130]">Personal Information</h3>
        {editableFields.map((field) => (
          <div key={field}>
            <Label className="text-sm font-medium text-[#1f2130] capitalize">{field}</Label>
            <Input
              id={field}
              name={field}
              value={formData?.[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              onBlur={handleBlur}
              disabled={!editMode || (field !== 'phone' && !isAdmin)}
              className="mt-1.5 rounded-xl border-[#e8e3ee] bg-[#faf8ff]"
            />
          </div>
        ))}

        <div>
          <Label className="text-sm font-medium text-[#1f2130]">Registration Number</Label>
          <Input
            value={user.RegNo}
            disabled
            className="mt-1.5 rounded-xl border-[#e8e3ee] bg-[#f3f1f8] text-[#777489]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-[#1f2130]">Role</Label>
          <Input
            value={user.role}
            disabled
            className="mt-1.5 rounded-xl border-[#e8e3ee] bg-[#f3f1f8] text-[#777489]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {!editMode ? (
          <Button
            onClick={() => setEditMode(true)}
            className="rounded-xl bg-[#8c6be8] text-white hover:bg-[#7a5bd4] shadow-sm"
          >
            <Edit className="mr-1.5 size-4" />
            Edit Profile
          </Button>
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
              className="rounded-xl border-[#e8e3ee] text-[#1f2130]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveField(formData)}
              disabled={saving}
              className="rounded-xl bg-[#8c6be8] text-white hover:bg-[#7a5bd4]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
