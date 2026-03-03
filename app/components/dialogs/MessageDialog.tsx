import { useEffect, useState } from 'react';
import { sendMessage, type SendMessageDto } from '~/services/messageService';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
  const { t } = useTranslation();
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
      setError(error?.response?.data?.message || t('dialogs.message.error'));
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
              placeholder={t('dialogs.message.placeholder')}
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
              {sending ? t('dialogs.message.sending') : t('dialogs.message.send')}
            </button>
          </div>

          {/* Right Column: Safety Information */}
          <div className="relative w-full md:w-[380px] bg-white p-6 md:p-8 md border-gray-100">
            {/* Close Button positioned in the right panel as per image */}
            <button
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute top-4 right-4 text-gray-400 hover transition-colors cursor-pointer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="mt-2 flex flex-col gap-6">
              {/* Warning Icon */}
              <div className="text-red-500">
                <ExclamationTriangleIcon className="h-9 w-9" />
              </div>

              {/* Safety Text */}
              <div className="space-y-6 text-[15px] leading-relaxed text-gray-800 font-semibold">
                <p>
                  {t('dialogs.message.safety.stayOnPlatform').split('GoHappyGo')[0]}
                  <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    GoHappyGo
                  </span>
                  {t('dialogs.message.safety.stayOnPlatform').split('GoHappyGo')[1]}
                </p>
                <p>{t('dialogs.message.safety.avoidScams')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
