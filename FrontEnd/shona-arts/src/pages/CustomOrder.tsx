import { zodResolver } from '@hookform/resolvers/zod';
import { Palette, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../components/Toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { api } from '../services/api';

const customOrderSchema = z.object({
  artStyle: z.string().min(2, 'Choose an art style'),
  budget: z.coerce.number().min(25, 'Budget should be at least $25'),
  notes: z.string().min(12, 'Tell the artist a little more'),
});

type CustomOrderInput = z.input<typeof customOrderSchema>;
type CustomOrderForm = z.output<typeof customOrderSchema>;

export function CustomOrder() {
  const [referenceImage, setReferenceImage] = useState('');
  const [preview, setPreview] = useState('');
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomOrderInput, unknown, CustomOrderForm>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: { artStyle: 'Devotional / Spiritual', budget: 150, notes: '' },
  });

  const submit = async (values: CustomOrderForm) => {
    await api.post('/custom-orders', { ...values, referenceImage: referenceImage || preview || 'pending-upload' });
    showToast('Custom artwork request sent');
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Custom order</p>
        <h1 className="font-display text-5xl font-extrabold">Request devotional, spiritual, or bespoke artwork.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Share references, choose your style, set a budget, and track progress from admin approval to delivery.
        </p>
        <div className="mt-8 overflow-hidden rounded-lg bg-gallery-rose dark:bg-white/10">
          {preview ? <img src={preview} alt="Reference preview" className="h-96 w-full object-cover" /> : <div className="grid h-96 place-items-center text-zinc-500"><Palette className="h-16 w-16 text-gallery-red" /></div>}
        </div>
      </div>
      <form onSubmit={handleSubmit(submit)} className="glass rounded-lg p-6">
        <label className="mb-5 grid cursor-pointer place-items-center rounded-lg border border-dashed border-gallery-red p-8 text-center">
          <UploadCloud className="mb-3 h-8 w-8 text-gallery-red" />
          <span className="font-bold">Upload reference image</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setReferenceImage(file.name);
            setPreview(URL.createObjectURL(file));
          }} />
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-bold">Art style</span>
          <Input {...register('artStyle')} />
          {errors.artStyle && <p className="mt-1 text-sm font-semibold text-gallery-red">{errors.artStyle.message}</p>}
        </label>
        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-bold">Budget</span>
          <Input type="number" {...register('budget')} />
          {errors.budget && <p className="mt-1 text-sm font-semibold text-gallery-red">{errors.budget.message}</p>}
        </label>
        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-bold">Special notes</span>
          <textarea {...register('notes')} className="min-h-36 w-full rounded-md border border-red-100 bg-white px-4 py-3 outline-none focus:border-gallery-red dark:border-white/10 dark:bg-zinc-900" placeholder="Size, spiritual symbols, colors, delivery deadline..." />
          {errors.notes && <p className="mt-1 text-sm font-semibold text-gallery-red">{errors.notes.message}</p>}
        </label>
        <Button type="submit" disabled={isSubmitting} className="w-full">Submit custom request</Button>
      </form>
    </section>
  );
}
