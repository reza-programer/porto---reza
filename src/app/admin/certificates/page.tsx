'use client';

import React, { useState } from 'react';
import { FiAward, FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Field, FormSection, ImageField, ListShell, PageHeader, useCollection, useUpload } from '@/components/admin/AdminUI';
import { formatTitle } from '@/lib/project-meta';
import type { Certificate } from '@/types';

const emptyForm = {
  title: '',
  issuer: '',
  date: '',
  image: '',
  description: '',
  credentialUrl: '',
};

export default function AdminCertificatesPage() {
  const { items: certificates, loading, reload } = useCollection<Certificate>('/api/certificates');
  const { uploading, upload } = useUpload();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
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

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      image: cert.image || '',
      description: cert.description || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setError('');
    setModalOpen(true);
  };

  const uploadImage = async (files: File[]) => {
    try {
      const [url] = await upload(files.slice(0, 1));
      set('image', url);
    } catch {
      setError('Gagal mengunggah gambar. Coba lagi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/certificates', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editing ? { id: editing.id } : {}), ...form }),
      });
      if (!res.ok) throw new Error('Save failed');
      setModalOpen(false);
      reload();
    } catch {
      setError('Gagal menyimpan sertifikat. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert: Certificate) => {
    if (!confirm(`Hapus sertifikat "${formatTitle(cert.title)}"?`)) return;
    await fetch(`/api/certificates?id=${cert.id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sertifikat"
        description={loading ? 'Memuat…' : `${certificates.length} sertifikat & kredensial.`}
        action={
          <button onClick={openAdd} className="btn btn-primary">
            <FiPlus className="h-4 w-4" /> Tambah sertifikat
          </button>
        }
      />

      <ListShell loading={loading} empty={certificates.length === 0} emptyText="Belum ada sertifikat.">
        {certificates.map((cert) => (
          <li key={cert.id} className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-paper/60 sm:px-5">
            <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-paper p-1">
              {cert.image ? (
                <img src={cert.image} alt="" className="h-full w-full object-contain" />
              ) : (
                <FiAward className="h-4 w-4 text-faint" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="t-body truncate font-medium text-ink">{formatTitle(cert.title)}</p>
              <p className="t-small truncate text-muted">
                {cert.issuer} · {cert.date}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  title="Buka kredensial"
                  aria-label="Buka kredensial"
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
              )}
              <button onClick={() => openEdit(cert)} className="icon-btn" title="Edit" aria-label={`Edit ${cert.title}`}>
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(cert)}
                className="icon-btn hover:bg-red-50 hover:text-red-600"
                title="Hapus"
                aria-label={`Hapus ${cert.title}`}
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
        title={editing ? 'Edit sertifikat' : 'Tambah sertifikat'}
        maxWidth="xl"
        footer={
          <>
            {error && <span className="t-small mr-auto text-red-600">{error}</span>}
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">
              Batal
            </button>
            <button
              type="submit"
              form="certificate-form"
              disabled={saving || uploading}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Menyimpan…' : editing ? 'Simpan perubahan' : 'Tambah sertifikat'}
            </button>
          </>
        }
      >
        <form id="certificate-form" onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Informasi">
            <Field label="Judul" htmlFor="c-title">
              <input
                id="c-title"
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="mis. Pengembang Sistem Informasi"
                className="input"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Penerbit" htmlFor="c-issuer">
                <input
                  id="c-issuer"
                  required
                  value={form.issuer}
                  onChange={(e) => set('issuer', e.target.value)}
                  placeholder="mis. BNSP"
                  className="input"
                />
              </Field>
              <Field label="Tahun" htmlFor="c-date">
                <input
                  id="c-date"
                  required
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  placeholder="2025"
                  className="input"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Gambar sertifikat">
            <ImageField value={form.image} onChange={(v) => set('image', v)} onFiles={uploadImage} uploading={uploading} />
          </FormSection>

          <FormSection title="Detail">
            <Field label="Deskripsi" htmlFor="c-desc">
              <textarea
                id="c-desc"
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="input"
              />
            </Field>
            <Field label="URL kredensial" htmlFor="c-url" hint="Opsional — link verifikasi sertifikat.">
              <input
                id="c-url"
                type="url"
                value={form.credentialUrl}
                onChange={(e) => set('credentialUrl', e.target.value)}
                placeholder="https://"
                className="input"
              />
            </Field>
          </FormSection>
        </form>
      </Modal>
    </div>
  );
}
