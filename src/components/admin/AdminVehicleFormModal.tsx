import React, { useState, useEffect, useRef } from 'react';
import { Vehicle } from '../../types';
import { insertVehicle, updateVehicle, uploadVehiclePhoto } from '../../lib/supabase';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Car,
  DollarSign,
  FileText,
  Star,
} from 'lucide-react';

interface AdminVehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedVehicle: Vehicle) => void;
  editingVehicle?: Vehicle | null;
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
  const [mileage, setMileage] = useState('');
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

  // UI States
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingVehicle) {
      setMake(editingVehicle.make || '');
      setModel(editingVehicle.model || '');
      setYear(editingVehicle.year ? String(editingVehicle.year) : '');
      setMileage(editingVehicle.mileage ? String(editingVehicle.mileage) : '');
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
      setMileage('');
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
      setErrorMessage(null);
    }
  }, [editingVehicle, isOpen]);

  if (!isOpen) return null;

  // Multiple File Upload Handler for Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];
    const uploadErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadVehiclePhoto(file);
      if (res.url) {
        uploadedUrls.push(res.url);
      } else if (res.error) {
        uploadErrors.push(`${file.name}: ${res.error}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setPhotos((prev) => [...prev, ...uploadedUrls]);
    }

    if (uploadErrors.length > 0) {
      setErrorMessage(
        `Some photos could not be uploaded to storage: ${uploadErrors.join('; ')}`
      );
    }

    setUploadingPhotos(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add photo via manual URL
  const handleAddManualPhotoUrl = () => {
    const trimmed = manualPhotoUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http')) {
      setErrorMessage('Please enter a valid photo URL starting with http:// or https://');
      return;
    }
    setPhotos((prev) => [...prev, trimmed]);
    setManualPhotoUrl('');
    setErrorMessage(null);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submit (Insert or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!make.trim()) {
      setErrorMessage('Make is required.');
      return;
    }
    if (!model.trim()) {
      setErrorMessage('Model is required.');
      return;
    }
    const numYear = parseInt(year, 10);
    if (isNaN(numYear) || numYear < 1980 || numYear > new Date().getFullYear() + 2) {
      setErrorMessage('Please enter a valid 4-digit manufacturing year.');
      return;
    }
    if (!mileage.trim()) {
      setErrorMessage('Mileage is required.');
      return;
    }
    const numPrice = parseFloat(price.replace(/,/g, ''));
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage('Please enter a valid vehicle price.');
      return;
    }

    let numDiscountPrice: number | null = null;
    if (discountPrice.trim()) {
      numDiscountPrice = parseFloat(discountPrice.replace(/,/g, ''));
      if (isNaN(numDiscountPrice) || numDiscountPrice <= 0) {
        setErrorMessage('Discount price must be a valid positive number.');
        return;
      }
    }

    setSubmitting(true);

    const vehiclePayload = {
      make: make.trim(),
      model: model.trim(),
      year: numYear,
      mileage: mileage.trim(),
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

    if (isEditMode && editingVehicle) {
      const res = await updateVehicle(editingVehicle.id, vehiclePayload);
      setSubmitting(false);
      if (res.success && res.data) {
        onSuccess(res.data);
      } else {
        setErrorMessage(res.error || 'Failed to update vehicle.');
      }
    } else {
      const res = await insertVehicle(vehiclePayload);
      setSubmitting(false);
      if (res.success && res.data) {
        onSuccess(res.data);
      } else {
        setErrorMessage(res.error || 'Failed to add vehicle to database.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111111] border border-white/15 my-8 shadow-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e24b4a]/10 border border-[#e24b4a]/30 flex items-center justify-center text-[#e24b4a]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider font-heading">
                {isEditMode ? `Edit Vehicle: ${editingVehicle?.make} ${editingVehicle?.model}` : 'Add New Vehicle'}
              </h2>
              <p className="text-xs text-white/50 font-mono">
                {isEditMode ? 'Update vehicle specs, pricing and media' : 'Create new stock record in Supabase inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-6 p-4 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#e24b4a] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-white font-bold mb-0.5">Database Error</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Basic Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a] mb-4 flex items-center gap-2">
              <Car className="w-4 h-4" />
              <span>1. Vehicle Identification & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Mileage */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/70 mb-1.5">
                  Mileage <span className="text-[#e24b4a]">*</span>
                </label>
                <input
                  id="admin-form-mileage"
                  type="text"
                  required
                  placeholder="e.g. 58,000 km"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
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
              <label htmlFor="admin-form-featured" className="text-xs text-white/90 cursor-pointer select-none flex items-center gap-2">
                <Star className={`w-4 h-4 ${isFeatured ? 'text-amber-400 fill-amber-400' : 'text-white/40'}`} />
                <span className="font-bold">Feature on Homepage Banner & Top Showroom Carousel</span>
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
              rows={4}
              placeholder="e.g. Pearl White metallic finish, 2.8L Turbo Diesel, 7-seater beige leather interior, Sunroof, 360-degree cameras, Modellista aero kit, lane assist, heated seats..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 p-3.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a] leading-relaxed"
            />
          </div>

          {/* Section 4: Multiple Photos & Supabase Storage */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-[#e24b4a] mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>4. Vehicle Photos & Gallery ({photos.length} photos)</span>
              </div>
              <span className="text-[11px] font-normal text-white/40">
                Supabase Storage / Public CDN
              </span>
            </h3>

            {/* Storage Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* File Upload to Supabase */}
              <div className="border border-dashed border-white/20 p-5 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="admin-photo-upload"
                />
                <label
                  htmlFor="admin-photo-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#e24b4a]">
                    {uploadingPhotos ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {uploadingPhotos ? 'Uploading Photos...' : 'Upload Photos to Supabase Storage'}
                    </span>
                    <span className="text-[10px] text-white/40 block mt-0.5">
                      Select multiple images (.jpg, .png, .webp)
                    </span>
                  </div>
                </label>
              </div>

              {/* Direct URL Add Option */}
              <div className="border border-white/10 p-4 bg-[#0a0a0a] flex flex-col justify-center space-y-2">
                <label className="text-[11px] font-mono text-white/70 uppercase">
                  Or Paste External Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={manualPhotoUrl}
                    onChange={(e) => setManualPhotoUrl(e.target.value)}
                    className="flex-1 bg-[#111111] border border-white/10 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e24b4a]"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualPhotoUrl}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Thumbnails Preview List */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-[4/3] bg-black border border-white/15 overflow-hidden"
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
                    <span className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.5 text-[9px] font-mono text-white/70">
                      #{idx + 1} {idx === 0 && 'Cover'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-black/30 border border-white/5 text-center text-xs text-white/40">
                No photos added yet. Upload files or paste URLs to show in the vehicle gallery.
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 transition-colors cursor-pointer"
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
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Vehicle' : 'Publish to Showroom'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
