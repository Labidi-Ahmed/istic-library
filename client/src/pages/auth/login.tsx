import {Button} from '@/components/ui/button';
import {Link} from 'react-router-dom';
import API_URL from '@/api/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ChromeIcon} from 'lucide-react';

export default function Login() {
  const google = async () => {
    try {
      window.open(`${API_URL}/auth/google`, '_self');
    } catch (error) {
      console.error(error);
    }
  };

  console.log(API_URL);

  return (
    <section className="flex justify-center items-center h-screen p-5">
      <Card className="w-[350px] mx-auto mt-10 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => google()} variant="outline" className="w-full">
            <ChromeIcon className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 mt-4">
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
