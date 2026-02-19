import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConversationList from '~/components/chat/ConversationList';
import Chat from '~/components/chat/Chat';
import type { Conversation } from './types';

export const MessagesSection = ({
  initialRequestId,
  onAutoSelectCleared,
}: {
  initialRequestId?: number | null;
  onAutoSelectCleared: () => void;
}) => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Clear the auto-select request ID after component mounts
  useEffect(() => {
    if (initialRequestId) {
      // Clear it after a short delay to ensure ConversationList has processed it
      const timer = setTimeout(() => {
        onAutoSelectCleared();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialRequestId, onAutoSelectCleared]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 border-b md md border-gray-200 max-h-[300px] md:max-h-none">
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
            initialRequestId={initialRequestId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <Chat
              requestId={selectedConversation.requestId}
              otherUser={selectedConversation.otherUser}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">{t('profile.messages.selectConversation')}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {t('profile.messages.selectConversationDesc')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
