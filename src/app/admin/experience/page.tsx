'use client';

import React, { useState } from 'react';
import { FiBriefcase, FiChevronDown, FiChevronUp, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Field, FormSection, ImageField, ListShell, PageHeader, useCollection, useUpload } from '@/components/admin/AdminUI';
import { formatTags } from '@/lib/project-meta';
import type { Experience } from '@/types';

const emptyForm = {
  title: '',
  company: '',
  logo: '',
  location: '',
  period: '',
  description: '',
  skills: '',
};

const putExperience = (exp: Experience) =>
  fetch('/api/experience', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp),
  });

export default function AdminExperiencePage() {
  const { items: experiences, setItems: setExperiences, loading, reload } = useCollection<Experience>('/api/experience');
  const { uploading, upload } = useUpload();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= experiences.length) return;

    const current = experiences[index];
    const other = experiences[target];

    // Swap order values optimistically, then persist both.
    const updated = [...experiences];
    updated[index] = { ...current, order: other.order };
    updated[target] = { ...other, order: current.order };
    updated.sort((a, b) => a.order - b.order);
    setExperiences(updated);

    await Promise.all([putExperience({ ...current, order: other.order }), putExperience({ ...other, order: current.order })]);
    reload();
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      title: exp.title,
      company: exp.company,
      logo: exp.logo || '',
      location: exp.location || '',
      period: exp.period,
      description: exp.description,
      skills: exp.skills ? exp.skills.join(', ') : '',
    });
    setError('');
    setModalOpen(true);
  };

  const uploadLogo = async (files: File[]) => {
    try {
      const [url] = await upload(files.slice(0, 1));
      set('logo', url);
    } catch {
      setError('Gagal mengunggah logo. Coba lagi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...(editing ? { id: editing.id, order: editing.order } : {}),
      ...form,
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch('/api/experience', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setModalOpen(false);
      reload();
    } catch {
      setError('Gagal menyimpan pengalaman. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exp: Experience) => {
    if (!confirm(`Hapus pengalaman "${exp.title}" di ${exp.company}?`)) return;
    await fetch(`/api/experience?id=${exp.id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengalaman"
        description={loading ? 'Memuat…' : `${experiences.length} riwayat kerja. Urutan di sini = urutan di website.`}
        action={
          <button onClick={openAdd} className="btn btn-primary">
            <FiPlus className="h-4 w-4" /> Tambah pengalaman
          </button>
        }
      />

      <ListShell loading={loading} empty={experiences.length === 0} emptyText="Belum ada pengalaman.">
        {experiences.map((exp, index) => (
          <li key={exp.id} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-paper/60 sm:px-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-1.5">
              {exp.logo ? (
                <img src={exp.logo} alt="" className="h-full w-full object-contain" />
              ) : (
                <FiBriefcase className="h-4 w-4 text-faint" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="t-body truncate font-medium text-ink">{exp.title}</p>
              <p className="t-small truncate text-muted">
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ''}
              </p>
              <p className="t-small mt-0.5 truncate text-faint">
                {exp.period}
                {exp.skills?.length ? ` · ${formatTags(exp.skills).join(', ')}` : ''}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className="icon-btn"
                title="Naikkan"
                aria-label="Naikkan urutan"
              >
                <FiChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === experiences.length - 1}
                className="icon-btn"
                title="Turunkan"
                aria-label="Turunkan urutan"
              >
                <FiChevronDown className="h-4 w-4" />
              </button>
              <span className="mx-1 h-5 w-px bg-line" />
              <button onClick={() => openEdit(exp)} className="icon-btn" title="Edit" aria-label={`Edit ${exp.title}`}>
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(exp)}
                className="icon-btn hover:bg-red-50 hover:text-red-600"
                title="Hapus"
                aria-label={`Hapus ${exp.title}`}
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ListShell>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit pengalaman' : 'Tambah pengalaman'}
        maxWidth="xl"
        footer={
          <>
            {error && <span className="t-small mr-auto text-red-600">{error}</span>}
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">
              Batal
            </button>
            <button
              type="submit"
              form="experience-form"
              disabled={saving || uploading}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah pengalaman'}
            </button>
          </>
        }
      >
        <form id="experience-form" onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Posisi">
            <Field label="Jabatan" htmlFor="e-title">
              <input
                id="e-title"
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="mis. Fullstack Developer"
                className="input"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Perusahaan" htmlFor="e-company">
                <input
                  id="e-company"
                  required
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Lokasi" htmlFor="e-location">
                <input
                  id="e-location"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="Kuningan, Indonesia"
                  className="input"
                />
              </Field>
            </div>
            <Field label="Periode" htmlFor="e-period">
              <input
                id="e-period"
                required
                value={form.period}
                onChange={(e) => set('period', e.target.value)}
                placeholder="November 2025 - Present"
                className="input"
              />
            </Field>
          </FormSection>

          <FormSection title="Logo perusahaan">
            <ImageField
              value={form.logo}
              onChange={(v) => set('logo', v)}
              onFiles={uploadLogo}
              uploading={uploading}
              square
              hint="Rasio persegi paling rapi"
            />
            <Field label="atau tempel URL logo" htmlFor="e-logo">
              <input
                id="e-logo"
                value={form.logo}
                onChange={(e) => set('logo', e.target.value)}
                placeholder="https://… atau /uploads/…"
                className="input"
              />
            </Field>
          </FormSection>

          <FormSection title="Detail">
            <Field label="Deskripsi" htmlFor="e-desc">
              <textarea
                id="e-desc"
                required
                rows={4}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Skill" htmlFor="e-skills" hint="Pisahkan dengan koma.">
              <input
                id="e-skills"
                value={form.skills}
                onChange={(e) => set('skills', e.target.value)}
                placeholder="Laravel, Vue.js, Postman"
                className="input"
              />
            </Field>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
