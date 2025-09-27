"use client";

import { useState, useEffect, useRef } from "react";

const QRScanner = ({ onScan }: { onScan: (text: string) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream;
        let interval: number;

        const startCamera = async () => {
            if (!("BarcodeDetector" in window)) {
                alert("Votre navigateur ne supporte pas BarcodeDetector.");
                return;
            }
            const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) videoRef.current.srcObject = stream;
                videoRef.current?.play();

                interval = window.setInterval(async () => {
                    if (!videoRef.current) return;
                    const barcodes = await detector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                        onScan(barcodes[0].rawValue);
                        clearInterval(interval);
                        stream.getTracks().forEach(track => track.stop());
                    }
                }, 500);
            } catch (err) {
                console.error(err);
            }
        };

        startCamera();
        return () => {
            clearInterval(interval);
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [onScan]);

    return <video ref={videoRef} className="w-full max-w-sm rounded-xl shadow mb-4" />;
};

export default QRScanner;