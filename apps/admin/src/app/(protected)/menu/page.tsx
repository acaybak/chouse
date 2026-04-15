'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Category = { id: string; nameTr: string; nameEn: string };
type Item = { id: string; nameTr: string; nameEn: string; priceTl: string; category: { nameTr: string } };

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [nameTr, setNameTr] = useState('Latte');
  const [nameEn, setNameEn] = useState('Latte');
  const [priceTl, setPriceTl] = useState(120);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [categoryData, itemData] = await Promise.all([
        apiFetch<Category[]>('/menu/admin/categories'),
        apiFetch<Item[]>('/menu/admin/items'),
      ]);
      setCategories(categoryData);
      setItems(itemData);
      if (!categoryId && categoryData.length > 0) {
        setCategoryId(categoryData[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load menu');
    }
  }, [categoryId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadAll();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadAll]);

  async function createDefaultCategory() {
    await apiFetch('/menu/admin/categories', {
      method: 'POST',
      body: JSON.stringify({
        nameTr: 'Sıcak İçecekler',
        nameEn: 'Hot Drinks',
        descriptionTr: 'Kahve ve çay',
        descriptionEn: 'Coffee and tea',
        sortOrder: 1,
      }),
    });
    await loadAll();
  }

  async function createItem(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await apiFetch('/menu/admin/items', {
        method: 'POST',
        body: JSON.stringify({ categoryId, nameTr, nameEn, priceTl, isFreebieEligible: true }),
      });
      await loadAll();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create item');
    }
  }

  return (
    <section>
      <h2>Menu Management</h2>
      <button onClick={() => void createDefaultCategory()} style={{ marginTop: 10 }}>
        Add Sample Category
      </button>
      <form onSubmit={createItem} style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.nameTr} / {category.nameEn}</option>
          ))}
        </select>
        <input value={nameTr} onChange={(e) => setNameTr(e.target.value)} placeholder="Name TR" required />
        <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Name EN" required />
        <input type="number" value={priceTl} onChange={(e) => setPriceTl(Number(e.target.value))} min={0} step="0.01" />
        <button type="submit">Add Menu Item</button>
      </form>
      {error ? <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p> : null}
      <ul style={{ marginTop: 16 }}>
        {items.map((item) => (
          <li key={item.id}>{item.nameTr} / {item.nameEn} - {item.priceTl} TL ({item.category?.nameTr})</li>
        ))}
      </ul>
    </section>
  );
}
