'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner({ type = 'inline', className = '' }) {
    const adRef = useRef(null);
    const adInitialized = useRef(false);

    useEffect(() => {
        if (adInitialized.current) return;
        adInitialized.current = true;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    const typeClass = {
        inline: 'ad-banner-inline',
        sidebar: 'ad-banner-sidebar',
        large: 'ad-banner-large',
    }[type] || 'ad-banner-inline';

    const formatMap = {
        inline: 'auto',
        sidebar: 'auto',
        large: 'auto',
    };

    return (
        <div className={`ad-banner ${typeClass} ${className}`}>
            <div className="ad-banner-label">Advertisement</div>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3053267422296088"
                data-ad-slot="auto"
                data-ad-format={formatMap[type]}
                data-full-width-responsive="true"
                ref={adRef}
            />
        </div>
    );
}
