import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import SignUpForm from './SignUpForm';

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <Card className="border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <CardHeader className="space-y-4 p-8">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1.5">
          Start free
        </Badge>
        <div>
          <CardTitle className="text-3xl">Create your {siteConfig.name} account</CardTitle>
          <CardDescription className="mt-3 text-base">
            Join the marketplace built to feel credible, modern, and ready for real-world service bookings.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
