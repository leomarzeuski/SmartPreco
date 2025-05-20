export function buildEmailHtml(body: string): string {
  const logoUrl = 'https://smartpreco.mindsnap.tech/logo.png';
  const heroUrl = 'https://smartpreco.mindsnap.tech/hero-mobile.png';

  return `
    <div style="background: #f7f9fa; padding: 0; margin: 0; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 32px auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 24px #0001;">
        <tr>
          <td style="padding: 32px 0 16px 0; text-align: center;">
            <img src="${logoUrl}" alt="SmartPreço" style="height: 48px; margin-bottom: 12px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 16px 32px; text-align: center;">
            <img src="${heroUrl}" alt="Seu produto favorito está com desconto!" style="width: 100%; max-width: 400px; border-radius: 12px; margin-bottom: 24px;" />
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <div style="font-size: 20px; color: #222; font-weight: 600; margin-bottom: 12px;">Seu produto favorito está com desconto!</div>
            <div style="font-size: 16px; color: #222; line-height: 1.6;">
              ${body}
            </div>
            <div style="margin-top: 32px; text-align: center;">
              <a href="https://smartpreco.mindsnap.tech/" style="display: inline-block; background: #1c7bf6; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">Ver mais em SmartPreço</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 32px 32px; text-align: center; font-size: 13px; color: #999;">
            © ${new Date().getFullYear()} SmartPreço. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `;
}