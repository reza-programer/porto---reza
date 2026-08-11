'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FiPlus, FiEdit2, FiTrash2, FiAward, FiExternalLink, FiUploadCloud, FiCheck, FiX } from 'react-icons/fi';
import type { Certificate } from '@/types';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    image: '',
    description: '',
    credentialUrl: '',
  });

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();

      setFormData((prev) => ({ ...prev, image: result.url }));
    } catch (err) {
      alert('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      image: '/images/certificates/maganghub-cert.svg',
      description: '',
      credentialUrl: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      image: cert.image || '',
      description: cert.description || '',
      credentialUrl: cert.credentialUrl || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(editingCert ? { id: editingCert.id } : {}),
      ...formData,
    };

    if (editingCert) {
      await fetch('/api/certificates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setModalOpen(false);
    fetchCertificates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' });
    fetchCertificates();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Certificates</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit, or delete certificates and credentials.</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={openAddModal}>
          Add Certificate
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No certificates found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Title & Issuer</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Credential Link</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <FiAward className="w-4 h-4 text-emerald-600 shrink-0" />
                        {cert.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{cert.issuer}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {cert.date}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          View Link <FiExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cert)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
        title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Issuer</label>
              <input
                type="text"
                required
                placeholder="Google / AWS / Meta / Kemenaker"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="text"
                required
                placeholder="2025"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Certificate Image Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Upload Certificate Image
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-colors bg-slate-50/50">
              {formData.image ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center p-2">
                    <img
                      src={formData.image}
                      alt="Certificate Preview"
                      className="max-h-40 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-xs"
                      title="Remove image"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate font-mono">{formData.image}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <FiCheck className="w-3.5 h-3.5" /> Ready
                    </span>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                  <FiUploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">
                    {uploading ? 'Uploading image...' : 'Click to select or upload file'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Supports PNG, JPG, WEBP, SVG
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Certificate of completion for the internship program..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Credential URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {editingCert ? 'Save Changes' : 'Create Certificate'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
