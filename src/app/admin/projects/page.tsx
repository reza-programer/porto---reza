'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEdit2, FiExternalLink, FiGithub, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import {
  Field,
  FormSection,
  GalleryField,
  ImageField,
  ListShell,
  PageHeader,
  useCollection,
  useUpload,
} from '@/components/admin/AdminUI';
import { formatTags } from '@/lib/project-meta';
import type { Project } from '@/types';

const PLACEHOLDER_IMAGE = '/images/projects/project1.svg';

const emptyForm = {
  title: '',
  description: '',
  longDescription: '',
  image: '',
  gallery: [] as string[],
  tags: '',
  liveUrl: '',
  githubUrl: '',
  featured: true,
};

export default function AdminProjectsPage() {
  const { items: projects, loading, reload } = useCollection<Project>('/api/projects');
  const { uploading, upload } = useUpload();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      image: project.image === PLACEHOLDER_IMAGE ? '' : project.image || '',
      gallery: project.gallery || [],
      tags: project.tags.join(', '),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
    });
    setError('');
    setModalOpen(true);
  };

  const uploadCover = async (files: File[]) => {
    try {
      const [url] = await upload(files.slice(0, 1));
      set('image', url);
    } catch {
      setError('Gagal mengunggah gambar. Coba lagi.');
    }
  };

  const uploadGallery = async (files: File[]) => {
    try {
      const urls = await upload(files);
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
    } catch {
      setError('Sebagian screenshot gagal diunggah.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      image: form.image || PLACEHOLDER_IMAGE,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(editing ? `/api/projects/${editing.id}` : '/api/projects', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setModalOpen(false);
      reload();
    } catch {
      setError('Gagal menyimpan proyek. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Hapus proyek "${project.title.trim()}"?`)) return;
    await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyek"
        description={loading ? 'Memuat…' : `${projects.length} proyek di portofolio.`}
        action={
          <button onClick={openAdd} className="btn btn-primary">
            <FiPlus className="h-4 w-4" /> Tambah proyek
          </button>
        }
      />

      <ListShell loading={loading} empty={projects.length === 0} emptyText="Belum ada proyek.">
        {projects.map((p) => {
          const screens = (p.gallery?.length || 0) + 1;
          return (
            <li key={p.id} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-paper/60 sm:px-5">
              <div className="hidden h-14 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:block">
                <img src={p.image} alt="" className="h-full w-full object-contain" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${p.id}`}
                    target="_blank"
                    className="t-body truncate font-medium text-ink hover:underline"
                  >
                    {p.title.trim()}
                  </Link>
                  {p.githubUrl && <FiGithub className="h-3.5 w-3.5 shrink-0 text-faint" aria-label="GitHub" />}
                  {p.liveUrl && <FiExternalLink className="h-3.5 w-3.5 shrink-0 text-faint" aria-label="Live" />}
                </div>
                <p className="t-small truncate text-muted">{p.description.replace(/\s+/g, ' ').trim()}</p>
                <p className="t-small mt-0.5 truncate text-faint">
                  {screens} screenshot · {p.createdAt.substring(0, 4)} · {formatTags(p.tags).join(', ')}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button onClick={() => openEdit(p)} className="icon-btn" title="Edit" aria-label={`Edit ${p.title}`}>
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="icon-btn hover:bg-red-50 hover:text-red-600"
                  title="Hapus"
                  aria-label={`Hapus ${p.title}`}
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ListShell>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit proyek' : 'Tambah proyek'}
        maxWidth="2xl"
        footer={
          <>
            {error && <span className="t-small mr-auto text-red-600">{error}</span>}
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">
              Batal
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={saving || uploading}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah proyek'}
            </button>
          </>
        }
      >
        <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Informasi">
            <Field label="Judul" htmlFor="p-title">
              <input
                id="p-title"
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="mis. Darma Mizuki"
                className="input"
              />
            </Field>
            <Field label="Deskripsi singkat" htmlFor="p-desc" hint="Tampil di kartu proyek (±2 baris).">
              <textarea
                id="p-desc"
                required
                rows={2}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Deskripsi lengkap" htmlFor="p-long" hint="Tampil di halaman detail proyek.">
              <textarea
                id="p-long"
                rows={5}
                value={form.longDescription}
                onChange={(e) => set('longDescription', e.target.value)}
                className="input"
              />
            </Field>
          </FormSection>

          <FormSection title="Gambar">
            <Field label="Cover" hint="Screenshot utama. Ukuran ideal ±1920×920 px.">
              <ImageField value={form.image} onChange={(v) => set('image', v)} onFiles={uploadCover} uploading={uploading} />
            </Field>
            <Field label={`Screenshot tambahan (${form.gallery.length})`}>
              <GalleryField
                value={form.gallery}
                onChange={(v) => set('gallery', v)}
                onFiles={uploadGallery}
                uploading={uploading}
              />
            </Field>
          </FormSection>

          <FormSection title="Detail">
            <Field label="Teknologi" htmlFor="p-tags" hint="Pisahkan dengan koma.">
              <input
                id="p-tags"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="Laravel, Vue.js, MySQL"
                className="input"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Live URL" htmlFor="p-live">
                <input
                  id="p-live"
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => set('liveUrl', e.target.value)}
                  placeholder="https://"
                  className="input"
                />
              </Field>
              <Field label="GitHub URL" htmlFor="p-gh">
                <input
                  id="p-gh"
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => set('githubUrl', e.target.value)}
                  placeholder="https://github.com/…"
                  className="input"
                />
              </Field>
            </div>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
