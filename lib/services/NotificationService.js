import { prisma } from '../db/prisma';

export class NotificationService {
  /**
   * Broadcasts a message to all Telegram-linked users in an Organization
   */
  static async sendTelegramAlert(orgId, message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.log(`[TELEGRAM MOCK] ${message}`);
      return;
    }

    try {
      // Find all users in this org who have configured a Telegram Chat ID
      const users = await prisma.user.findMany({
        where: {
          orgId,
          telegram: {
            isEnabled: true,
            chatId: { not: null }
          }
        },
        select: {
          telegram: {
            select: { chatId: true }
          }
        }
      });

      if (users.length === 0) return;

      // Broadcast to all linked users
      for (const user of users) {
        if (!user.telegram?.chatId) continue;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: user.telegram.chatId,
            text: message,
            parse_mode: 'HTML'
          })
        }).catch(err => console.error(`Failed to send Telegram:`, err));
      }
    } catch (error) {
      console.error('[TELEGRAM DISPATCH ERROR]', error);
    }
  }

  /**
   * Replaces template strings like {deviceName} with actual data.
   */
  static parseTemplate(template, data) {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      // Safe regex replacement
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
    return result;
  }
}
