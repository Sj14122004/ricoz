'use client';
import { FormEvent, useState } from 'react';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { ErrorNote, Spinner } from '@/components/ui/States';
import { useAsync } from '@/hooks/useAsync';
import { CATEGORIES } from '@/lib/constants';
import { money } from '@/lib/format';
import { productService } from '@/services/product.service';
import { Product } from '@/types';

const blank = { name: '', description: '', category: 'formula', price: '', stockQuantity: '', imageEmoji: '🍼', ageSuitability: '', warnings: '' };

export default function ProductsPanel() {
  const { data, loading, error, reload } = useAsync(productService.listAll);
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState('');

  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  function open(p: Product | 'new') {
    setEditing(p);
    setFormError('');
    setForm(p === 'new' ? blank : {
      name: p.name, description: p.description, category: p.category, price: String(p.price),
      stockQuantity: String(p.stockQuantity), imageEmoji: p.imageEmoji, ageSuitability: p.ageSuitability, warnings: p.warnings,
    });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const payload = { ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity) };
    try {
      if (editing === 'new') await productService.create(payload);
      else if (editing) await productService.update(editing._id, payload);
      setEditing(null);
      reload();
    } catch (err) { setFormError((err as Error).message); }
  }

  async function patch(p: Product, data: Partial<Product>) {
    await productService.update(p._id, data).catch(() => null);
    reload();
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><button className="btn-lamp" onClick={() => open('new')}>Add product</button></div>

      {editing && (
        <form onSubmit={save} className="panel grid gap-4 sm:grid-cols-2">
          <h2 className="text-lg font-semibold sm:col-span-2">{editing === 'new' ? 'New product' : `Edit ${editing.name}`}</h2>
          <TextInput label="Name" required value={form.name} onChange={set('name')} />
          <TextInput label="Emoji" maxLength={4} value={form.imageEmoji} onChange={set('imageEmoji')} />
          <div className="sm:col-span-2"><TextArea label="Description" required value={form.description} onChange={set('description')} /></div>
          <Field label="Category">
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.filter((c) => c.value).map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <TextInput label="Age suitability" value={form.ageSuitability} onChange={set('ageSuitability')} />
          <TextInput label="Price (₹)" type="number" min={0} required value={form.price} onChange={set('price')} />
          <TextInput label="Stock quantity" type="number" min={0} required value={form.stockQuantity} onChange={set('stockQuantity')} />
          <div className="sm:col-span-2"><TextArea label="Warnings" hint="Shown to parents on the product card" value={form.warnings} onChange={set('warnings')} /></div>
          {formError && <div className="sm:col-span-2"><ErrorNote message={formError} /></div>}
          <div className="flex gap-2 sm:col-span-2">
            <button className="btn-primary">Save product</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="panel overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-night-100/50 text-night">
            <tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p._id} className="border-t border-night-100/60">
                <td className="p-3 font-medium">{p.imageEmoji} {p.name}</td>
                <td className="p-3">{money(p.price)}</td>
                <td className="p-3">
                  <input aria-label={`Stock for ${p.name}`} type="number" min={0} defaultValue={p.stockQuantity}
                    className={`input !w-20 !py-1.5 ${p.stockQuantity <= 5 ? '!border-danger' : ''}`}
                    onBlur={(e) => Number(e.target.value) !== p.stockQuantity && patch(p, { stockQuantity: Number(e.target.value) })} />
                </td>
                <td className="p-3">{p.isActive ? 'Listed' : 'Hidden'}</td>
                <td className="space-x-2 whitespace-nowrap p-3 text-right">
                  <button className="font-semibold text-night underline" onClick={() => open(p)}>Edit</button>
                  <button className="font-semibold text-slate-500 underline" onClick={() => patch(p, { isActive: !p.isActive })}>{p.isActive ? 'Hide' : 'Show'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
