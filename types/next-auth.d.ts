import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      fullname: string;
      course: string;
      _id: string;
      yearlevel: string;
      role: string;
    };
  }
}