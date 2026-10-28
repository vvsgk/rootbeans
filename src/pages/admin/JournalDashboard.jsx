import {
  ArrowLeft, ArrowUpRight, Check, Download, ExternalLink, Eye, ImagePlus, LockKeyhole,
  Pencil, Plus, Save, Sprout, Trash2, Upload,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PhotoFrame } from '../../components/JournalCard.jsx';
import {
  clearWorkingDraft,
  createEntryTemplate,
  formatDate,
  getWorkingDraft,
  JOURNAL_CATEGORIES,
  saveWorkingDraft,
  SEED_ENTRIES,
  slugify,
} from '../../data/journal.js';

function ActionButton({ children, className = '', ...props }) {
  return <button className={`button-outline ${className}`.trim()} {...props}>{children}</button>;
}

export default function JournalDashboard({ entries, saveEntries, navigate, notify }) {
  const [editing, setEditing] = useState(null);
  const [workingDraft, setWorkingDraft] = useState(() => getWorkingDraft());
  const [confirmDelete, setConfirmDelete] = useState('');
  const [storageWarning, setStorageWarning] = useState('');

  const published = useMemo(() => entries.filter((entry) => entry.status === 'published'), [entries]);
  const drafts = useMemo(() => entries.filter((entry) => entry.status === 'draft'), [entries]);

  useEffect(() => {
    if (!editing) return undefined;
    const stored = saveWorkingDraft(editing);
    if (!stored) setStorageWarning('The browser could not save this working copy. Export or copy your text before leaving the editor.');
    else setStorageWarning('');
    setWorkingDraft({ ...editing, autosavedAt: new Date().toISOString() });
    return undefined;
  }, [editing]);

  const beginNew = () => setEditing(createEntryTemplate(entries));
  const beginEdit = (entry) => setEditing({ ...entry });
  const updateField = (field, value) => setEditing((current) => ({ ...current, [field]: value }));

  const saveEntry = () => {
    if (!editing?.title?.trim()) {
      window.alert('Add an entry title before saving.');
      return;
    }
    const finalSlug = slugify(editing.slug || editing.title);
    if (!finalSlug) {
      window.alert('Add a title that can be used to create the entry URL.');
      return;
    }
    if (editing.status === 'published' && !editing.body?.trim()) {
      const shouldPublish = window.confirm('The full story is empty. Save this as a draft instead?');
      if (!shouldPublish) return;
      editing.status = 'draft';
    }
    const duplicateSlug = entries.some((entry) => entry.slug === finalSlug && entry.id !== editing.id);
    if (duplicateSlug) {
      window.alert('Another entry already uses this URL slug. Change the slug before saving.');
      return;
    }

    const value = { ...editing, slug: finalSlug, title: editing.title.trim() };
    const isExisting = entries.some((entry) => entry.id === value.id);
    const updated = isExisting
      ? entries.map((entry) => entry.id === value.id ? value : entry)
      : [...entries, value];
    const persisted = saveEntries(updated);
    if (!persisted) return;
    clearWorkingDraft();
    setWorkingDraft(null);
    setEditing(null);
    setStorageWarning('');
    notify(value.status === 'published' ? 'Entry published and public pages updated.' : 'Draft saved privately.');
  };

  const deleteEntry = (id) => {
    const updated = entries.filter((entry) => entry.id !== id);
    if (!saveEntries(updated)) return;
    setConfirmDelete('');
    notify('Entry deleted.');
  };

  const recoverDraft = () => {
    if (!workingDraft) return;
    setEditing({ ...workingDraft });
  };

  const discardWorkingDraft = () => {
    clearWorkingDraft();
    setWorkingDraft(null);
    setStorageWarning('');
    notify('Unfinished working copy cleared.');
  };

  const uploadCover = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Choose an image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 1_000_000) {
      window.alert('For this browser-storage prototype, use an image smaller than 1 MB. A production version should use dedicated image storage.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField('cover', String(reader.result || ''));
    reader.onerror = () => window.alert('The image could not be read. Try another file.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const exportBackup = () => {
    const backup = {
      app: 'Root Beans Journal',
      version: 1,
      exportedAt: new Date().toISOString(),
      entries,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `root-beans-journal-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Journal backup downloaded. Keep it somewhere safe.');
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const importedEntries = Array.isArray(parsed) ? parsed : parsed.entries;
      const isValid = Array.isArray(importedEntries) && importedEntries.every((entry) =>
        entry && typeof entry.id === 'string' && typeof entry.title === 'string' &&
        typeof entry.slug === 'string' && ['draft', 'published'].includes(entry.status),
      );
      if (!isValid) throw new Error('This file does not look like a Root Beans journal backup.');
      const confirmed = window.confirm(`Restore ${importedEntries.length} entries from this backup? This replaces the journal currently stored in this browser.`);
      if (!confirmed) return;
      if (!saveEntries(importedEntries)) return;
      clearWorkingDraft();
      setWorkingDraft(null);
      setEditing(null);
      notify('Journal backup restored.');
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'The backup could not be read.');
    } finally {
      event.target.value = '';
    }
  };

  const resetDemo = () => {
    const confirmed = window.confirm('Restore the original demo entries? This replaces all entries saved in this browser.');
    if (!confirmed) return;
    if (!saveEntries(SEED_ENTRIES.map((entry) => ({ ...entry })))) return;
    clearWorkingDraft();
    setWorkingDraft(null);
    setEditing(null);
    notify('Demo content restored.');
  };

  if (editing) {
    return (
      <div className="admin-shell">
        <header className="admin-top">
          <button className="wordmark" onClick={() => navigate('/')}>ROOT BEANS<span className="wordmark-dot">.</span></button>
          <button className="text-link" onClick={() => { setWorkingDraft(getWorkingDraft()); setEditing(null); }}><ArrowLeft size={15} /> Back to dashboard</button>
        </header>
        <main className="admin-content">
          <p className="eyebrow">JOURNAL EDITOR · ENTRY {editing.id}</p>
          <h1>{entries.some((entry) => entry.id === editing.id) ? 'Edit entry' : 'New journey entry'}</h1>
          <p className="admin-intro">Write what actually happened. Your working copy autosaves in this browser while you edit. Publish only when the observations are ready to share.</p>
          {storageWarning && <div className="storage-warning" role="alert">{storageWarning}</div>}
          <div className="editor-grid">
            <div className="editor-main">
              <label>Entry title<input value={editing.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Our first planting" /></label>
              <label>Short introduction<textarea rows="3" value={editing.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} placeholder="A short summary shown on journal cards" /></label>
              <label>Full story<textarea className="body-editor" rows="12" value={editing.body} onChange={(event) => updateField('body', event.target.value)} placeholder="Write your story. Separate paragraphs with a blank line." /></label>
              <div className="editor-facts">
                <label>The question<textarea rows="3" value={editing.question || ''} onChange={(event) => updateField('question', event.target.value)} placeholder="What were you trying to learn?" /></label>
                <label>What we did<textarea rows="3" value={editing.did || ''} onChange={(event) => updateField('did', event.target.value)} placeholder="Describe the real process." /></label>
                <label>What we learned<textarea rows="3" value={editing.learned || ''} onChange={(event) => updateField('learned', event.target.value)} placeholder="What did you observe?" /></label>
                <label>What happens next<textarea rows="3" value={editing.next || ''} onChange={(event) => updateField('next', event.target.value)} placeholder="What will you do next?" /></label>
              </div>
            </div>
            <aside className="editor-side">
              <label>Publication status<select value={editing.status} onChange={(event) => updateField('status', event.target.value)}><option value="draft">Draft · private</option><option value="published">Published · public</option></select></label>
              <label>Date<input type="date" value={editing.date || ''} onChange={(event) => updateField('date', event.target.value)} /></label>
              <label>Category<select value={editing.category} onChange={(event) => updateField('category', event.target.value)}>{JOURNAL_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>URL slug<input value={editing.slug || ''} onChange={(event) => updateField('slug', slugify(event.target.value))} placeholder="generated-from-title" /><span className="field-help">Used in the entry's unique URL. Leave blank to generate from the title.</span></label>
              <div className="upload-box">
                <p className="eyebrow">COVER PHOTOGRAPH</p>
                <PhotoFrame src={editing.cover} kind="admin-cover" alt="Entry cover preview" />
                <label className="upload-button"><ImagePlus size={15} /> Upload image<input type="file" accept="image/*" onChange={uploadCover} hidden /></label>
                <button className="text-link" type="button" onClick={() => updateField('cover', '')}>Remove cover</button>
                <p className="small-note">Use authentic Root Beans photography. Keep local prototype images under 1 MB.</p>
              </div>
              <button className="button-dark full-width" onClick={saveEntry}><Save size={15} /> Save entry</button>
              <ActionButton className="full-width" disabled={editing.status !== 'published'} onClick={() => navigate(`/journey/${slugify(editing.slug || editing.title)}`)}><Eye size={15} /> {editing.status === 'published' ? 'Preview published URL' : 'Publish to enable preview'}</ActionButton>
              <p className="small-note editor-autosave-note"><Check size={12} /> Working copy autosaves in this browser.</p>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <button className="wordmark" onClick={() => navigate('/')}>ROOT BEANS<span className="wordmark-dot">.</span></button>
        <div>
          <button className="text-link" onClick={() => navigate('/')} >View website <ExternalLink size={14} /></button>
          <span className="admin-label"><LockKeyhole size={13} /> LOCAL DEMO DASHBOARD</span>
        </div>
      </header>
      <main className="admin-content">
        <p className="eyebrow">ROOT BEANS · PUBLISHING</p>
        <h1>The journal desk.</h1>
        <p className="admin-intro">Create and publish the moments that make up your journey. Published entries automatically update the homepage preview and the Journey archive. Drafts remain private.</p>
        <div className="admin-stats">
          <div><span>PUBLISHED</span><strong>{published.length}</strong></div>
          <div><span>DRAFTS</span><strong>{drafts.length}</strong></div>
          <div><span>HOMEPAGE PREVIEW</span><strong>{Math.min(2, published.length)} / 2</strong></div>
        </div>

        {workingDraft && <div className="admin-note resume-draft-note">
          <Save size={18} /><div><strong>Unfinished work recovered</strong><p>{workingDraft.title || 'Untitled entry'} · Last autosaved {workingDraft.autosavedAt ? new Date(workingDraft.autosavedAt).toLocaleString() : 'during your last session'}. This copy is stored in the current browser.</p><button className="inline-link" onClick={recoverDraft}>Resume editing <ArrowUpRight size={14} /></button><button className="text-link" onClick={discardWorkingDraft}>Discard working copy</button></div>
        </div>}

        <div className="admin-list-head"><h2>Entries</h2><button className="button-dark" onClick={beginNew}><Plus size={15} /> New entry</button></div>
        <div className="admin-list">
          {[...entries].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).map((entry) => (
            <div className="admin-row" key={entry.id}>
              <div className="admin-entry-num">{entry.id}</div>
              <div className="admin-entry-title"><h3>{entry.title || 'Untitled entry'}</h3><p>{formatDate(entry.date)} · {entry.category}</p></div>
              <span className={`status status-${entry.status}`}>{entry.status}</span>
              <div className="admin-row-actions">
                {entry.status === 'published' && <button title="View entry" aria-label={`View ${entry.title}`} onClick={() => navigate(`/journey/${entry.slug}`)}><Eye size={16} /></button>}
                <button title="Edit entry" aria-label={`Edit ${entry.title}`} onClick={() => beginEdit(entry)}><Pencil size={16} /></button>
                <button title="Delete entry" aria-label={`Delete ${entry.title}`} onClick={() => setConfirmDelete(entry.id)}><Trash2 size={16} /></button>
              </div>
              {confirmDelete === entry.id && <div className="confirm-delete"><span>Delete this entry?</span><button onClick={() => deleteEntry(entry.id)}>Delete</button><button onClick={() => setConfirmDelete('')}>Cancel</button></div>}
            </div>
          ))}
        </div>
        <div className="admin-note"><Sprout size={18} /><div><strong>How journal persistence works</strong><p>Entries and unfinished editor text are stored in this browser's localStorage, so they survive stopping and restarting the development server on the same browser profile. Homepage and Journey both read the same entries. This is not cloud sync or a backup; shared multi-device editing needs a secured database, authentication and image storage.</p></div></div>
        <div className="admin-tools">
          <button className="button-outline" onClick={exportBackup}><Download size={14} /> Download journal backup</button>
          <label className="button-outline import-backup"><Upload size={14} /> Restore from backup<input type="file" accept="application/json,.json" onChange={importBackup} hidden /></label>
          <button className="text-link reset-demo" onClick={resetDemo}>Reset demo content</button>
        </div>
      </main>
    </div>
  );
}
