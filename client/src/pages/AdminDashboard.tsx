import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCertificates, useCreateCertificate, useDeleteCertificate } from "@/hooks/use-certificates";
import { useGallery, useCreateGalleryAlbum, useDeleteGalleryAlbum } from "@/hooks/use-gallery";
import { useContactMessages, useDeleteContactMessage } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCertificateSchema, insertGalleryAlbumSchema } from "@shared/schema";
import { QRCodeSVG } from "qrcode.react";
import { Trash2, Plus, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { z } from "zod";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) setLocation("/login");
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
        
        <Tabs defaultValue="certificates" className="w-full">
          <TabsList className="bg-white border border-border p-1 rounded-lg mb-8">
            <TabsTrigger value="certificates" className="data-[state=active]:bg-secondary data-[state=active]:text-primary px-6">Certificates</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-secondary data-[state=active]:text-primary px-6">Gallery</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-secondary data-[state=active]:text-primary px-6">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            <CertificatesManager />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CertificatesManager() {
  const { data: certificates } = useCertificates();
  const { mutate: deleteCert } = useDeleteCertificate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h3 className="font-serif text-xl font-bold">Issued Certificates</h3>
        <CreateCertificateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cert No</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>QR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates?.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell className="font-mono font-medium">{cert.certificateNumber}</TableCell>
              <TableCell>{cert.studentName}</TableCell>
              <TableCell>{cert.courseName}</TableCell>
              <TableCell>{cert.grade}</TableCell>
              <TableCell>{cert.issueDate}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><ExternalLink className="w-4 h-4 mr-2" /> View QR</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                      <DialogTitle>{cert.studentName} - {cert.certificateNumber}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center p-6 bg-white rounded-lg">
                      <QRCodeSVG 
                        value={`${window.location.origin}/verify?certificate=${cert.certificateNumber}`} 
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <Button onClick={() => window.print()}>Print Certificate</Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="icon" onClick={() => deleteCert(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CreateCertificateDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createCert, isPending } = useCreateCertificate();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  
  const form = useForm({
    resolver: zodResolver(insertCertificateSchema),
    defaultValues: {
      studentName: "",
      certificateNumber: `LUX-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      courseName: "",
      courseDuration: "",
      attendancePercentage: 100,
      grade: "A",
      issueDate: new Date().toISOString().split('T')[0],
      studentPhoto: "",
    }
  });

  function onSubmit(data: any) {
    createCert(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        setPhotoPreview("");
      }
    });
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("studentPhoto", base64String);
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> Issue New</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Issue New Certificate</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Student Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Student Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-2">No photo</span>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload student photo (JPG, PNG)</p>
                </div>
              </div>
            </div>
            
            <FormField control={form.control} name="studentName" render={({ field }) => (
              <FormItem><FormLabel>Student Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="certificateNumber" render={({ field }) => (
                <FormItem><FormLabel>Cert Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="issueDate" render={({ field }) => (
                <FormItem><FormLabel>Issue Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="courseName" render={({ field }) => (
              <FormItem><FormLabel>Course Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
             <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="courseDuration" render={({ field }) => (
                <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="grade" render={({ field }) => (
                <FormItem><FormLabel>Grade</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="attendancePercentage" render={({ field }) => (
                <FormItem><FormLabel>Attendance %</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
              )} />
            </div>
            <Button type="submit" disabled={isPending} className="w-full">Issue Certificate</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function GalleryManager() {
  const { data: albums } = useGallery();
  const { mutate: deleteAlbum } = useDeleteGalleryAlbum();
  const { mutate: createAlbum, isPending } = useCreateGalleryAlbum();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumCategory, setAlbumCategory] = useState("Hair");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

  const addImageUrl = () => {
    if (imageUrls.length < 10) {
      setImageUrls([...imageUrls, ""]);
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = imageUrls.filter(url => url.trim() !== "");
    if (validUrls.length === 0 || !albumTitle) return;
    
    createAlbum({
      title: albumTitle,
      category: albumCategory,
      imageUrls: validUrls,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setAlbumTitle("");
        setAlbumCategory("Hair");
        setImageUrls([""]);
      }
    });
  };

  const navigateImage = (albumId: number, direction: 'prev' | 'next', totalImages: number) => {
    const currentIndex = activeImageIndex[albumId] || 0;
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
    }
    setActiveImageIndex({ ...activeImageIndex, [albumId]: newIndex });
  };

  return (
    <div className="space-y-8">
      {/* Add Album Form */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Create Album</h3>
          <span className="text-sm text-muted-foreground">Max 10 photos per album (URL only)</span>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> New Album</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Album Title</label>
                <Input 
                  value={albumTitle} 
                  onChange={(e) => setAlbumTitle(e.target.value)} 
                  placeholder="Album title"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={albumCategory} onValueChange={setAlbumCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hair">Hair</SelectItem>
                    <SelectItem value="Makeup">Makeup</SelectItem>
                    <SelectItem value="Nails">Nails</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Image URLs ({imageUrls.length}/10)</label>
                  {imageUrls.length < 10 && (
                    <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                      <Plus className="w-4 h-4 mr-1" /> Add URL
                    </Button>
                  )}
                </div>
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={url} 
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://onedrive.com/embed/..."
                    />
                    {imageUrls.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeImageUrl(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Use OneDrive embedded image URLs for less storage consumption</p>
              </div>
              
              <Button type="submit" disabled={isPending} className="w-full">Create Album</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums?.map((album) => {
          const currentImageIndex = activeImageIndex[album.id] || 0;
          const imageUrls = album.imageUrls || [];
          
          return (
            <div key={album.id} className="bg-white rounded-xl border border-border overflow-hidden">
              {/* Image Display with Navigation */}
              <div className="relative aspect-square bg-muted">
                {imageUrls.length > 0 && (
                  <img 
                    src={imageUrls[currentImageIndex]} 
                    alt={album.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Navigation Arrows */}
                {imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={() => navigateImage(album.id, 'prev', imageUrls.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigateImage(album.id, 'next', imageUrls.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {imageUrls.map((_, i) => (
                        <span 
                          key={i}
                          className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Image Count Badge */}
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {imageUrls.length} photos
                </span>
              </div>
              
              {/* Album Info */}
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{album.title}</h4>
                  <p className="text-sm text-muted-foreground">{album.category}</p>
                </div>
                <Button variant="destructive" size="icon" onClick={() => deleteAlbum(album.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MessagesViewer() {
  const { data: messages } = useContactMessages();
  const { mutate: deleteMessage } = useDeleteContactMessage();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-serif text-xl font-bold">Contact Messages</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="font-medium">{msg.name}</TableCell>
              <TableCell>{msg.email}</TableCell>
              <TableCell className="whitespace-nowrap">{msg.mobile}</TableCell>
              <TableCell className="max-w-md truncate" title={msg.message}>{msg.message}</TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="icon" onClick={() => deleteMessage(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
