import {Link} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';

const NotFoundPage = () => {
  return (
    <Card className="min-h-screen flex flex-col items-center justify-center ">
      <div className="text-center">
        <section className="text-5xl font-bold mb-4 ">404 Not Found</section>
        <section className="py-6 ">This page does not exist.</section>
        <Link to="/">
          <Button>Go Back</Button>
        </Link>
      </div>
    </Card>
  );
};

export default NotFoundPage;
