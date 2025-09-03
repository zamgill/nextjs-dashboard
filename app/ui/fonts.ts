import { IBM_Plex_Sans, Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  // below line is required for build
  weight: ['100', '500'],
});
// export const lusitana = Lusitana({
//   subsets: ['latin'],
//   weight: ['400', '700'],
// });

export const lusitana = ibmPlexSans;
