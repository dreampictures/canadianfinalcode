import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useGallery } from "@/hooks/use-gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryAlbum } from "@shared/schema";

export default function Gallery() {
  const { data: albums, isLoading } = useGallery();
  const [filter, setFilter] = useState("All");
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});

  const categories = ["All", "Hair", "Makeup", "Nails", "Academy"];

  const filteredAlbums = filter === "All" 
    ? albums 
    : albums?.filter((album: GalleryAlbum) => album.category === filter);

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
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-12 bg-primary text-white text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Our Masterpieces</h1>
        <p className="text-white/80 max-w-2xl mx-auto px-6">A curated collection of our finest work and transformations.</p>
      </div>

      <main className="flex-1 py-12 px-6 max-w-7xl mx-auto w-full">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                filter === cat 
                  ? "glass-button-secondary shadow-lg scale-105" 
                  : "glass-button hover:scale-105"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filteredAlbums?.length === 0 ? (
          <div className="text-center py-24 text-foreground">
            No albums found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums?.map((album: GalleryAlbum) => {
              const currentImageIndex = activeImageIndex[album.id] || 0;
              const imageUrls = album.imageUrls || [];
              
              return (
                <div key={album.id} className="group relative overflow-hidden rounded-xl glass-card shadow-md aspect-square">
                  {/* Image */}
                  {imageUrls.length > 0 && (
                    <img 
                      src={imageUrls[currentImageIndex]} 
                      alt={album.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Navigation Arrows */}
                  {imageUrls.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(album.id, 'prev', imageUrls.length);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage(album.id, 'next', imageUrls.length);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Image Indicators */}
                      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {imageUrls.map((_, i) => (
                          <span 
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Album Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent p-6 z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="glass-button-secondary text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {album.category}
                      </span>
                      {imageUrls.length > 1 && (
                        <span className="text-white/70 text-xs">
                          {currentImageIndex + 1}/{imageUrls.length}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-serif text-xl font-bold">{album.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
