import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { RefreshCw, Sparkles, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  'Art',
  'Painting',
  'Drawing',
  'HomeUse',
  'WoodCraft',
  'Photography',
  'Home Decor',
  'Jewelry',
  'Fashion',
  'Collectibles',
];

interface CreatePageProps {
  busyAction: string | null;
  onList: (title: string, category: string, price: string) => void;
  onMint?: (productId: string, certificate: string, imageUri?: string) => void;
  onMintNFTProduct?: (
    title: string,
    category: string,
    price: string,
    certificate: string,
    imageUri?: string,
  ) => void;
}

export function CreatePage({ busyAction, onList, onMintNFTProduct }: CreatePageProps) {
  const busy = busyAction !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [certificate, setCertificate] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageClick = () => {
    if (!busy && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitMintNFT = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !price) {
      alert('Please fill in Title, Category, and Price');
      return;
    }

    if (onMintNFTProduct) {
      onMintNFTProduct(title, category, price, certificate, imagePreview ?? undefined);
    } else {
      onList(title, category, price);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Sparkles className="text-purple-600" size={28} />
          Mint Handmade Product NFT
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Upload your product image, set details, and click <span className="font-semibold text-purple-700">Mint NFT</span>.
          Your Lace Midnight wallet will open to generate a zero-knowledge proof &amp; sign permission on-chain.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-purple-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShieldCheck size={24} className="text-purple-600" />
          Mint &amp; List Handmade NFT
        </h2>

        <form onSubmit={submitMintNFT} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File Explorer Image Dropzone */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={busy}
            />

            <div
              onClick={handleImageClick}
              className={`relative group border-2 border-dashed rounded-2xl p-4 text-center min-h-[260px] flex flex-col justify-center items-center cursor-pointer transition-all ${
                imagePreview
                  ? 'border-purple-500 bg-purple-50/30'
                  : 'border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-pink-50/50 hover:bg-purple-50'
              }`}
            >
              {imagePreview ? (
                <div className="w-full h-full flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="NFT Preview"
                    className="max-h-56 w-full object-contain rounded-xl shadow-md mb-2"
                  />
                  <span className="text-xs text-purple-700 bg-purple-100 font-semibold px-3 py-1 rounded-full group-hover:bg-purple-200 transition-colors">
                    Click to change image
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="text-purple-600" size={32} />
                  </div>
                  <p className="text-gray-800 font-bold text-base mb-1">Product listing image</p>
                  <p className="text-xs text-purple-600 font-medium">
                    Click to choose image for NFT minting
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Supports PNG, JPG, WEBP · Midnight stores image &amp; details on-chain &amp; locally
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Wooden Vase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={busy}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 bg-white disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (tNIGHT) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={busy}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 bg-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={busy}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900 disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beautiful handcrafted wooden item created with premium materials"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  disabled={busy}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 bg-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-sm text-purple-800">
                <CheckCircle2 size={16} className="text-purple-600" />
                What happens when you click &quot;Mint NFT&quot;:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-purple-700">
                <li>Your Lace Midnight wallet opens for permission &amp; signing</li>
                <li>Generates zero-knowledge proof for product title, price, category &amp; seller</li>
                <li>Mints a ZK authenticity NFT with a private 32-byte secret stored in your browser</li>
                <li>Your NFT displays on the Marketplace and Dashboard for buyers to purchase with tNIGHT</li>
              </ol>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center"
              style={{ background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))' }}
            >
              {busyAction === 'mintNFTProduct' || busyAction === 'listProduct' ? (
                <>
                  <RefreshCw size={22} className="mr-2 animate-spin" />
                  Connecting Lace Wallet &amp; Minting NFT…
                </>
              ) : (
                'Mint NFT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}