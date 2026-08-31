import { Container } from "@/components/ui/Container";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full border-[50px] border-white" />
      </div>
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to Get Back to What You Love?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-navy-300">
          Schedule your free 15-minute screening with Dr. Patel — in person
          in Melbourne, FL or virtually. No obligation.
        </p>
      </Container>
    </section>
  );
}
