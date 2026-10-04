import { notFound } from "next/navigation";
import MockA from "@/components/lab/MockA";
import MockB from "@/components/lab/MockB";
import MockC from "@/components/lab/MockC";

const MOCKS = { a: MockA, b: MockB, c: MockC } as const;

export function generateStaticParams() {
  return Object.keys(MOCKS).map((v) => ({ v }));
}

export default function LabVariant({ params }: { params: { v: string } }) {
  const Mock = MOCKS[params.v as keyof typeof MOCKS];
  if (!Mock) notFound();
  return <Mock />;
}
