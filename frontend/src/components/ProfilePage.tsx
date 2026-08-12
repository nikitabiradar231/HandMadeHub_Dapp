import { useMemo, useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Camera, Database, Edit3, ExternalLink, LogOut, ShieldCheck, ShoppingBag, Trash2, User, X, CheckCircle2 } from 'lucide-react';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

import type { NftView, ProductView } from '../midnight/useMarketplace';
import { loadSecret } from '../midnight/secrets';
import { sameSeller } from '../utils/seller';
import { getProductImage } from '../utils/imageStore';

interface ProfilePageProps {
  address: string;
  networkId: string;
  products: ProductView[];
  nfts: NftView[];
  busyAction: string | null;
  hasSecret: (tokenId: bigint) => boolean;
  onWithdraw?: (productId: string) => void;
  onVerify: (tokenIdRaw: string, secretHex?: string) => void;
  onDisconnect: () => void;
}

const PROFILE_PHOTO_KEY = 'hmh_profile_photo_v1';
const PROFILE_NAME_KEY = 'hmh_profile_name_v1';
const PROFILE_BIO_KEY = 'hmh_profile_bio_v1';

function shortAddress(address: string): string {
  if (address.length <= 20) return address;
  return `${address.slice(0, 12)}…${address.slice(-8)}`;
}

interface NftCardProps {
  nft: NftView;
  busy: boolean;
  busyAction: string | null;
  hasSecret: (tokenId: bigint) => boolean;
  onVerify: (tokenIdRaw: string, secretHex?: string) => void;
}

function NftCard({ nft, busy, busyAction, hasSecret, onVerify }: NftCardProps) {
  const storedSecret = hasSecret(nft.tokenId) ? toHex(loadSecret(nft.tokenId)!) : '';
  const [secretValue, setSecretValue] = useState(storedSecret);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">NFT #{nft.tokenId.toString()}</h4>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            nft.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {nft.verified ? 'verified' : 'unverified'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">Attached to Product #{nft.productId.toString()}</p>
      <p className="text-sm text-gray-700 italic mb-3 line-clamp-2" title={nft.certificate}>
        “{nft.certificate}”
      </p>
      <div className="space-y-2">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 bg-white"
          placeholder={storedSecret ? 'Secret stored in this browser' : 'Secret (hex)'}
          value={secretValue}
          onChange={(e) => setSecretValue(e.target.value)}
        />
        <button
          onClick={() => onVerify(nft.tokenId.toString(), secretValue.trim() || undefined)}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg py-2 transition-colors disabled:opacity-50"
        >
          {busyAction === 'verifyNft' ? 'Verifying…' : 'Verify Authenticity'}
        </button>

        <a
          href="https://explorer.preview.midnight.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg py-2 transition-colors"
        >
          <ExternalLink size={14} />
          View on Midnight Explorer
        </a>
      </div>
    </div>
  );
}

