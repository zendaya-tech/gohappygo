import { useEffect, useState } from 'react';
import { sendMessage, type SendMessageDto } from '~/services/messageService';

export default function MessageDialog({
  open,
  onClose,
  title,
  hostName,
  hostAvatar,
  requestId,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  hostName: string;
  hostAvatar: string;
  requestId?: number;
  onSend?: (message: string) => void;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setMessage('');
    setError(null);
  }, [open]);

  if (!open) return null;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    setError(null);

    try {
      if (requestId) {
        // Use API to send message
        const dto: SendMessageDto = {
          requestId,
          content: message.trim(),
        };
        await sendMessage(dto);
      }

      // Call the callback if provided
      onSend?.(message.trim());
      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error?.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Message Form */}
          <div className="flex-1 p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <img
                src={hostAvatar}
                alt={hostName}
                className="h-12 w-12 rounded-full object-cover shadow-sm"
              />
              <div>
                <div className="text-lg font-bold text-gray-900 leading-tight">{title}</div>
                <div className="text-sm text-gray-500">{hostName}</div>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message here ..."
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus"
              disabled={sending}
            />

            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="mt-6 w-full rounded-lg bg-[#2d6a74] py-3 text-white font-semibold hover:bg-[#25575f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {sending ? 'Envoi...' : 'Send message'}
            </button>
          </div>

          {/* Right Column: Safety Information */}
          <div className="relative w-full md:w-[380px] bg-white p-6 md:p-8 md border-gray-100">
            {/* Close Button positioned in the right panel as per image */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mt-2 flex flex-col gap-6">
              {/* Warning Icon */}
              <div className="text-red-500">
                <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* French Safety Text */}
              <div className="space-y-6 text-[15px] leading-relaxed text-gray-800 font-semibold">
                <p>
                  Pour garantir votre sécurité, restez toujours sur{' '}
                  <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    GoHappyGo
                  </span>{' '}
                  jusqu'au bout de votre voyage.
                </p>
                <p>
                  Pour éviter les arnaques, ne cliquez jamais sur des liens de paiement ou de
                  virement partagés par d'autres membres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
