// ✅ QRScanner.tsx
import { useEffect, useRef } from "react";

const QRScanner = ({ onScan, disabled }: { onScan: (text: string) => void; disabled: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (disabled) return;
        let stream: MediaStream | null = null;
        let interval: number;
        let isMounted = true;

        const startCamera = async () => {
            if (!("BarcodeDetector" in window)) {
                alert("Votre navigateur ne supporte pas BarcodeDetector.");
                return;
            }
            const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch((err) => {
                            console.warn("Lecture vidéo bloquée:", err);
                        });
                    };
                }

                interval = window.setInterval(async () => {
                    if (!isMounted || !videoRef.current) return;
                    const barcodes = await detector.detect(videoRef.current);
                    console.log(barcodes,"barre code")
                    if (barcodes.length > 0) {
                        onScan(barcodes[0].rawValue);
                        clearInterval(interval);
                        stream?.getTracks().forEach((track) => track.stop());
                    }
                }, 500);
            } catch (err) {
                console.error("Erreur caméra:", err);
            }
        };

        startCamera();

        return () => {
            isMounted = false;
            clearInterval(interval);
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [disabled, onScan]);

    return <video ref={videoRef} className="w-full max-w-sm rounded-xl shadow mb-4" />;
};

export default QRScanner;