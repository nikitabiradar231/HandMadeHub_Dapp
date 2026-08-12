import { useMemo, useState, useEffect, useRef } from 'react';
import { MessageSquare, RefreshCw, Send, User, CheckCheck, Lock, Plus, X, Bot, Sparkles } from 'lucide-react';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';

import type { NftView, ProductView } from '../midnight/useMarketplace';

interface ArtistSummary {
  key: string;
  hex: string;
  listings: number;
  sold: number;
  nftsMinted: number;
  customName?: string;
}

interface ChatMessage {
  id: string;
  senderHex: string;
  text: string;
  timestamp: number;
  isSelf?: boolean;
}

interface CommunityPageProps {
  products: ProductView[];
  nfts: NftView[];
  onRefresh: () => void;
}

const STORAGE_MESSAGES_KEY = 'hmh_artist_chats_v1';
const STORAGE_CUSTOM_CHATS = 'hmh_custom_chats_v1';

function buildArtists(products: ProductView[], nfts: NftView[]): ArtistSummary[] {
  const artists = new Map<string, ArtistSummary>();

  const add = (bytes: Uint8Array) => {
    const hex = toHex(bytes);
    if (!artists.has(hex)) {
      artists.set(hex, { key: hex, hex, listings: 0, sold: 0, nftsMinted: 0 });
    }
    return artists.get(hex);
  };

  for (const product of products) {
    const artist = add(product.seller)!;
    if (product.status === 0) artist.listings += 1;
    if (product.status === 1) artist.sold += 1;
  }

  for (const nft of nfts) {
    const artist = add(nft.artist)!;
    artist.nftsMinted += 1;
  }

  return [...artists.values()].sort((a, b) => b.listings + b.sold + b.nftsMinted - (a.listings + a.sold + a.nftsMinted));
}

function shortHex(hex: string): string {
  if (hex.length <= 16) return hex;
  return `${hex.slice(0, 10)}…${hex.slice(-6)}`;
}

