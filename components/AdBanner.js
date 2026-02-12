'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner({ type = 'inline', className = '' }) {
    const adRef = useRef(null);

    useEffect(() => {
        // When AdSense is approved, uncomment the following:
        // try {
        //   (window.adsbygoogle = window.adsbygoogle || []).push({});
        // } catch (e) {
        //   console.error('AdSense error:', e);
        // }
    }, []);

    const typeClass = {
        inline: 'ad-banner-inline',
        sidebar: 'ad-banner-sidebar',
        large: 'ad-banner-large',
    }[type] || 'ad-banner-inline';

    return (
        <div className={`ad-banner ${typeClass} ${className}`} ref={adRef}>
            <div className="ad-banner-label">Advertisement</div>
            <div className="ad-banner-placeholder">
                {/* Replace with actual AdSense code after approval */}
                {/* 
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        */}
                <p style={{ fontSize: '0.8rem', color: '#999' }}>
                    🍳 Ad Space — 광고 영역
                </p>
            </div>
        </div>
    );
}
