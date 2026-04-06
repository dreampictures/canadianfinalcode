import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type InsertContactMessage = z.infer<typeof api.contact.create.input>;

export function useContactMessages() {
  return useQuery({
    queryKey: [api.contact.list.path],
    queryFn: async () => {
      const res = await fetch(api.contact.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.contact.list.responses[200].parse(await res.json());
    },
  });
}

export function useSendMessage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      return api.contact.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Message Sent", description: "We will get back to you shortly." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to send message. Please try again." });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.contact.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete message");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contact.list.path] });
      toast({ title: "Deleted", description: "Message removed" });
    },
  });
}
