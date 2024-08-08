// pages/_app.js
import "../styles/globals.css";
import { Inter } from "next/font/google";
import MobileLayout from "/components/MobileLayout";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <MobileLayout>
        <Component {...pageProps} />
      </MobileLayout>
    </div>
  );
}

export default MyApp;
