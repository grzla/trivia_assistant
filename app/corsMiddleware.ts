import { NextRequest, NextResponse } from 'next/server';
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Adjust the origin as needed
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextRequest, res: NextResponse, fn: Function) {
  return new Promise((resolve, reject) => {
	fn(req, res, (result: any) => {
	  if (result instanceof Error) {
		return reject(result);
	  }
	  return resolve(result);
	});
  });
}

export default async function corsMiddleware(req: NextRequest, res: NextResponse, next: Function) {
  try {
	await runMiddleware(req, res, cors);
	next();
  } catch (error) {
	console.error("CORS middleware error:", error);
    return NextResponse.json({ error: "CORS Middleware Error" }, { status: 500 });  }
}