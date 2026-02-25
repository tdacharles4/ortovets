import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const return_to = searchParams.get('return_to');
  
  if (return_to) {
    redirect(return_to);
  }
  
  redirect('/');
}