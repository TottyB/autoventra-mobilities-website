import React, { useState, useEffect, useRef } from 'react';
import { Vehicle } from '../../types';
import { insertVehicle, updateVehicle, uploadVehiclePhoto } from '../../lib/supabase';
import { compressImage, formatBytes } from '../../lib/imageCompression';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Car,
  DollarSign,
  FileText,
  Star,
  RefreshCw,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface AdminVehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedVehicle: Vehicle) => void;
  editingVehicle?: Vehicle | null;
}

interface UploadProgressState {
  current: number;
  total: number;
  percent: number;
  fileName: string;
  stage: 'compressing' | 'uploading';
  compressionNote?: string;
}

interface FailedPhotoItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  error: string;
  errorCode?: string;
  isRetrying?: boolean;
}

interface ErrorDetails {
  title: string;
  message: string;
  hint?: string;
  code?: string;
}

export const AdminVehicleFormModal: React.FC<AdminVehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingVehicle,
}) => {
  const isEditMode = Boolean(editingVehicle);

  // Form Fields - strictly empty for new vehicles without pre-filled sample values
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Petrol');
  const [bodyType, setBodyType] = useState('SUV');
  const [condition, setCondition] = useState('Foreign Used');
  const [price, setPrice] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [status, setStatus] = useState<'available' | 'sold' | 'reserved'>('available');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Manual URL entry
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');

  // UI & Upload States
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<FailedPhotoItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingVehicle) {
      setMake(editingVehicle.make || '');
      setModel(editingVehicle.model || '');
      setYear(editingVehicle.year ? String(editingVehicle.year) : '');
      setTransmission(editingVehicle.transmission || 'Automatic');
      setFuelType(editingVehicle.fuel_type || 'Petrol');
      setBodyType(editingVehicle.body_type || 'SUV');
      setCondition(editingVehicle.condition || 'Foreign Used');
      setPrice(editingVehicle.price ? String(editingVehicle.price) : '');
      setDiscountPrice(
        editingVehicle.discount_price ? String(editingVehicle.discount_price) : ''
      );
      setStatus(editingVehicle.status || 'available');
      setIsFeatured(Boolean(editingVehicle.is_featured));
      setDescription(editingVehicle.description || '');
      setPhotos(Array.isArray(editingVehicle.photos) ? [...editingVehicle.photos] : []);
    } else {
      // Reset to completely empty values when opening "Add New Vehicle"
      setMake('');
      setModel('');
      setYear('');
      setTransmission('Automatic');
      setFuelType('Petrol');
      setBodyType('SUV');
      setCondition('Foreign Used');
      setPrice('');
      setDiscountPrice('');
      setStatus('available');
      setIsFeatured(false);
      setDescription('');
      setPhotos([]);
      setManualPhotoUrl('');
    }
    setFailedPhotos([]);
    setErrorDetails(null);
    setUploadProgress(null);
    setUploadingPhotos(false);
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  /**
   * Process and upload a list of files sequentially with client-side compression
   * and per-photo granular progress and error isolation.
   */
  const processAndUploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;

    // Filter for image files
    const validImageFiles = files.filter((f) =>
      f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif)$/i.test(f.name)
    );

    if (validImageFiles.length === 0) {
      setErrorDetails({
        title: 'Invalid File Format',
        message: 'Please select valid image files (.jpg, .jpeg, .png, .webp).',
      });
      return;
    }

    setUploadingPhotos(true);
    setErrorDetails(null);

    const total = validImageFiles.length;
    const newFailedItems: FailedPhotoItem[] = [];

    for (let i = 0; i < total; i++) {
      const file = validImageFiles[i];
      const itemNumber = i + 1;

      // 1. Progress: Compressing stage
      setUploadProgress({
        current: itemNumber,
        total,
        percent: Math.round(((itemNumber - 1) / total) * 100),
        fileName: file.name,
        stage: 'compressing',
        compressionNote: `Original size: ${formatBytes(file.size)}`,
      });

      // 2. Client-side browser compression (max 1600px, 0.82 quality, canvas-based)
      let fileToUpload = file;
      let compSize = file.size;
      try {
        const compResult = await compressImage(file, 1600, 1600, 0.82);
        fileToUpload = compResult.file;
        compSize = compResult.compressedSize;

        // 3. Progress: Uploading stage
        setUploadProgress({
          current: itemNumber,
          total,
          percent: Math.round(((itemNumber - 0.5) / total) * 100),
          fileName: file.name,
          stage: 'uploading',
          compressionNote: `Compressed: ${formatBytes(file.size)} → ${formatBytes(compSize)} (-${compResult.reductionPercentage}%)`,
        });
      } catch (compErr) {
        console.warn('Compression skipped due to error, proceeding with original file:', compErr);
      }

      // 4. Upload to Supabase Storage
      const res = await uploadVehiclePhoto(fileToUpload);

      if (res.url) {
        // Immediate addition so progress is never lost
        setPhotos((prev) => [...prev, res.url!]);
      } else {
        // Isolate failure
        const failedItem: FailedPhotoItem = {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          originalSize: file.size,
          compressedSize: compSize,
          error: res.error || 'Failed to upload photo to Supabase Storage.',
          errorCode: res.errorCode,
        };
        newFailedItems.push(failedItem);
      }
    }

    // Set overall progress to 100%
    setUploadProgress({
      current: total,
      total,
      percent: 100,
      fileName: 'Completed',
      stage: 'uploading',
    });

    setTimeout(() => {
      setUploadProgress(null);
      setUploadingPhotos(false);
    }, 400);

    if (newFailedItems.length > 0) {
      setFailedPhotos((prev) => [...prev, ...newFailedItems]);

      const firstError = newFailedItems[0];
      if (firstError.errorCode === 'BUCKET_NOT_FOUND') {
        setErrorDetails({
          title: "Supabase Storage Bucket 'vehicle-photos' Missing",
          message:
            "The 'vehicle-photos' storage bucket does not exist in your Supabase project. Create a public bucket named 'vehicle-photos' in Supabase Storage or run the SQL setup script in the Database Schema tab.",
          hint: "Go to Supabase Dashboard → Storage → 'New bucket' → Name: vehicle-photos (check 'Public bucket').",
          code: 'BUCKET_NOT_FOUND',
        });
      } else if (firstError.errorCode === 'STORAGE_RLS_REJECTED') {
        setErrorDetails({
          title: 'Storage Permission (RLS) Denied',
          message:
            "Supabase Storage rejected the upload because of Row-Level Security policies on 'storage.objects', or your admin session expired.",
          hint: "Ensure you are signed in at /av-manage and that your Supabase Storage policies allow authenticated INSERT on 'vehicle-photos'.",
          code: 'STORAGE_RLS_REJECTED',
        });
      } else if (firstError.errorCode === 'UNAUTHENTICATED') {
        setErrorDetails({
          title: 'Admin Session Required',
          message: 'Your admin session is expired. Please re-login to upload photos.',
          hint: 'Open /av-manage in another tab or log in again to refresh your auth token.',
          code: 'UNAUTHENTICATED',
        });
      } else {
        setErrorDetails({
          title: 'Photo Upload Failed',
          message: `${newFailedItems.length} of ${total} photos could not be uploaded: ${firstError.error}`,
          hint: 'You can retry uploading the failed photo(s) using the Retry button below.',
          code: firstError.errorCode,
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processAndUploadFiles(Array.from(files));
  };

  /**
   * Retry uploading a single previously failed photo
   */
  const handleRetryPhoto = async (item: FailedPhotoItem) => {
    // Mark item as retrying
    setFailedPhotos((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, isRetrying: true } : f))
    );

    try {
      // Compress
      const compResult = await compressImage(item.file, 1600, 1600, 0.82);
      const res = await uploadVehiclePhoto(compResult.file);

      if (res.url) {
        // Add photo and remove from failed list
        setPhotos((prev) => [...prev, res.url!]);
        setFailedPhotos((prev) => prev.filter((f) => f.id !== item.id));
        if (failedPhotos.length <= 1) {
          setErrorDetails(null);
        }
      } else {
        // Update error message
        setFailedPhotos((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  isRetrying: false,
                  error: res.error || 'Retry upload failed.',
                  errorCode: res.errorCode,
                }
              : f
          )
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Retry failed';
      setFailedPhotos((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, isRetrying: false, error: msg } : f))
      );
    }
  };

  const handleDismissFailedPhoto = (id: string) => {
    setFailedPhotos((prev) => prev.filter((f) => f.id !== id));
    if (failedPhotos.length <= 1) {
      setErrorDetails(null);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Add photo via manual URL
  const handleAddManualPhotoUrl = () => {
    const trimmed = manualPhotoUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      setErrorDetails({
        title: 'Invalid URL',
        message: 'Please enter a valid photo URL starting with http:// or https://',
      });
      return;
    }
    setPhotos((prev) => [...prev, trimmed]);
    setManualPhotoUrl('');
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submit (Insert or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);

    // Validation
    if (!make.trim()) {
      setErrorDetails({ title: 'Validation Error', message: 'Vehicle Make is required.' });
      return;
    }
    if (!model.trim()) {
      setErrorDetails({ title: 'Validation Error', message: 'Vehicle Model is required.' });
      return;
    }
    const numYear = parseInt(year, 10);
    if (isNaN(numYear) || numYear < 1980 || numYear > new Date().getFullYear() + 2) {
      setErrorDetails({
        title: 'Validation Error',
        message: 'Please enter a valid 4-digit manufacturing year (e.g. 2018).',
      });
      return;
    }
    const numPrice = parseFloat(price.replace(/,/g, ''));
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorDetails({
        title: 'Validation Error',
        message: 'Please enter a valid vehicle price in KES.',
      });
      return;
    }

    let numDiscountPrice: number | null = null;
    if (discountPrice.trim()) {
      numDiscountPrice = parseFloat(discountPrice.replace(/,/g, ''));
      if (isNaN(numDiscountPrice) || numDiscountPrice <= 0) {
        setErrorDetails({
          title: 'Validation Error',
          message: 'Discount price must be a valid positive number.',
        });
        return;
      }
    }

    setSubmitting(true);

    const vehiclePayload = {
      make: make.trim(),
      model: model.trim(),
      year: numYear,
      transmission,
      fuel_type: fuelType,
      body_type: bodyType,
      condition,
      price: numPrice,
      discount_price: numDiscountPrice,
      status,
      is_featured: isFeatured,
      description: description.trim(),
      photos,
    };

    try {
      if (isEditMode && editingVehicle) {
        const res = await updateVehicle(editingVehicle.id, vehiclePayload);
        setSubmitting(false);
        if (res.success && res.data) {
          onSuccess(res.data);
        } else {
          setErrorDetails({
            title: 'Database Update Error',
            message: res.error || 'Failed to update vehicle in Supabase database.',
            hint: 'Check your database connection and verify table RLS permissions for public.vehicles.',
          });
        }
      } else {
        const res = await insertVehicle(vehiclePayload);
        setSubmitting(false);
        if (res.success && res.data) {
          onSuccess(res.data);
        } else {
          setErrorDetails({
            title: 'Database Insert Error',
            message: res.error || 'Failed to add vehicle to Supabase database.',
            hint: 'Check whether the public.vehicles table exists and allows authenticated INSERT.',
          });
        }
      }
    } catch (submitErr: unknown) {
      setSubmitting(false);
      const msg = submitErr instanceof Error ? submitErr.message : 'Unexpected database error';
      setErrorDetails({
        title: 'Database Operation Failed',
        message: msg,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111111] border border-white/15 my-1 sm:my-6 shadow-2xl text-white flex flex-col max-h-[calc(100dvh-0.5rem)] sm:max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e24b4a]/10 border border-[#e24b4a]/30 flex items-center justify-center text-[#e24b4a] flex-shrink-0">
              <Car className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider font-heading leading-tight">
                {isEditMode
                  ? `Edit Vehicle: ${editingVehicle?.make} ${editingVehicle?.model}`
                  : 'Add New Vehicle'}
              </h2>
              <p className="text-[11px] sm:text-xs text-white/50 font-mono">
                {isEditMode
                  ? 'Update vehicle specs, pricing and media gallery'
                  : 'Create new stock record in Supabase inventory & storage'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting || uploadingPhotos}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Error Notification Banner */}
        {errorDetails && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-950/70 border border-red-700 text-red-200 text-xs flex items-start justify-between gap-3 shadow-lg flex-shrink-0">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#e24b4a] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-white font-bold text-sm">
                  {errorDetails.title}
                </strong>
                <p className="text-red-200/90 leading-relaxed">{errorDetails.message}</p>
                {errorDetails.hint && (
                  <p className="text-[11px] text-amber-300 font-mono pt-1">
                    <span className="font-bold uppercase tracking-wider">How to resolve: </span>
                    {errorDetails.hint}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorDetails(null)}
              className="text-red-300 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain">
          {/* Section 1: Basic Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a] mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>1. Vehicle Identification & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Make */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Make <span className="text-[#e24b4a]">*</span>
                </label>
                <input
                  id="admin-form-make"
                  type="text"
                  required
                  placeholder="e.g. Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Model <span className="text-[#e24b4a]">*</span>
                </label>
                <input
                  id="admin-form-model"
                  type="text"
                  required
                  placeholder="e.g. Land Cruiser Prado TX"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Year <span className="text-[#e24b4a]">*</span>
                </label>
                <input
                  id="admin-form-year"
                  type="number"
                  required
                  placeholder="e.g. 2018"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Body Type
                </label>
                <select
                  id="admin-form-body-type"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Station Wagon">Station Wagon</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Van">Van</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Transmission
                </label>
                <select
                  id="admin-form-transmission"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Fuel Type
                </label>
                <select
                  id="admin-form-fuel-type"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Condition
                </label>
                <select
                  id="admin-form-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="Foreign Used">Foreign Used</option>
                  <option value="Locally Used">Locally Used</option>
                  <option value="Brand New">Brand New</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory Status */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a] mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>2. Pricing, Discount & Availability</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Regular Price */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Regular Price (KES) <span className="text-[#e24b4a]">*</span>
                </label>
                <input
                  id="admin-form-price"
                  type="number"
                  required
                  placeholder="e.g. 6800000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Discount Price (Optional) */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5 flex items-center justify-between">
                  <span>Discount Price (KES)</span>
                  <span className="text-white/40 font-normal">Optional</span>
                </label>
                <input
                  id="admin-form-discount-price"
                  type="number"
                  placeholder="e.g. 6500000"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Stock Status
                </label>
                <select
                  id="admin-form-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'available' | 'sold' | 'reserved')
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e24b4a]"
                >
                  <option value="available">Available (Active in Showroom)</option>
                  <option value="sold">Sold (Marked Out of Stock)</option>
                  <option value="reserved">Reserved (Deposit Placed)</option>
                </select>
              </div>
            </div>

            {/* Featured toggle checkbox */}
            <div className="mt-4 flex items-center gap-3 p-3 bg-white/5 border border-white/10">
              <input
                id="admin-form-featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#e24b4a] cursor-pointer"
              />
              <label
                htmlFor="admin-form-featured"
                className="text-xs text-white/90 cursor-pointer select-none flex items-center gap-2"
              >
                <Star
                  className={`w-4 h-4 ${
                    isFeatured ? 'text-amber-400 fill-amber-400' : 'text-white/40'
                  }`}
                />
                <span className="font-bold">
                  Feature on Homepage Banner & Top Showroom Carousel
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>3. Vehicle Description & Features</span>
            </h3>

            <textarea
              id="admin-form-description"
              rows={3}
              placeholder="e.g. Pearl White metallic finish, 2.8L Turbo Diesel, 7-seater beige leather interior, Sunroof, 360-degree cameras, Modellista aero kit, lane assist, heated seats..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 p-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a] leading-relaxed"
            />
          </div>

          {/* Section 4: Multiple Photos & Supabase Storage */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#e24b4a]" />
                <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a]">
                  4. Vehicle Photos & Gallery ({photos.length} uploaded)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-compressed to ~300KB
              </span>
            </div>

            {/* Live Upload Progress Card */}
            {uploadProgress && (
              <div className="p-4 bg-[#141d26] border border-blue-500/40 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="font-bold text-white uppercase tracking-wider">
                      {uploadProgress.stage === 'compressing'
                        ? `Compressing Photo ${uploadProgress.current} of ${uploadProgress.total}...`
                        : `Uploading Photo ${uploadProgress.current} of ${uploadProgress.total} to Supabase Storage...`}
                    </span>
                  </div>
                  <span className="font-mono text-blue-300 font-bold">
                    {uploadProgress.percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/60 h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-[#e24b4a] h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                  <span className="truncate max-w-[70%]">{uploadProgress.fileName}</span>
                  {uploadProgress.compressionNote && (
                    <span className="text-emerald-400">{uploadProgress.compressionNote}</span>
                  )}
                </div>
              </div>
            )}

            {/* Isolated Failed Photos & Retry Section */}
            {failedPhotos.length > 0 && (
              <div className="p-4 bg-amber-950/40 border border-amber-600/60 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>
                      {failedPhotos.length} Photo{failedPhotos.length > 1 ? 's' : ''} Failed to
                      Upload
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50">
                    Existing {photos.length} photos remain saved
                  </span>
                </div>

                <div className="space-y-2">
                  {failedPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[10px] text-white/40 font-mono">
                            ({formatBytes(item.originalSize)})
                          </span>
                        </div>
                        <p className="text-red-300 text-[11px]">{item.error}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRetryPhoto(item)}
                          disabled={item.isRetrying || uploadingPhotos}
                          className="px-3 py-1.5 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {item.isRetrying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>Retry Upload</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDismissFailedPhoto(item.id)}
                          className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Upload Dropzone & Direct URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload to Supabase */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-[#e24b4a] bg-[#e24b4a]/10'
                    : 'border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,image/*"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="admin-photo-upload"
                  disabled={uploadingPhotos}
                />
                <label
                  htmlFor="admin-photo-upload"
                  className={`flex flex-col items-center justify-center gap-2.5 ${
                    uploadingPhotos ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#e24b4a]">
                    {uploadingPhotos ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {uploadingPhotos ? 'Uploading in progress...' : 'Upload 3-4 Vehicle Photos'}
                    </span>
                    <span className="text-[10px] text-white/50 block mt-1">
                      Drag and drop or click to select multiple photos
                    </span>
                    <span className="text-[9px] font-mono text-[#e24b4a] block mt-0.5">
                      Client-side compressed (max 1600px, 300-500KB)
                    </span>
                  </div>
                </label>
              </div>

              {/* Direct URL Add Option */}
              <div className="border border-white/10 p-5 bg-[#0a0a0a] flex flex-col justify-center space-y-2.5">
                <label className="text-[11px] font-mono text-white/70 uppercase flex items-center justify-between">
                  <span>Or Paste External Image URL</span>
                  <span className="text-white/40">CDN / Unsplash</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={manualPhotoUrl}
                    onChange={(e) => setManualPhotoUrl(e.target.value)}
                    className="flex-1 bg-[#111111] border border-white/10 px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualPhotoUrl}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                <span className="text-[10px] text-white/40">
                  Useful for external test images or stock catalog photos.
                </span>
              </div>
            </div>

            {/* Photo Thumbnails Preview Gallery */}
            {photos.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/50 font-mono">
                  <span>
                    Gallery Order: First photo is the showroom Cover Photo.
                  </span>
                  <span>{photos.length} total</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group aspect-[4/3] bg-black border overflow-hidden ${
                        idx === 0
                          ? 'border-[#e24b4a] ring-1 ring-[#e24b4a]/50'
                          : 'border-white/15'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Vehicle Photo ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span
                        className={`absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                          idx === 0
                            ? 'bg-[#e24b4a] text-white uppercase'
                            : 'bg-black/75 text-white/80'
                        }`}
                      >
                        #{idx + 1} {idx === 0 && '• COVER'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-black/30 border border-white/5 text-center text-xs text-white/40 flex flex-col items-center gap-1">
                <ImageIcon className="w-6 h-6 text-white/20" />
                <span>No photos added yet. Upload 3-4 photos to display in the vehicle showroom.</span>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-white/50 font-mono">
              {photos.length === 0 ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Photos are recommended for optimal customer engagement
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to publish {photos.length} photo{photos.length > 1 ? 's' : ''} with vehicle
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting || uploadingPhotos}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 transition-colors cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                id="admin-vehicle-save-btn"
                type="submit"
                disabled={submitting || uploadingPhotos}
                className="px-6 py-3 bg-[#e24b4a] hover:bg-[#c53736] disabled:opacity-50 text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-950/40"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : uploadingPhotos ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Photos...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEditMode ? 'Update Vehicle' : 'Publish to Showroom'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
