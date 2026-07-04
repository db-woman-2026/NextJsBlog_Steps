import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase text-zinc-500">About</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          About Me
        </h1>
        <div className="space-y-4 text-sm leading-7 text-zinc-600">
          <p>
            Hello! My name is [Your Name]. I&apos;m a professional working in
            [Your Industry] based in [Your Location].
          </p>
          <p>
            Here&apos;s a photo of our office building where I spend most of my
            working hours.
          </p>
          <p>
            I am passionate about [Your Passion], and I enjoy [Your Hobbies].
          </p>
          <p>
            If you wish to reach out, please contact me at [Your Contact
            Information].
          </p>
        </div>
      </section>
      <Image
        className="rounded-lg border border-zinc-200 object-cover shadow-sm"
        src="https://picsum.photos/id/1047/600/500"
        alt="Office building"
        width={600}
        height={500}
        priority
      />
    </main>
  );
}
