import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type Certificate } from "@shared/schema";
import { z } from "zod";

type InsertCertificate = z.infer<typeof api.certificates.create.input>;

export function useCertificates() {
  return useQuery({
    queryKey: [api.certificates.list.path],
    queryFn: async () => {
      const res = await fetch(api.certificates.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch certificates");
      return api.certificates.list.responses[200].parse(await res.json());
    },
  });
}

export function useVerifyCertificate(certNumber: string | null) {
  return useQuery({
    queryKey: [api.certificates.verify.path, certNumber],
    queryFn: async () => {
      if (!certNumber) return null;
      const url = buildUrl(api.certificates.verify.path, { number: certNumber });
      const res = await fetch(url);
      if (res.status === 404) throw new Error("Certificate not found");
      if (!res.ok) throw new Error("Verification failed");
      return api.certificates.verify.responses[200].parse(await res.json());
    },
    enabled: !!certNumber,
    retry: false,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCertificate) => {
      const res = await fetch(api.certificates.create.path, {
        method: api.certificates.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create certificate");
      return api.certificates.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] });
      toast({ title: "Success", description: "Certificate created successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create certificate" });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.certificates.delete.path, { id });
      const res = await fetch(url, { method: api.certificates.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] });
      toast({ title: "Deleted", description: "Certificate removed successfully" });
    },
  });
}
