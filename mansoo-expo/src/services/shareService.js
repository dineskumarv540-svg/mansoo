// Professional Social Share & QR Code Service
import { Share, Linking, Alert } from 'react-native';

/**
 * Generate QR Code Image URL for Post or Profile
 */
export function generateQRCodeUrl(dataString) {
  const encoded = encodeURIComponent(dataString);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}&color=0F3D3E&bgcolor=FFFFFF`;
}

/**
 * Share to Specific Social Media Platform or System Share
 */
export async function shareToPlatform(platform, item, type = 'post') {
  const url = `https://mansoo.in/${type === 'profile' ? 'u' : 'p'}/${item.id || item.handle || 'share'}`;
  const quoteSnippet = item.quoteText ? `"${item.quoteText}" — ${item.authorName}\n\n` : `Check out ${item.name || 'this profile'} on Mansoo!\n\n`;
  const shareText = `${quoteSnippet}Read on Mansoo: ${url}`;

  try {
    switch (platform) {
      case 'whatsapp':
        const waUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const canOpenWa = await Linking.canOpenURL(waUrl);
        if (canOpenWa) await Linking.openURL(waUrl);
        else await Share.share({ message: shareText });
        break;

      case 'instagram':
        const instaUrl = `instagram://story`;
        const canOpenInsta = await Linking.canOpenURL(instaUrl);
        if (canOpenInsta) await Linking.openURL(instaUrl);
        else await Share.share({ message: shareText });
        break;

      case 'facebook':
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        await Linking.openURL(fbUrl);
        break;

      case 'x':
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        await Linking.openURL(xUrl);
        break;

      case 'telegram':
        const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(quoteSnippet)}`;
        await Linking.openURL(tgUrl);
        break;

      case 'link':
      default:
        await Share.share({ message: shareText, title: 'Mansoo — The Voice of Heart' });
        break;
    }

    return { success: true };
  } catch (error) {
    console.log(`[ShareService] Fallback system share for ${platform}:`, error.message);
    await Share.share({ message: shareText });
    return { success: true };
  }
}
