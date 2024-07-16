import Image from "next/image";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>
      <div className={styles.shape} />
      <div>HELLO</div>
      <div className={`${lusitana.className} large-font`}>HELLO</div>
      {/* <p
      className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
    > */}
    </main>
  );
}
