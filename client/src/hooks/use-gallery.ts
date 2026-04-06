import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type InsertGalleryAlbum = z.infer<typeof api.gallery.create.input>;

export function useGallery() {
  return useQuery({
    queryKey: [api.gallery.list.path],
    queryFn: async () => {
      const res = await fetch(api.gallery.list.path);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return api.gallery.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGalleryAlbum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGalleryAlbum) => {
      const res = await fetch(api.gallery.create.path, {
        method: api.gallery.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create album");
      return api.gallery.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
      toast({ title: "Success", description: "Album created successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create album" });
    },
  });
}

export function useDeleteGalleryAlbum() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.gallery.delete.path, { id });
      const res = await fetch(url, { method: api.gallery.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete album");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
      toast({ title: "Deleted", description: "Album removed from gallery" });
    },
  });
}
