import Image from "next/image";

export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <Image
        src="https://picsum.photos/id/1047/600/500"
        alt="Office building"
        width={600}
        height={500}
        priority
      />
      <p>
        Hello! My name is [Your Name]. I&apos;m a professional working in [Your
        Industry] based in [Your Location].
      </p>
      <p>
        Here&apos;s a photo of our office building where I spend most of my
        working hours.
      </p>
      <p>I am passionate about [Your Passion], and I enjoy [Your Hobbies].</p>
      <p>
        If you wish to reach out, please contact me at [Your Contact
        Information].
      </p>
    </main>
  );
}
