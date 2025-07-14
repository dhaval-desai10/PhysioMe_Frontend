import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';

export const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        triggerOnce = true,
        delay = 0,
        duration = 0.8,
        ease = "power2.out",
        from = { opacity: 0, y: 50 },
        to = { opacity: 1, y: 0 }
    } = options;

    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    });

    const elementRef = useRef(null);

    useEffect(() => {
        if (inView && elementRef.current) {
            gsap.fromTo(
                elementRef.current,
                from,
                {
                    ...to,
                    duration,
                    delay,
                    ease,
                }
            );
        }
    }, [inView, delay, duration, ease, from, to]);

    return { ref, elementRef, inView };
};

export const useStaggerAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        triggerOnce = true,
        stagger = 0.1,
        duration = 0.6,
        ease = "power2.out",
        from = { opacity: 0, y: 30 },
        to = { opacity: 1, y: 0 }
    } = options;

    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    });

    const containerRef = useRef(null);

    useEffect(() => {
        if (inView && containerRef.current) {
            const children = containerRef.current.children;
            gsap.fromTo(
                children,
                from,
                {
                    ...to,
                    duration,
                    ease,
                    stagger,
                }
            );
        }
    }, [inView, stagger, duration, ease, from, to]);

    return { ref, containerRef, inView };
};

export const useParallaxEffect = (speed = 0.5) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * speed;
            gsap.set(element, { y: parallax });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return elementRef;
};

export const useCountUpAnimation = (endValue, options = {}) => {
    const {
        duration = 2,
        delay = 0,
        threshold = 0.3,
        triggerOnce = true,
    } = options;

    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    });

    const elementRef = useRef(null);
    const currentValue = useRef(0);

    useEffect(() => {
        if (inView && elementRef.current) {
            gsap.to(currentValue, {
                current: endValue,
                duration,
                delay,
                ease: "power2.out",
                onUpdate: () => {
                    if (elementRef.current) {
                        elementRef.current.textContent = Math.round(currentValue.current);
                    }
                },
            });
        }
    }, [inView, endValue, duration, delay]);

    return { ref, elementRef, inView };
};
