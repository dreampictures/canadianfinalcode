import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useVerifyCertificate } from "@/hooks/use-certificates";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, User } from "lucide-react";

export default function VerifyCertificate() {
  const [certInput, setCertInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const certParam = params.get("certificate");
    if (certParam) {
      setCertInput(certParam);
      setSearchQuery(certParam);
    }
  }, []);

  const { data: certificate, error, isLoading } = useVerifyCertificate(searchQuery);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certInput.trim()) {
      setSearchQuery(certInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="pt-32 pb-24 px-6 flex-1 flex flex-col items-center">
        {/* Search Section with Water Drop Gradient */}
        {!certificate && !isLoading && (
          <>
            <div className="text-center space-y-4 mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary">Official Verification</h1>
              <p className="text-foreground max-w-lg mx-auto">
                Enter the certificate number below to verify the authenticity of a student's certification.
              </p>
            </div>

            <form onSubmit={handleVerify} className="w-full max-w-lg" data-testid="form-verify">
              <div className="water-drop-gradient rounded-2xl p-8 shadow-lg">
                <label className="block text-foreground font-semibold mb-3 relative z-10">
                  Enter Certificate Number
                </label>
                <div className="flex gap-4 relative z-10">
                  <Input 
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="e.g., LUX-2025-001"
                    className="h-14 water-drop-input rounded-xl text-lg"
                    data-testid="input-certificate-number"
                  />
                  <button 
                    type="submit" 
                    className="h-14 px-8 glass-button-primary rounded-xl font-bold flex items-center gap-2"
                    data-testid="button-verify"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Verify</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"/>
            <p className="text-foreground">Verifying...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Official Verification</h1>
              <p className="text-destructive font-semibold">Certificate Not Found</p>
            </div>
            <div className="glass-card bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-destructive mb-2">Invalid Certificate</h3>
              <p className="text-destructive/90 mb-6 font-medium">
                The certificate number "{searchQuery}" could not be found in our records.
              </p>
              <button 
                onClick={() => { setSearchQuery(null); setCertInput(""); }}
                className="glass-button px-6 py-3 rounded-xl text-primary font-bold"
                data-testid="button-try-again"
              >
                Try Another Number
              </button>
            </div>
          </div>
        )}

        {/* Success - Certificate Found */}
        {certificate && (
          <div className="w-full max-w-4xl animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">Official Verification</h1>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold">Authentic Digital Record Found</span>
              </div>
            </div>

            {/* Certificate Card with Drop Shadow */}
            <div 
              className="bg-white rounded-2xl overflow-hidden shadow-2xl"
              style={{ 
                boxShadow: '0 25px 50px -12px rgba(92, 61, 46, 0.25), 0 12px 24px -8px rgba(92, 61, 46, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left Side - Photo Section with Golden Border */}
                <div className="md:w-1/3 bg-gradient-to-b from-gray-100 to-gray-50 p-10 flex flex-col items-center justify-center relative border-l-4 border-l-secondary">
                  
                  {/* Photo with Golden Border */}
                  <div className="relative mb-8">
                    <div 
                      className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-secondary bg-white overflow-hidden flex items-center justify-center"
                      style={{ boxShadow: '0 8px 30px -8px rgba(201, 163, 86, 0.4)' }}
                    >
                      {certificate.studentPhoto ? (
                        <img 
                          src={certificate.studentPhoto} 
                          alt={certificate.studentName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-24 h-24 text-gray-300" />
                      )}
                    </div>
                    {/* Small Golden Icon Badge */}
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-2 border-white">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-semibold text-sm mb-3">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Valid</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Official Record</p>
                </div>

                {/* Right Side - Details */}
                <div className="md:w-2/3 p-8 md:p-10 bg-white">
                  {/* Salon Logo - Centered */}
                  <div className="mb-6 flex justify-center">
                    <img 
                      src="/logo-full.png" 
                      alt="Canadian Luxurious Salon" 
                      className="h-12 md:h-14 object-contain"
                    />
                  </div>

                  {/* Student Name */}
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-1 font-semibold">Student Name</p>
                    <p className="font-serif text-2xl md:text-3xl font-bold text-gray-900">{certificate.studentName}</p>
                  </div>

                  {/* Details Grid - Simple Layout */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Course Name</p>
                      <p className="text-primary font-semibold">{certificate.courseName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Certificate Number</p>
                      <span className="inline-block bg-secondary text-primary font-mono font-bold px-3 py-1 rounded text-sm">
                        {certificate.certificateNumber}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Course Duration</p>
                      <p className="text-gray-900 font-semibold">{certificate.courseDuration}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Issue Date</p>
                      <p className="text-gray-900 font-semibold">{certificate.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Attendance Percentage</p>
                      <p className="text-gray-900 font-semibold">{certificate.attendancePercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Final Grade</p>
                      <span className="inline-flex items-center justify-center w-9 h-9 bg-gray-800 text-white font-bold rounded text-lg">
                        {certificate.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 border-t border-gray-200">
                <p className="text-sm text-foreground/70 font-medium">
                  &copy; Canadian Luxurious Salon Official Records
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-sm font-bold">
                    Verification Status: <span className="text-green-600 uppercase">Valid</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Verify Another */}
            <div className="text-center mt-8">
              <button 
                onClick={() => { setSearchQuery(null); setCertInput(""); }}
                className="glass-button px-6 py-3 rounded-xl text-primary font-bold"
                data-testid="button-verify-another"
              >
                Verify Another Certificate
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
