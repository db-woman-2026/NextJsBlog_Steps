import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">
          Contact
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Contact Us
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          controlled input과 submit 이벤트를 연습하는 mockup form입니다.
        </p>
      </section>
      <ContactForm />
    </main>
  );
}