export function ProfilePage({
  address,
  networkId,
  products,
  nfts,
  busyAction,
  hasSecret,
  onWithdraw,
  onVerify,
  onDisconnect,
}: ProfilePageProps) {
  const busy = busyAction !== null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable Profile States
  const [displayName, setDisplayName] = useState('Midnight Artist');
  const [bio, setBio] = useState('Handmade crafts & ZK authenticity proof creator on Midnight Network');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State inside modal
  const [editName, setEditName] = useState(displayName);
  const [editBio, setEditBio] = useState(bio);
  const [editPhoto, setEditPhoto] = useState<string | null>(profilePhoto);

  // Load stored profile
  useEffect(() => {
    try {
      const storedName = localStorage.getItem(PROFILE_NAME_KEY);
      const storedBio = localStorage.getItem(PROFILE_BIO_KEY);
      const storedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);

      if (storedName) {
        setDisplayName(storedName);
        setEditName(storedName);
      }
      if (storedBio) {
        setBio(storedBio);
        setEditBio(storedBio);
      }
      if (storedPhoto) {
        setProfilePhoto(storedPhoto);
        setEditPhoto(storedPhoto);
      }
    } catch (_) {}
  }, []);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayName(editName.trim() || 'Midnight Artist');
    setBio(editBio.trim());
    setProfilePhoto(editPhoto);

    try {
      localStorage.setItem(PROFILE_NAME_KEY, editName.trim() || 'Midnight Artist');
      localStorage.setItem(PROFILE_BIO_KEY, editBio.trim());
      if (editPhoto) {
        localStorage.setItem(PROFILE_PHOTO_KEY, editPhoto);
      } else {
        localStorage.removeItem(PROFILE_PHOTO_KEY);
      }
    } catch (_) {}

    setIsEditing(false);
  };

  const myActiveListings = useMemo(() => {
    return products.filter((p) => p.status === 0 && sameSeller(p.seller, address, networkId));
  }, [products, address, networkId]);

  const mySoldListings = useMemo(() => {
    return products.filter((p) => p.status === 1 && sameSeller(p.seller, address, networkId));
  }, [products, address, networkId]);

  const myNfts = useMemo(() => {
    return nfts.filter((n) => sameSeller(n.artist, address, networkId));
  }, [nfts, address, networkId]);

  const verifiedCount = useMemo(() => myNfts.filter((n) => n.verified).length, [myNfts]);

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto">
      {/* Profile Header Banner */}
      <div
        className="rounded-2xl p-6 md:p-8 mb-8 shadow-md border border-purple-100 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #f3e8ff, #fce7f3, #fff7ed)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Profile Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md transition-transform transform hover:scale-110"
                title="Edit profile & photo"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Profile Information */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                  {networkId} Connected
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 max-w-xl line-clamp-2">{bio}</p>
              <p className="text-xs font-mono text-gray-500 mt-2 bg-white/60 px-3 py-1 rounded-lg inline-block border border-gray-200">
                {shortAddress(address)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-purple-50 text-purple-700 font-semibold text-sm rounded-xl shadow-sm border border-purple-200 transition-all shrink-0"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit3 className="text-purple-600" size={22} />
                Edit Artist Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo Selector */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-purple-300 overflow-hidden mb-2 bg-gray-100 flex items-center justify-center">
                  {editPhoto ? (
                    <img src={editPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-gray-400" size={36} />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Upload Photo
                  </button>
                  {editPhoto && (
                    <button
                      type="button"
                      onClick={() => setEditPhoto(null)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Nikita Biradar"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Artist Description</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell buyers about your handmade crafts..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl p-4 bg-purple-50 border border-purple-100">
          <p className="text-sm text-gray-600 mb-1">Active Listings</p>
          <p className="text-3xl font-bold text-purple-700">{myActiveListings.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Products Sold</p>
          <p className="text-3xl font-bold text-blue-700">{mySoldListings.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-rose-50 border border-rose-100">
          <p className="text-sm text-gray-600 mb-1">NFTs Minted</p>
          <p className="text-3xl font-bold text-rose-600">{myNfts.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-100">
          <p className="text-sm text-gray-600 mb-1">Verified NFTs</p>
          <p className="text-3xl font-bold text-emerald-600">{verifiedCount}</p>
        </div>
      </div>

      {/* Your Active Product Listings (With Removal & Management) */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={22} className="text-purple-600" />
            Your Active Listings &amp; Management
          </h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
            {myActiveListings.length} Listed
          </span>
        </div>

        {myActiveListings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <ShoppingBag className="mx-auto mb-3 text-gray-300" size={54} />
            <p className="font-semibold">No active listings</p>
            <p className="text-xs text-gray-400 mt-1">Create a listing on the Create tab to list your handmade goods.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myActiveListings.map((p) => {
              const pImg = getProductImage(
                p.id,
                p.nftTokenId.is_some ? p.nftTokenId.value : null,
                p.title,
              );
              return (
                <div key={p.id.toString()} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                  <div>
                    <div className="w-full h-36 bg-gray-200 rounded-lg overflow-hidden mb-3">
                      {pImg ? (
                        <img src={pImg} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800 text-base">{p.title}</h4>
                      <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                        {p.price.toLocaleString()} tNIGHT
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Category: {p.category}</p>
                    {p.nftTokenId.is_some && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-3">
                        <CheckCircle2 size={12} /> NFT #{p.nftTokenId.value.toString()} Attached
                      </span>
                    )}
                  </div>

                  {onWithdraw && (
                    <button
                      onClick={() => onWithdraw(p.id.toString())}
                      disabled={busy}
                      className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg py-2 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Withdraw / Remove Listing
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Your Authenticity NFTs & Midnight Explorer */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck size={22} className="text-purple-600" />
            Your Authenticity NFTs &amp; Midnight Explorer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-semibold">
              {myNfts.length} Minted
            </span>
            <a
              href="https://explorer.preview.midnight.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <ExternalLink size={14} />
              Midnight Explorer ↗
            </a>
          </div>
        </div>

        {myNfts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-6">
            <ShieldCheck className="mx-auto mb-3 text-purple-400" size={54} />
            <p className="font-semibold text-gray-800 text-base">No authenticity NFTs minted yet</p>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto mb-4">
              When you mint an NFT on the Create tab, its zero-knowledge proof and transactions are posted live to the Midnight Network.
            </p>
            <a
              href="https://explorer.preview.midnight.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold rounded-xl transition-colors"
            >
              <ExternalLink size={15} />
              Inspect Midnight Block Explorer
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myNfts.map((nft) => (
              <NftCard
                key={nft.tokenId.toString()}
                nft={nft}
                busy={busy}
                busyAction={busyAction}
                hasSecret={hasSecret}
                onVerify={onVerify}
              />
            ))}
          </div>
        )}
      </div>

      {/* Wallet Connection Details & Disconnect */}
      <div className="space-y-4">
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-3">
          <Database size={20} className="text-purple-600 shrink-0" />
          <p className="text-xs text-gray-600">
            Profile details, images, and ZK secret keys are saved locally and bound to your Midnight wallet address.
          </p>
        </div>

        <button
          onClick={onDisconnect}
          className="w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl p-4 flex items-center justify-center text-rose-600 font-bold transition-colors shadow-sm"
        >
          <LogOut size={20} className="mr-2" />
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}