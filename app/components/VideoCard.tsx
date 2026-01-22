import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayCircleIcon } from '@heroicons/react/24/outline';

interface RecommendationCardProps {
    title: string;
    subtitle: string;
    image: string;
    videoUrl?: string;
    videoId?: string;
}

export default function VideoCard({ title, subtitle, image, videoUrl, videoId }: RecommendationCardProps) {
    const { t } = useTranslation();
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    const openVideoModal = () => {
        setVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setVideoModalOpen(false);
    };

    return (
        <>
            <div className="relative bg-black rounded-2xl overflow-hidden h-80 group cursor-pointer">
                <img
                    src={'https://img.youtube.com/vi/wyTfWvtGSSY/maxresdefault.jpg' || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col justify-between py-3 px-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors">
                    <div className="text-white">
                        <h3 className="font-light mb-2 text-3xl drop-shadow-lg">{title}</h3>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={openVideoModal}
                            className="bg-white/20 backdrop-blur-md text-sm w-32 relative text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                        >
                            <PlayCircleIcon className="size-4 absolute left-1 top-1/2 -translate-y-1/2" />  {t('home.recommendations.watchVideo')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {videoModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeVideoModal} />

                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-4xl bg-black rounded-2xl shadow-xl">
                            {/* Header */}
                            {/* <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <button
                                    onClick={closeVideoModal}
                                    className="text-gray-400 hover transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div> */}

                            {/* Video Content */}
                            <div className="">
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe className="absolute top-0 left-0 w-full h-full" src={ /*videoUrl || */ "https://www.youtube.com/embed/wyTfWvtGSSY?si=A8pZ_Bisr8_CUSlK&autoplay=1"} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 