export function CommunityPage({ products, nfts, onRefresh }: CommunityPageProps) {
  const [search, setSearch] = useState('');
  const [activeArtistHex, setActiveArtistHex] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [customChannels, setCustomChannels] = useState<ArtistSummary[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatInput, setNewChatInput] = useState('');
  const [simulateReplies, setSimulateReplies] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onChainArtists = useMemo(() => buildArtists(products, nfts), [products, nfts]);

  // Combine on-chain artists with user-added custom channels
  const allChannels = useMemo(() => {
    const mergedMap = new Map<string, ArtistSummary>();
    for (const a of onChainArtists) {
      mergedMap.set(a.hex, a);
    }
    for (const c of customChannels) {
      if (!mergedMap.has(c.hex)) {
        mergedMap.set(c.hex, c);
      }
    }
    return [...mergedMap.values()];
  }, [onChainArtists, customChannels]);

  // Load chat messages and custom channels from localStorage & setup BroadcastChannel
  useEffect(() => {
    const loadStored = () => {
      try {
        const rawMsgs = localStorage.getItem(STORAGE_MESSAGES_KEY);
        if (rawMsgs) setChatMessages(JSON.parse(rawMsgs));

        const rawCustom = localStorage.getItem(STORAGE_CUSTOM_CHATS);
        if (rawCustom) setCustomChannels(JSON.parse(rawCustom));
      } catch (_) {}
    };

    loadStored();

    // Listen to localStorage changes across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_MESSAGES_KEY || e.key === STORAGE_CUSTOM_CHATS) {
        loadStored();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // BroadcastChannel for instant cross-tab real-time messaging
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('hmh_chat_channel');
      channel.onmessage = () => {
        loadStored();
      };
    } catch (_) {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  // Select first channel automatically
  useEffect(() => {
    if (!activeArtistHex && allChannels.length > 0) {
      setActiveArtistHex(allChannels[0].hex);
    }
  }, [allChannels, activeArtistHex]);

  // Scroll to bottom of chat thread when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeArtistHex]);

  const filteredChannels = useMemo(
    () =>
      allChannels.filter(
        (c) =>
          !search ||
          c.hex.toLowerCase().includes(search.toLowerCase()) ||
          (c.customName && c.customName.toLowerCase().includes(search.toLowerCase())),
      ),
    [allChannels, search],
  );

  const activeChannel = useMemo(
    () => allChannels.find((c) => c.hex === activeArtistHex) || allChannels[0],
    [allChannels, activeArtistHex],
  );

  const activeThread = useMemo(() => {
    if (!activeArtistHex) return [];
    return (
      chatMessages[activeArtistHex] || [
        {
          id: `msg-welcome-${activeArtistHex}`,
          senderHex: activeArtistHex,
          text: `Hello! 👋 Direct messaging channel initialized. Ask about products, zero-knowledge proofs, or custom orders!`,
          timestamp: Date.now() - 1800000,
          isSelf: false,
        },
      ]
    );
  }, [chatMessages, activeArtistHex]);

  const saveMessagesToStorage = (updatedMsgs: Record<string, ChatMessage[]>) => {
    setChatMessages(updatedMsgs);
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updatedMsgs));
      // Notify other tabs via BroadcastChannel
      const channel = new BroadcastChannel('hmh_chat_channel');
      channel.postMessage('update');
      channel.close();
    } catch (_) {}
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeArtistHex) return;

    const userText = inputMessage.trim();
    const now = Date.now();

    const newMsg: ChatMessage = {
      id: `msg-${now}-${Math.random().toString(36).substring(2, 6)}`,
      senderHex: 'self',
      text: userText,
      timestamp: now,
      isSelf: true,
    };

    const currentMsgs = activeThread;
    const updated = {
      ...chatMessages,
      [activeArtistHex]: [...currentMsgs, newMsg],
    };

    saveMessagesToStorage(updated);
    setInputMessage('');

    // Optional simulated artist reply for interactive demonstration
    if (simulateReplies) {
      setTimeout(() => {
        const replyText = getSimulatedReply(userText);
        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderHex: activeArtistHex,
          text: replyText,
          timestamp: Date.now(),
          isSelf: false,
        };

        const withReply = {
          ...updated,
          [activeArtistHex]: [...updated[activeArtistHex], replyMsg],
        };
        saveMessagesToStorage(withReply);
      }, 1200);
    }
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    const input = newChatInput.trim();
    if (!input) return;

    const channelHex = input.startsWith('0x') || input.length > 20 ? input : `user_${input.toLowerCase().replace(/\s+/g, '_')}`;
    const newChan: ArtistSummary = {
      key: channelHex,
      hex: channelHex,
      listings: 0,
      sold: 0,
      nftsMinted: 0,
      customName: input,
    };

    const updatedCustom = [...customChannels, newChan];
    setCustomChannels(updatedCustom);
    try {
      localStorage.setItem(STORAGE_CUSTOM_CHATS, JSON.stringify(updatedCustom));
    } catch (_) {}

    setActiveArtistHex(channelHex);
    setNewChatInput('');
    setShowNewChatModal(false);
  };

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-purple-600" size={32} />
            Messages &amp; Artist Chats
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Lock size={14} className="text-emerald-600" />
            Peer-to-peer messaging channels powered by Midnight Network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
          >
            <Plus size={18} />
            New Chat
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
            title="Refresh channels"
          >
            <RefreshCw size={20} className="text-purple-700" />
          </button>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare className="text-purple-600" size={22} />
                Start Direct Message Chat
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewChat} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Midnight Address / Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0000... or Artist Pseudonym"
                  value={newChatInput}
                  onChange={(e) => setNewChatInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  Start Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-xl border border-gray-200 min-h-[560px] overflow-hidden">
        {/* Left Sidebar: Artist Chat List */}
        <div className="lg:col-span-5 border-r border-gray-200 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {allChannels.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="font-semibold text-sm">No active chat channels</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click &quot;New Chat&quot; or list a product to start chatting!
                </p>
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No conversations match your search</div>
            ) : (
              filteredChannels.map((chan) => {
                const isSelected = activeArtistHex === chan.hex;
                const chanName = chan.customName || `Artist ${shortHex(chan.hex)}`;
                const lastMsg = (chatMessages[chan.hex] || []).slice(-1)[0];

                return (
                  <button
                    key={chan.key}
                    onClick={() => setActiveArtistHex(chan.hex)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                      isSelected ? 'bg-purple-50 border-l-4 border-purple-600' : 'hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      <User size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="font-bold text-sm text-gray-800 truncate">{chanName}</p>
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full shrink-0">
                          {chan.listings > 0 ? `${chan.listings} Listed` : 'Direct'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {lastMsg ? lastMsg.text : `${chan.nftsMinted} NFTs Minted · ${chan.sold} Sales`}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Thread View */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white">
          {activeChannel ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-purple-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">
                      {activeChannel.customName || `Artist ${shortHex(activeChannel.hex)}`}
                    </h3>
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Direct Encrypted Channel Active
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSimulateReplies(!simulateReplies)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                      simulateReplies
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                    title="Toggle auto-replies for testing"
                  >
                    <Bot size={14} />
                    {simulateReplies ? 'Auto-Reply On' : 'Auto-Reply Off'}
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px]">
                {activeThread.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        msg.isSelf
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.isSelf && <CheckCheck size={13} className="text-purple-600" />}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-3 bg-gray-50">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-gray-400">
              <Sparkles size={64} className="text-gray-300 mb-3" />
              <p className="font-semibold text-gray-600">Select or create a channel to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getSimulatedReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return 'Hello! Thanks for reaching out. How can I help you with my handmade items?';
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('tnight')) {
    return 'All prices listed on HandMadeHub are in tNIGHT tokens on Midnight testnet.';
  }
  if (lower.includes('nft') || lower.includes('authenticity') || lower.includes('zk')) {
    return 'Yes! Every product comes with a zero-knowledge authenticity NFT minted directly on Midnight Network.';
  }
  if (lower.includes('ship') || lower.includes('custom') || lower.includes('deliver')) {
    return 'I can craft custom orders and ship globally. Feel free to send over your specific requirements!';
  }
  return 'Thank you for your message! I have received it on Midnight Network and will reply shortly.';
}