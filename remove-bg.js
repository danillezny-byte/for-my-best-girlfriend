const sharp = require('sharp');

async function removeBg() {
    const image = sharp('signature_raw.jpg');
    const { width, height, channels } = await image.metadata();

    // Get raw pixel data
    const raw = await image.raw().toBuffer();

    // Create alpha channel - make light pixels transparent, keep dark (ink) pixels
    const rgba = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
        const r = raw[i * channels];
        const g = raw[i * channels + 1];
        const b = raw[i * channels + 2];

        // Calculate brightness (0-255)
        const brightness = (r + g + b) / 3;

        // Detect ink - the signature is blue ink on light gray paper
        // Blue ink: relatively low brightness AND blue channel is dominant
        const isInk = brightness < 130 && (b > r || brightness < 80);

        if (isInk) {
            // Black ink color
            rgba[i * 4] = 10;
            rgba[i * 4 + 1] = 10;
            rgba[i * 4 + 2] = 10;
            // Alpha: darker = more opaque
            rgba[i * 4 + 3] = Math.min(255, Math.round((150 - brightness) * 3));
        } else {
            // Transparent
            rgba[i * 4] = 0;
            rgba[i * 4 + 1] = 0;
            rgba[i * 4 + 2] = 0;
            rgba[i * 4 + 3] = 0;
        }
    }

    await sharp(rgba, { raw: { width, height, channels: 4 } })
        .trim()
        .rotate(270)  // Rotate to horizontal, correct orientation
        .png()
        .toFile('signature.png');

    console.log('Done! signature.png created');
}

removeBg().catch(console.error);
