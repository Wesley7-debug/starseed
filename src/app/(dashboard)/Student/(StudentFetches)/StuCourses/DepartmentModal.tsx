'use client';

import { FrontendUser } from '@/app/types/frontendUser';
import { useEffect, useState } from 'react';

interface DepartmentModalProps {
  user: FrontendUser;
  onSet: () => void;
}

export default function DepartmentModal({ user, onSet }: DepartmentModalProps) {
  const [selected, setSelected] = useState<'science' | 'arts' | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadySet = localStorage.getItem('departmentSelected');
    if (!user.department && !alreadySet) {
      setIsOpen(true);
    }
  }, [user]);

  // normalize user name for matching (lowercase & no spaces)
  const normalizedUserName = user.name.toLowerCase().replace(/\s+/g, '');
  const normalizedInput = nameInput.toLowerCase().replace(/\s+/g, '');
  const nameMatches = normalizedInput === normalizedUserName;

  const handleConfirm = async () => {
    if (!selected || !nameMatches) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/add-department', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: selected }),
      });

      if (!res.ok) throw new Error('Failed to update department');

      localStorage.setItem('departmentSelected', selected);
      setIsOpen(false);
      onSet();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="card border rounded-md shadow p-6">
        <h2 className="text-xl font-semibold mb-2 text-center">Choose Your Department</h2>
        <p className="text-gray-500 text-sm text-center mb-4">
          Please select your department. This cannot be changed later.
        </p>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setSelected('science')}
            className={`px-4 py-2 rounded border transition-colors duration-200 ${
              selected === 'science'
                ? 'bg-blue-600 text-white'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            disabled={loading}
          >
            Science
          </button>
          <button
            onClick={() => setSelected('arts')}
            className={`px-4 py-2 rounded border transition-colors duration-200 ${
              selected === 'arts'
                ? 'bg-blue-600 text-white'
                : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            disabled={loading}
          >
            Arts
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2 text-center">
          To confirm, type your full name (lowercase, no spaces):{' '}
          <strong>{normalizedUserName}</strong>
        </p>
        <input
          type="text"
          placeholder="enter your name"
          className="w-full px-4 py-2 border rounded mb-4 lowercase"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          disabled={loading}
          spellCheck={false}
          autoComplete="off"
        />

        {!nameMatches && nameInput && (
          <p className="text-xs text-red-500 text-center mb-2">
            Name does not match. Please type <strong>{normalizedUserName}</strong>
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-red-500 mb-2">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selected || !nameMatches || loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Confirm Selection'}
        </button>
      </div>
    </div>
  );
}
