'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiUploadCloud,
  FiX,
  FiCheck,
  FiChevronUp,
  FiChevronDown,
} from 'react-icons/fi';
import type { Experience } from '@/types';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    logo: '',
    location: '',
    period: '',
    description: '',
    skills: '',
  });

  const fetchExperience = async () => {
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const currentExp = experiences[index];
    const targetExp = experiences[targetIndex];

    const currentOrder = currentExp.order;
    const targetOrder = targetExp.order;

    // Optimistically update
    const updated = [...experiences];
    updated[index] = { ...currentExp, order: targetOrder };
    updated[targetIndex] = { ...targetExp, order: currentOrder };
    updated.sort((a, b) => a.order - b.order);
    setExperiences(updated);

    // Persist
    await Promise.all([
      fetch('/api/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentExp, order: targetOrder }),
      }),
      fetch('/api/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetExp, order: currentOrder }),
      }),
    ]);

    fetchExperience();
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();

      setFormData((prev) => ({ ...prev, logo: result.url }));
    } catch (err) {
      alert('Gagal mengunggah logo perusahaan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({
      title: '',
      company: '',
      logo: '',
      location: '',
      period: '',
      description: '',
      skills: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      title: exp.title,
      company: exp.company,
      logo: exp.logo || '',
      location: exp.location || '',
      period: exp.period,
      description: exp.description,
      skills: exp.skills ? exp.skills.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(editingExperience ? { id: editingExperience.id, order: editingExperience.order } : {}),
      title: formData.title,
      company: formData.company,
      logo: formData.logo,
      location: formData.location,
      period: formData.period,
      description: formData.description,
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingExperience) {
      await fetch('/api/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setModalOpen(false);
    fetchExperience();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    await fetch(`/api/experience?id=${id}`, { method: 'DELETE' });
    fetchExperience();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Experience</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit, or delete work history records.</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={openAddModal}>
          Add Experience
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading experience...</div>
        ) : experiences.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No experience records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Role & Company</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {experiences.map((exp, index) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {exp.logo ? (
                          <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                            <img
                              src={exp.logo}
                              alt={exp.company}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <FiBriefcase className="w-5 h-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{exp.title}</div>
                          <div className="text-xs text-[#3b4d35] font-semibold flex items-center gap-1 mt-0.5">
                            {exp.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3 text-slate-400" /> {exp.period}
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                          <FiMapPin className="w-3 h-3" /> {exp.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {exp.skills?.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                          title="Geser ke Atas"
                        >
                          <FiChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === experiences.length - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                          title="Geser ke Bawah"
                        >
                          <FiChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer ml-1"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExperience ? 'Edit Experience' : 'Add Experience'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fullstack Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, BSN"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Jakarta, Indonesia"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
              />
            </div>
          </div>

          {/* Company Logo Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Logo Perusahaan
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-[#3b4d35] rounded-xl p-4 transition-colors bg-slate-50/50">
              {formData.logo ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white p-1.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                        {formData.logo}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                        <FiCheck className="w-3.5 h-3.5" /> Logo siap digunakan
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logo: '' })}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    title="Hapus logo"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-3">
                  <FiUploadCloud className="w-8 h-8 text-[#3b4d35] mb-1.5" />
                  <span className="text-xs font-bold text-slate-700 mb-0.5">
                    {uploading ? 'Mengunggah logo...' : 'Klik untuk upload logo perusahaan'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, SVG, JPG, atau WebP (Rasio persegi direkomendasikan)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Manual URL input fallback */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Atau tempel URL gambar logo (opsional)"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-[#3b4d35]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Period
            </label>
            <input
              type="text"
              required
              placeholder="e.g. November 2025 - Present"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Skills Used (comma separated)
            </label>
            <input
              type="text"
              placeholder="Laravel, Vue.js, Selenium, Postman"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#3b4d35]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingExperience ? 'Save Changes' : 'Create Record'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
