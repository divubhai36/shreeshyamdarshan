import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "1234567890abcdef-super-secret-fallback-key-shreeshyam",
  providers: [
    CredentialsProvider({
      name: "Admin DB Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user = await prisma.adminUser.findUnique({ where: { email: credentials.email } });

        // Auto-seed the first admin from env if DB is empty
        if (!user) {
          const adminEmail = process.env.ADMIN_EMAIL || "admin@shreeshyamdarshan.com";
          const adminPassword = process.env.ADMIN_PASSWORD || "securepassword123";
          
          if (credentials.email === adminEmail) {
             const hashedPassword = await bcrypt.hash(adminPassword, 10);
             user = await prisma.adminUser.create({
                data: {
                   email: credentials.email,
                   password: hashedPassword,
                   name: "Site Admin"
                }
             });
          } else {
             return null;
          }
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  trustHost: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
