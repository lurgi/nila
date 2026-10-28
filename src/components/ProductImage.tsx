import { useEffect, useRef, useState } from 'react';
import styles from './ProductImage.module.css';

export interface ProductImageData {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  placeholder: string;
  alt: string;
}

interface Props {
  image: ProductImageData;
  priority?: boolean;
}

export function ProductImage({ image, priority = false }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState<'initial' | 'loading' | 'ready' | 'error'>('initial');

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;
    // Cached images stay visible; pending images reveal the inline preview.
    setPhase(element.complete ? (element.naturalWidth > 0 ? 'ready' : 'error') : 'loading');
  }, [image.src]);

  const reveal = async () => {
    const element = imageRef.current;
    if (!element) return;
    try {
      await element.decode();
    } catch {
      if (element === imageRef.current) setPhase('error');
      return;
    }
    if (element === imageRef.current) setPhase('ready');
  };

  return (
    <div className={styles.frame} style={{ aspectRatio: `${image.width} / ${image.height}`, backgroundImage: `url("${image.placeholder}")` }} data-product-image>
      <img
        ref={imageRef}
        className={styles.image}
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        data-phase={phase}
        onLoad={reveal}
        onError={() => setPhase('error')}
      />
    </div>
  );
}
