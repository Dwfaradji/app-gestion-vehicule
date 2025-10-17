import type { Vehicule } from "@/types/vehicule";

export const handleDownloadQRCode = async (vehicule: Vehicule, qrCodeUrl: string) => {
  if (!qrCodeUrl || !vehicule) return;

  const svg = document.getElementById("qrCode") as unknown as SVGSVGElement;
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    const padding = 40;
    const textHeight = 50;
    canvas.width = img.width + padding * 2;
    canvas.height = img.height + padding * 2 + textHeight;

    if (!ctx) return;

    // Fond arrondi avec dégradé
    const radius = 30;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#e0f2ff");
    gradient.addColorStop(1, "#ffffff");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    // Ombre douce pour le QR code
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    // Dessiner QR code centré
    ctx.drawImage(img, padding, padding, img.width, img.height);

    // Réinitialiser ombre pour texte
    ctx.shadowColor = "transparent";

    // Texte immatriculation
    ctx.fillStyle = "#1e3a8a"; // bleu foncé
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.fillText(vehicule.immat, canvas.width / 2, img.height + padding + 30);

    // URL du formulaire
    ctx.font = "16px Arial";
    ctx.fillStyle = "#374151"; // gris foncé
    ctx.fillText(qrCodeUrl, canvas.width / 2, img.height + padding + 55);

    // Télécharger l'image
    const link = document.createElement("a");
    link.download = `QR_Vehicule_${vehicule.immat}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};
