import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generateToolMetadata } from "./metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateToolMetadata(slug);
}

