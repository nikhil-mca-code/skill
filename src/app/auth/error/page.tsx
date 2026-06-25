import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.12),_transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4">
      <Card className="w-full max-w-lg border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl">Authentication error</CardTitle>
          <CardDescription className="mt-3 text-base">
            We could not complete the sign-in flow. Try again from the login page or continue with Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Button asChild className="w-full" variant="gradient">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
