'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Heart, Copy, Check, HeartHandshake, Star, Shield } from 'lucide-react';

const UPI_ID = 'yourupi@bank';

export default function DonatePage() {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);
  const [donated, setDonated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDonated = () => {
    setDonated(true);
    setTimeout(() => setDonated(false), 4000);
  }; 
  
  const handleShare = async () => {
  const shareText = t(
    "Explore Tamil Nadu election results with constituency-wise data, party trends, and live status.",
    "தமிழ்நாடு தேர்தல் முடிவுகளை தொகுதி வாரியாக, கட்சி நிலவரம் மற்றும் live தகவல்களுடன் பாருங்கள்."
  );

  if (navigator.share) {
    try {
      await navigator.share({
        title: "தமிழ்நாடு சட்டமன்ற தேர்தல் முடிவுகள் | Tamil Nadu Election results",
		text: shareText,
		url: window.location.origin,
	  });
	} catch (e) {}
  }}
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  
   useEffect(() => {
	if (showFeedback) {
	  document.body.style.overflow = "hidden";
	} else {
	  document.body.style.overflow = "auto";
	}

	return () => {
      document.body.style.overflow = "auto";
	};
  }, [showFeedback]);
  
  const submitFeedback = async () => {
	setLoading(true);
	try {
		await fetch("/api/feedback", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  message: feedback,
			  date: new Date().toISOString(),
			  lang: lang,
			  
			  referrer: document.referrer,

			  userAgent: navigator.userAgent,
              platform: navigator.platform,
              screenSize: `${window.innerWidth}x${window.innerHeight}`,

			  browserLang: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

              connection: navigator.connection?.effectiveType || "unknown",
			}),
		});

		setSubmitted(true);
	} catch (e) {
		console.error(e);
	} finally {
		setLoading(false);
	}

	setTimeout(() => {
		setShowFeedback(false);
		setSubmitted(false);
		setFeedback("");
	}, 2500);
  };

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>

        {/* LEFT — Main donate card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(234,179,8,0.15)', border: '2px solid rgba(234,179,8,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Heart size={26} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {t('Support This Project', 'இந்த திட்டத்தை ஆதரியுங்கள்')}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
              {t(
                'This is an independent election data platform built for public awareness. Your support keeps it free and updated.',
                'இது பொது விழிப்புணர்விற்காக உருவாக்கிய சுதந்திர தேர்தல் தரவு தளம். உங்கள் ஆதரவு இதை இலவசமாகவும் புதுப்பிக்கப்பட்டதாகவும் வைக்கும்.'
              )}
            </p>
          </div>

          {/* UPI Section */}
          {/*<div style={{ background: 'var(--bg-primary)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('UPI Payment', 'UPI பணம் செலுத்துக')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <code style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {UPI_ID}
              </code>
              <button
                className="btn btn-ghost"
                onClick={handleCopy}
                style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: copied ? '#22c55e' : 'var(--text-secondary)', borderColor: copied ? '#22c55e' : 'var(--border)' }}
              >
                {copied ? <><Check size={15} /> {t('Copied!', 'நகலெடுக்கப்பட்டது!')}</> : <><Copy size={15} /> {t('Copy', 'நகலெடு')}</>}
              </button>
            </div>
          </div>*/}

          {/* QR Code */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {t('Scan to Pay', 'ஸ்கேன் செய்து செலுத்துங்கள்')}
            </p>
            <div style={{ display: 'inline-block', background: 'white', padding: '12px', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${UPI_ID}&pn=ElectionDashboard`}
                alt="UPI QR Code"
                style={{ display: 'block', borderRadius: '8px' }}
                width={180}
                height={180}
              />
            </div>
          </div>
		  
		  {/* <div style={{ textAlign: 'center', marginBottom: '24px' }}>
			  <p
				style={{
				  fontWeight: 600,
				  fontSize: '14px',
				  color: 'var(--text-secondary)',
				  marginBottom: '12px',
				}}
			  >
				{t('Scan to Pay', 'ஸ்கேன் செய்து செலுத்துங்கள்')}
			  </p>

				</div>*/}

          {/* Confirm button */}
          <button
            className="btn btn-primary"
            onClick={handleDonated}
            style={{ width: '100%', padding: '13px', fontSize: '15px', borderRadius: '12px' }}
          >
            <HeartHandshake size={18} />
            {t("I've Donated — Thank You! 🙏", 'நான் ஆதரவு அளித்தேன்! 🙏')}
          </button>

          {/* Thank-you message */}
          {donated && (
            <div className="animate-slide-up" style={{ marginTop: '16px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '12px', padding: '14px', textAlign: 'center', color: '#22c55e', fontWeight: 600 }}>
              ✨ {t('Thank you so much! Your support means a lot.', 'மிக்க நன்றி! உங்கள் ஆதரவு மிகவும் மதிப்பு வாய்ந்தது.')}
            </div>
          )}
        </div>

        {/* RIGHT — Why Support + Future Plans */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Other ways section */}
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {t('Other Ways to Help', 'உதவி செய்ய மற்ற வழிகள்')}
            </h2>
           <div
			  style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '8px', // slightly increased for breathing space
			  }}
			>
			  {/* Share */}
			  <div
				style={{
				  fontSize: '14px',
				  color: 'var(--text-secondary)',
				  display: 'flex',
				  alignItems: 'center',
				  gap: '8px',
				}}
			  >
				<span>
				  📢 {t('Share with friends & family', 'அனைவரும் அறிய பகிருங்கள்')}
				</span>

				<span
				  onClick={handleShare}
				  title={t('Share', 'பகிருங்கள்')}
				  style={{
					cursor: 'pointer',
					fontSize: '18px',
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					transition: 'transform 0.2s ease, opacity 0.2s ease',
				  }}
				  onMouseEnter={(e) => {
					e.currentTarget.style.transform = 'scale(1.2)';
					e.currentTarget.style.opacity = '0.8';
				  }}
				  onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'scale(1)';
					e.currentTarget.style.opacity = '1';
				  }}
				>
				  📤
				</span>
			  </div>

			  {/* Feedback */}
			 <div
				  style={{
					fontSize: '14px',
					color: 'var(--text-secondary)',
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
				  }}
				>
				  <span>
					💬 {t('Provide feedback', 'கருத்துக்களை தெரிவியுங்கள்')}
				  </span>

				  <span
					onClick={() => setShowFeedback(true)}
					title={t('Give Feedback', 'கருத்துக்களை தெரிவியுங்கள்')}
					style={{
					  cursor: 'pointer',
					  fontSize: '18px',
					  display: 'inline-flex',
					  alignItems: 'center',
					  transition: 'transform 0.2s ease',
					}}
					onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
					onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
				  >
					✍️
				  </span>
				</div>
				
			  {/* ✅ ADD MODAL HERE (outside everything above) */}
			  {showFeedback && (
				<div>
				  {showFeedback && (
					  <div
						style={{
						  position: 'fixed',
						  top: 0,
						  left: 0,
						  width: '100%',
						  height: '100%',
						  background: 'rgba(0,0,0,0.5)',
						  display: 'flex',
						  alignItems: 'center',
						  justifyContent: 'center',
						  zIndex: 1000,
						}}
					  >
						<div
						  style={{
							background: '#fff',
							padding: '20px',
							borderRadius: '12px',
							width: '90%',
							maxWidth: '400px',
						  }}
						>
						  {/* 🔥 THIS PART CHANGES */}
						  {submitted ? (
							<div style={{ textAlign: 'center' }}>
							  <div style={{ fontSize: '28px', marginBottom: '10px' }}>✅</div>
							  <p>
								{t("Thanks for your feedback!", "உங்கள் கருத்துக்கு நன்றி!")}
							  </p>
							</div>
						  ) : (
							<>
							  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px'}}>
							    {t('Your Feedback', 'உங்கள் கருத்து')}</h3>

							  <textarea
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								maxLength={300}
								style={{ 
									width: '100%',
									height: '140px',
									padding: '12px',
									borderRadius: '10px',
									border: '1px solid var(--border)',
									marginBottom: '8px',
									fontSize: '14px',
									resize: 'none',
									outline: 'none' 
								}}
							  />

							  <div style={{ textAlign: 'right', fontSize: '12px', color: feedback.length > 280 ? 'red' : 'var(--text-secondary)',
								marginBottom: '10px', }}>
								{feedback.length}/300
							  </div>

							  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<button className="btn btn-ghost" onClick={() => setShowFeedback(false)}>
								  {t('Cancel', 'ரத்து')}
								</button>

								<button className="btn btn-primary" 
								  onClick={submitFeedback}
								  disabled={!feedback.trim() || loading}
								  style={{
									opacity: (!feedback.trim() || loading) ? 0.6 : 1,
									cursor: (!feedback.trim() || loading) ? 'not-allowed' : 'pointer',
									padding: '8px 14px',
									borderRadius: '8px',
								  }}
								>
								  {loading ? (
									<span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
									  <span className="spinner" />
									  {t('Submitting...', 'சமர்ப்பிக்கப்படுகிறது...')}
									</span>
								  ) : (
									t('Submit', 'சமர்ப்பிக்கவும்')
								  )}
								</button>
							  </div>
							</>
						  )}
						</div>
					  </div>
					)}
	
				</div>
			  )}

			  {/* GitHub */}
			  {/*<div
				style={{
				  fontSize: '14px',
				  color: 'var(--text-secondary)',
				  display: 'flex',
				  alignItems: 'center',
				  gap: '8px',
				}}
			  >
				⭐ {t('Star us on GitHub (coming soon)', 'GitHub-ல் ஸ்டார் செய்யுங்கள் (விரைவில்)')}
			  </div> */}
			</div>
			</div>
			
			 {/* Why support */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={17} color="var(--accent-yellow)" fill="var(--accent-yellow)" />
              {t('Why Support Us?', 'ஏன் ஆதரிக்க வேண்டும்?')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                [t('Free & Open', 'இலவசம் & திறந்தது'), t('Always free for public access', 'பொதுமக்களுக்கு எப்போதும் இலவசம்')],
                [t('No Ads (Goal)', 'விளம்பரமில்லை (இலக்கு)'), t('Help us stay ad-free', 'விளம்பரமில்லாமல் வைக்க உதவுங்கள்')],
                [t('All States 2026', 'அனைத்து மாநிலங்கள் 2026'), t('Expanding to more elections', 'மேலும் தேர்தல்களுக்கு விரிவாக்கம்')],
                /*[t('Bilingual', 'இரு மொழி'), t('Tamil + English support for all', 'அனைவருக்கும் தமிழ் + ஆங்கிலம்')],*/
              ].map(([title, desc], i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', marginTop: '2px', flexShrink: 0 }}>✓</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Future plans */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '16px', padding: '22px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={17} color="#3b82f6" />
              {t('Coming Soon', 'விரைவில் வருகிறது')}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                t('🗳️ Live election counting 2026', '🗳️ 2026 நேரடி வாக்கு எண்ணிக்கை'),
                t('🗺️ All Indian states', '🗺️ அனைத்து இந்திய மாநிலங்களும்'),
                t('📊 Candidate comparisons', '📊 வேட்பாளர் ஒப்பீடுகள்'),
                t('📱 Mobile app', '📱 மொபைல் பயன்பாடு'),
              ].map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, display: 'inline-block' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          </div>
        </div>
      </div>
  );
}