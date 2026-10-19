'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiImage, FiPlus, FiUploadCloud, FiX } from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/* Data hooks                                                          */
/* ------------------------------------------------------------------ */

/** Loads a JSON array from `url`; `reload()` fetches it again. */
export function useCollection<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => res.json())
      .then((data: T[]) => {
        if (cancelled) return;
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { items, setItems, loading, reload };
}

/** Uploads files to /api/upload and resolves with their public URLs. */
export function useUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (files: File[]) => {
    setUploading(true);
    try {
      return await Promise.all(
        files.map(async (file) => {
          const body = new FormData();
          body.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body });
          if (!res.ok) throw new Error('Upload failed');
          const result = await res.json();
          return result.url as string;
        })
      );
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, upload };
}

/* ------------------------------------------------------------------ */
/* Layout pieces                                                       */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="t-h2">{title}</h1>
        {description && <p className="t-body mt-1 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Bordered list container with loading and empty states. */
export function ListShell({
  loading,
  empty,
  emptyText,
  children,
}: {
  loading: boolean;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {loading ? (
        <ul className="divide-y divide-line" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex animate-pulse items-center gap-4 px-5 py-4">
              <div className="h-12 w-20 rounded-lg bg-paper" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-paper" />
                <div className="h-3 w-2/3 rounded bg-paper" />
              </div>
            </li>
          ))}
        </ul>
      ) : empty ? (
        <div className="t-body px-5 py-14 text-center text-muted">{emptyText}</div>
      ) : (
        <ul className="divide-y divide-line">{children}</ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form pieces                                                         */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  htmlFor,
  hint,
  className = '',
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="t-small mb-1.5 block font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="t-small mt-1.5 text-faint">{hint}</p>}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-line pt-5 first:border-t-0 first:pt-0">
      <legend className="eyebrow mb-4">{title}</legend>
      {children}
    </fieldset>
  );
}

function useDropzone(onFiles: (files: File[]) => void, disabled?: boolean) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      },
      onDragLeave: () => setOver(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setOver(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
        if (files.length) onFiles(files);
      },
    },
  };
}

/** Single image: preview with replace/remove, or a drop zone. */
export function ImageField({
  value,
  onChange,
  onFiles,
  uploading,
  hint = 'PNG, JPG, WebP atau SVG',
  square = false,
}: {
  value: string;
  onChange: (url: string) => void;
  onFiles: (files: File[]) => void;
  uploading: boolean;
  hint?: string;
  square?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const drop = useDropzone(onFiles, uploading);
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div {...drop.props}>
      <input ref={input} type="file" accept="image/*" onChange={pick} disabled={uploading} className="hidden" />
      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-line bg-paper p-3">
          <div
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface ${
              square ? 'h-16 w-16 p-1.5' : 'h-20 w-40'
            }`}
          >
            <img src={value} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="t-small truncate text-muted">{value}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => input.current?.click()}
                disabled={uploading}
                className="btn btn-outline px-3 py-1.5 text-[0.8125rem]"
              >
                {uploading ? 'Mengunggah…' : 'Ganti'}
              </button>
              <button type="button" onClick={() => onChange('')} className="btn btn-ghost px-3 py-1.5 text-[0.8125rem]">
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-7 text-center transition-colors ${
            drop.over ? 'border-ink bg-paper' : 'border-line-strong hover:border-ink hover:bg-paper'
          }`}
        >
          <FiUploadCloud className="mb-1 h-5 w-5 text-muted" />
          <span className="t-small font-medium text-ink">
            {uploading ? 'Mengunggah…' : 'Klik atau seret gambar ke sini'}
          </span>
          <span className="t-small text-faint">{hint}</span>
        </button>
      )}
    </div>
  );
}

/** Multiple images: thumbnail grid with remove buttons and an add tile. */
export function GalleryField({
  value,
  onChange,
  onFiles,
  uploading,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  onFiles: (files: File[]) => void;
  uploading: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const drop = useDropzone(onFiles, uploading);
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div {...drop.props} className={`rounded-xl transition-colors ${drop.over ? 'bg-paper ring-1 ring-ink' : ''}`}>
      <input ref={input} type="file" accept="image/*" multiple onChange={pick} disabled={uploading} className="hidden" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative aspect-[21/10] overflow-hidden rounded-lg border border-line bg-paper">
            <img src={url} alt={`Screenshot ${i + 1}`} className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              aria-label={`Hapus screenshot ${i + 1}`}
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="flex aspect-[21/10] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-muted transition-colors hover:border-ink hover:bg-paper hover:text-ink"
        >
          {uploading ? (
            <span className="t-small">Mengunggah…</span>
          ) : (
            <>
              <FiPlus className="h-4 w-4" />
              <span className="t-small">Tambah</span>
            </>
          )}
        </button>
      </div>
      {value.length === 0 && (
        <p className="t-small mt-2 flex items-center gap-1.5 text-faint">
          <FiImage className="h-3.5 w-3.5" /> Belum ada screenshot tambahan.
        </p>
      )}
    </div>
  );
}
