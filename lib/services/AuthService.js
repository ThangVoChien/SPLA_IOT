import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = 'SPLA_IOT_SUPER_SECRET'; // In production, use process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey);

export class AuthService {
  static async encrypt(payload) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(key);
  }

  static async decrypt(input) {
    try {
      const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch (error) {
      return null;
    }
  }

  static async getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie?.value) return null;
    return await this.decrypt(sessionCookie.value);
  }
}
