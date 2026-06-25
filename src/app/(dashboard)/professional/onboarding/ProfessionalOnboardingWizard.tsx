'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Upload, Sparkles, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrencyInr } from '@/lib/currency';

type Category = {
  id: string;
  name: string;
};

type ServiceDraft = {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  price: string;
  durationMinutes: string;
  isActive: boolean;
};

type Props = {
  categories: Category[];
};

const stepLabels = ['Profile', 'Photo', 'Pricing', 'Services', 'Publish'];

function createServiceDraft(categoryId: string): ServiceDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: '',
    categoryId,
    description: '',
    price: '',
    durationMinutes: '60',
    isActive: true,
  };
}

export function ProfessionalOnboardingWizard({ categories }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState('Reliable professional services for modern Indian homes and businesses.');
  const [description, setDescription] = useState(
    'I help customers with premium, dependable service delivery that feels clear, fast, and easy to trust.'
  );
  const [yearsExperience, setYearsExperience] = useState('3');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('2500');
  const [isAvailable, setIsAvailable] = useState(true);
  const [services, setServices] = useState<ServiceDraft[]>([createServiceDraft(categories[0]?.id ?? '')]);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const progress = useMemo(() => Math.round((step / 5) * 100), [step]);

  const canGoNext =
    (step === 1 && headline.trim().length >= 10 && description.trim().length >= 20 && yearsExperience && city.trim() && state.trim()) ||
    (step === 2 && Boolean(profileImage)) ||
    (step === 3 && Number(hourlyRate) > 0) ||
    (step === 4 && services.every((service) => service.title.trim().length >= 2 && service.categoryId && Number(service.price) > 0)) ||
    step === 5;

  const updateService = (id: string, field: keyof ServiceDraft, value: string | boolean) => {
    setServices((current) => current.map((service) => (service.id === id ? { ...service, [field]: value } : service)));
  };

  const addService = () => {
    setServices((current) => [...current, createServiceDraft(categories[0]?.id ?? '')]);
  };

  const removeService = (id: string) => {
    setServices((current) => (current.length > 1 ? current.filter((service) => service.id !== id) : current));
  };

  const uploadProfileImage = async (file?: File | null) => {
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const signatureResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder: 'skillbridge/professionals' }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Could not prepare image upload.');
      }

      const signaturePayload = (await signatureResponse.json()) as {
        signature: string;
        timestamp: number;
        cloudName: string;
        apiKey: string;
        uploadPreset: string;
        folder: string;
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signaturePayload.apiKey);
      formData.append('timestamp', String(signaturePayload.timestamp));
      formData.append('signature', signaturePayload.signature);
      formData.append('folder', signaturePayload.folder);
      formData.append('upload_preset', signaturePayload.uploadPreset);

      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error('Image upload failed.');
      }

      const payload = (await cloudinaryResponse.json()) as { secure_url?: string };
      if (!payload.secure_url) {
        throw new Error('Upload did not return an image URL.');
      }

      setProfileImage(payload.secure_url);
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const publishProfile = async () => {
    setPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding/professional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headline,
          description,
          yearsExperience: Number(yearsExperience),
          city,
          state,
          profileImage,
          hourlyRate: Number(hourlyRate),
          isAvailable,
          services: services.map((service) => ({
            title: service.title.trim(),
            description: service.description.trim() || null,
            price: Number(service.price),
            durationMinutes: service.durationMinutes ? Number(service.durationMinutes) : null,
            categoryId: service.categoryId,
            isActive: service.isActive,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Could not publish your profile.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (publishError) {
      console.error(publishError);
      setError(publishError instanceof Error ? publishError.message : 'Could not publish your profile.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Professional onboarding
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">Publish your professional profile</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Build your profile in a few focused steps, then publish once you are ready to show up in search and booking pages.
            </p>
          </div>
          <div className="hidden min-w-[140px] rounded-3xl bg-neutral-950 px-4 py-3 text-white sm:block">
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Progress</div>
            <div className="mt-1 text-2xl font-semibold">{progress}%</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            {stepLabels.map((label, index) => (
              <span key={label} className={index + 1 === step ? 'text-neutral-950' : ''}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full rounded-full bg-neutral-950 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl">Tell people who you are</CardTitle>
            <CardDescription>Write a strong headline and a polished description for your marketplace profile.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Headline</label>
              <Input value={headline} onChange={(event) => setHeadline(event.target.value)} placeholder="Concise professional headline" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Description</label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Experience</label>
                <Input value={yearsExperience} onChange={(event) => setYearsExperience(event.target.value)} type="number" min="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">City</label>
                <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">State</label>
                <Input value={state} onChange={(event) => setState(event.target.value)} placeholder="Maharashtra" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl">Upload a profile image</CardTitle>
            <CardDescription>Use Cloudinary to give your profile a real photo and stronger trust signal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div className="rounded-[1.6rem] border border-dashed border-neutral-300 bg-neutral-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-neutral-950">Profile photo</div>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">JPG, PNG, or WEBP. A clear portrait works best.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-950">
                  <Upload className="h-4 w-4" />
                  Select image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => uploadProfileImage(event.target.files?.[0])}
                  />
                </label>
              </div>
              {uploading ? <p className="mt-4 text-sm text-neutral-500">Uploading image...</p> : null}
              {profileImage ? (
                <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-neutral-200 bg-white">
                  <img src={profileImage} alt="Profile preview" className="h-64 w-full object-cover sm:h-80" />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl">Set your pricing</CardTitle>
            <CardDescription>Choose your hourly rate and whether you are accepting new work right now.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Hourly rate</label>
              <Input value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} type="number" min="0" />
              <p className="text-xs text-neutral-500">{formatCurrencyInr(Number(hourlyRate) || 0)} per hour</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Availability</label>
              <button
                type="button"
                onClick={() => setIsAvailable((current) => !current)}
                className={`flex h-11 w-full items-center justify-between rounded-full border px-4 text-sm font-semibold ${
                  isAvailable ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-white text-neutral-600'
                }`}
              >
                {isAvailable ? 'Available for bookings' : 'Currently unavailable'}
                <Check className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-6">
            <div>
              <CardTitle className="text-2xl">Add services</CardTitle>
              <CardDescription>Include the services you want to publish immediately.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addService}>
              <Plus className="h-4 w-4" />
              Add service
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {services.map((service, index) => (
              <div key={service.id} className="rounded-[1.6rem] border border-neutral-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-neutral-950">Service {index + 1}</div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeService(service.id)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={service.title}
                    onChange={(event) => updateService(service.id, 'title', event.target.value)}
                    placeholder="Service title"
                  />
                  <Select value={service.categoryId} onChange={(event) => updateService(service.id, 'categoryId', event.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    value={service.price}
                    onChange={(event) => updateService(service.id, 'price', event.target.value)}
                    type="number"
                    min="0"
                    placeholder="Price in INR"
                  />
                  <Input
                    value={service.durationMinutes}
                    onChange={(event) => updateService(service.id, 'durationMinutes', event.target.value)}
                    type="number"
                    min="15"
                    placeholder="Duration minutes"
                  />
                  <Textarea
                    value={service.description}
                    onChange={(event) => updateService(service.id, 'description', event.target.value)}
                    rows={3}
                    className="md:col-span-2"
                    placeholder="Service description"
                  />
                  <button
                    type="button"
                    onClick={() => updateService(service.id, 'isActive', !service.isActive)}
                    className={`flex h-11 items-center justify-between rounded-full border px-4 text-sm font-semibold md:col-span-2 ${
                      service.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-white text-neutral-600'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card className="border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl">Review and publish</CardTitle>
            <CardDescription>Confirm your profile before it goes live in the marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Profile</div>
                <div className="mt-2 text-sm font-semibold text-neutral-950">{headline}</div>
                <div className="mt-1 text-sm text-neutral-600">
                  {city}, {state}
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Pricing</div>
                <div className="mt-2 text-sm font-semibold text-neutral-950">{formatCurrencyInr(Number(hourlyRate) || 0)} / hour</div>
                <div className="mt-1 text-sm text-neutral-600">{isAvailable ? 'Available for bookings' : 'Unavailable'}</div>
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-neutral-200 bg-white p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-neutral-500">Services</div>
              <div className="mt-3 grid gap-3">
                {services.map((service) => (
                  <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <div>
                      <div className="font-semibold text-neutral-950">{service.title || 'Untitled service'}</div>
                      <div className="text-sm text-neutral-500">
                        {service.price ? formatCurrencyInr(Number(service.price)) : formatCurrencyInr(0)}{' '}
                        {service.durationMinutes ? `- ${service.durationMinutes} mins` : ''}
                      </div>
                    </div>
                    <Badge variant="secondary">{categories.find((category) => category.id === service.categoryId)?.name}</Badge>
                  </div>
                ))}
              </div>
            </div>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <Button type="button" onClick={publishProfile} className="w-full" size="lg" variant="gradient" disabled={publishing || uploading}>
              {publishing ? 'Publishing profile...' : 'Publish profile'}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          disabled={step === 1}
          className="sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {step < 5 ? (
          <Button type="button" onClick={() => setStep((current) => current + 1)} disabled={!canGoNext} className="sm:w-auto">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/70 bg-neutral-950 p-4 text-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
          <Sparkles className="h-3.5 w-3.5" />
          Live preview
        </div>
        <p className="mt-3 text-sm leading-6 text-white/80">
          {profileImage ? 'Your uploaded image is ready to be published with the profile.' : 'Upload a clear profile image to improve trust and conversions.'}
        </p>
      </div>
    </div>
  );
}
