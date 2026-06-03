import { useEffect, useState } from 'react';
import { deleteMediaAsset, fetchMediaLibrary, uploadMediaAsset } from '../services/blogApi';
import { getAssetUrl } from '../api';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const payload = await fetchMediaLibrary();
      setAssets(payload.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function onUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set('file', file);
    setUploading(true);
    try {
      await uploadMediaAsset(formData);
      await reload();
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(id) {
    await deleteMediaAsset(id);
    await reload();
  }

  if (loading) return <p>Loading media library...</p>;

  return (
    <section>
      <h1>Media library</h1>
      <input type="file" onChange={onUpload} disabled={uploading} />
      <div className="media-grid">
        {assets.map((asset) => (
          <article key={asset._id} className="media-card">
            {asset.mimeType?.startsWith('image/') ? (
              <img src={getAssetUrl(asset.path)} alt={asset.altText || asset.filename} />
            ) : (
              <p>{asset.filename}</p>
            )}
            <button type="button" onClick={() => onDelete(asset._id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
