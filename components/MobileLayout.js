import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './MobileLayout.module.scss';

export default function MobileLayout({ children }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && router.pathname === '/') {
      router.push('/mobile-landing');
    }
  }, [isMobile, router]);

  const handleBack = () => {
    if (router.pathname === '/signin' || router.pathname === '/signup') {
      router.push('/mobile-landing');
    } else {
      router.back();
    }
  };

  if (!isMobile) return children;

  return (
    <div className={styles.mobileContainer}>
      {router.pathname !== '/mobile-landing' && (
        <button className={styles.backButton} onClick={handleBack}>
          ← Back
        </button>
      )}
      {children}
    </div>
  );

}