import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-home-img bg-cover bg-center dark:invert">

      <main className="flex flex-col justify-center text-center max-w-4xl mx-auto h-dvh">

        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/50 w-4/5 sm:max-w-96
        mx-auto text-white sm:text-2xl">
          <h1 className="text-4xl font-bold">Emeka&apos;s Computer<br />Repair Shop</h1>

          <address>
            777 Remote Villa <br />
            Sogal City, SC 19998
          </address>

          <p>
            Open Daily: 9am to 5pm
          </p>

          <Link
            href={"tel:+2349017248046"}
            className="hover:underline"
          >
            +234-901-724-8046
          </Link>
        </div>

      </main>

    </div>
  );
}
