import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Scan, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  Info, 
  X, 
  Heart, 
  Activity,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import Ladybug from './Ladybug';

interface IngredientScannerProps {
  onNavigateHome: () => void;
  userProfile: UserProfile;
}

interface AnalysisResult {
  productName: string;
  scannedIngredients: string[];
  suitability: {
    drySkin: string;
    oilySkin: string;
    sensitiveSkin: string;
    normalSkin: string;
  };
  safetyRating: string;
  verdict: string;
  potentialIrritants: {
    ingredient: string;
    reason: string;
  }[];
  beneficialIngredients: {
    ingredient: string;
    benefits: string;
  }[];
}

const PREPARATION_STAGES = [
  "Awakening optical camera sensor...",
  "Reading chemical text labels...",
  "Calibrating INCI ingredient catalog...",
  "Consulting dermatological safety matrix...",
  "Compiling suitability assessments...",
  "Adding finishing botanical guidance..."
];

export default function IngredientScanner({ onNavigateHome, userProfile }: IngredientScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading stage messages
  useEffect(() => {
    let interval: any;
    if (loading) {
      setStageIndex(0);
      interval = setInterval(() => {
        setStageIndex(prev => (prev + 1) % PREPARATION_STAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start back/front device camera
  const startCamera = async () => {
    setError(null);
    setIsCameraActive(true);
    setPhotoBase64(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed", err);
      setError("Unable to access front/back camera. Please confirm camera permissions or upload a label photo below instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture frame from active video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Draw reversed image if desired, or standard. Since facing environment is ideal, standard draw is best:
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoBase64(dataUrl);
      stopCamera();
    }
  };

  // Handle uploaded image files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file containing skincare ingredients.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoBase64(event.target.result as string);
        setIsCameraActive(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the selected file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Send photo to full stack server endpoint
  const analyzeLabel = async () => {
    if (!photoBase64) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ingredients/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageBase64: photoBase64 })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "The server failed to parse product ingredients.");
      }

      const data = await response.json();
      setResult(data);

      // Append to the active ingredient history registry
      try {
        const historyJson = localStorage.getItem('project_agnes_scanned_history');
        const history = historyJson ? JSON.parse(historyJson) : [];
        const filtered = history.filter((item: any) => item.productName !== data.productName);
        const newRecord = {
          productName: data.productName,
          scannedIngredients: data.scannedIngredients || [],
          safetyRating: data.safetyRating || 'Generally Safe',
          verdict: data.verdict || '',
          suitability: data.suitability || { drySkin: 'Assessed', oilySkin: 'Assessed', sensitiveSkin: 'Assessed', normalSkin: 'Safe' },
          scannedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        const updated = [newRecord, ...filtered].slice(0, 10);
        localStorage.setItem('project_agnes_scanned_history', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to append to ingredient diagnostic history list", e);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected issue occurred connecting safely to Gemini analysis.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setPhotoBase64(null);
    setResult(null);
    setError(null);
    setIsCameraActive(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans pb-32 overflow-x-hidden text-[#1C1C1C] flex flex-col md:flex-row">
      
      {/* Side Menu Navigation Panel */}
      <nav className="fixed left-0 top-0 h-full w-72 z-40 bg-white border-r border-[#1C1C1C]/10 hidden md:flex flex-col p-8 select-none">
        <div className="mb-12">
          <h2 className="text-3xl font-serif italic tracking-tight font-light text-[#1C1C1C]">Agnes.</h2>
          <p className="text-[9px] font-mono uppercase tracking-widest opacity-60 mt-1">Your Skincare Sanctuary</p>
        </div>

        <div className="space-y-4 flex-grow">
          {/* Active Scanner Link state */}
          <div className="flex items-center gap-4 bg-[#F9F6F2] text-[#1C1C1C] p-3 border border-[#1C1C1C]/10 rounded-lg">
            <Scan className="w-4 h-4 text-[#8B9474] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Ingredient Scanner</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-4 text-left p-3 hover:bg-[#F9F6F2]/60 transition-all cursor-pointer border border-transparent hover:border-[#1C1C1C]/5 rounded-lg"
          >
            <span className="material-symbols-outlined text-[#1C1C1C] opacity-70">cottage</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1C1C1C]/70">Sanctuary Home</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-[#1C1C1C]/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F9F6F2] overflow-hidden border border-[#1C1C1C]/10 rounded-full">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lWSuzpHpAE7z6IAdVUy_6mX_MVwTNs"
            />
          </div>
          <div>
            <p className="text-xs font-serif font-bold text-[#1C1C1C] leading-none">{userProfile.name}</p>
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#1C1C1C]/40 mt-1">{userProfile.experienceLevel}</p>
          </div>
        </div>
      </nav>

      {/* Main Panel Content */}
      <main className="flex-1 md:ml-72 pt-24 pb-32 px-6 md:px-12 relative overflow-hidden z-10 flex flex-col items-center">
        
        {/* Aesthetic background ladybugs */}
        <Ladybug className="top-10 left-10 scale-[1.10] opacity-30" initialRotation={220} />
        <Ladybug className="bottom-[15%] right-[12%] scale-90 opacity-40" initialRotation={155} />

        {/* Header toolbar */}
        <header className="flex justify-between items-center w-full max-w-4xl mb-12">
          <div>
            <span className="text-[10px] tracking-widest font-mono uppercase opacity-55">
              Deep Neural Skincare Analysis
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1C]">AI Ingredient Safety Scanner</h2>
          </div>

          <button
            onClick={onNavigateHome}
            className="flex flex-col items-center gap-1 group transition-opacity opacity-65 hover:opacity-100 cursor-pointer"
          >
            <div className="w-10 h-10 bg-white flex items-center justify-center border border-[#1C1C1C]/10 rounded-full hover:border-[#1C1C1C]/30 transition-colors">
              <span className="material-symbols-outlined text-[#1C1C1C] text-lg">cottage</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider">Back to Home</span>
          </button>
        </header>

        {/* Dynamic Display Wrapper */}
        <div id="scanner-board" className="w-full max-w-4xl bg-white/60 border border-[#1C1C1C]/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(28,28,28,0.02)] backdrop-blur-md">
          
          {/* ERROR ALERT BOX */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl text-red-800 flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider">Analysis Alert</p>
                <p className="text-sm font-serif italic mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* ACTIVE LOADING SCREEN */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-[#8B9474]/10 border-t-[#8B9474] rounded-full animate-spin" />
                <Scan className="w-8 h-8 text-[#8B9474] absolute inset-0 m-auto animate-bounce" />
              </div>
              <h3 className="font-serif text-xl font-light text-[#1C1C1C] mb-2 tracking-tight">
                Evaluating Chemist Profile
              </h3>
              <p className="text-xs font-mono text-[#8B9474] uppercase tracking-widest h-6">
                {PREPARATION_STAGES[stageIndex]}
              </p>
              <div className="max-w-xs text-[11px] font-serif italic text-gray-500 mt-4 leading-relaxed">
                Gemini is identifying natural preservatives, moisturizers, barrier-sensitizing alcohols, and active ingredients.
              </div>
            </div>
          )}

          {/* STEP 1: INITIAL SELECTION FOR RAW CAPTURE OR FILE DROPPING */}
          {!loading && !photoBase64 && !result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              
              {/* LEFT COLUMN: ACTIVE VIEW OR CAMERA KICKER */}
              <div 
                className="border border-[#1C1C1C]/10 rounded-2xl overflow-hidden bg-white/70 min-h-[350px] flex flex-col justify-between relative shadow-inner"
              >
                {isCameraActive ? (
                  <div className="relative w-full h-full flex-1 min-h-[300px] bg-black">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover absolute inset-0"
                      playsInline 
                      muted
                    />
                    
                    {/* Scanner scanning effect line */}
                    <div className="absolute left-0 right-0 top-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#8B9474] to-transparent animate-[bounce_3s_infinite]" />

                    {/* Camera Control Hooks */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-20">
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-3 bg-[#1C1C1C] hover:bg-[#8B9474] text-white font-mono text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Capture Frame
                      </button>

                      <button
                        onClick={stopCamera}
                        className="px-4 py-3 bg-white/90 hover:bg-white text-gray-800 font-mono text-[11px] uppercase tracking-widest rounded-xl transition-all border border-black/10 flex items-center gap-2"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 bg-[#8B9474]/10 rounded-full flex items-center justify-center text-[#8B9474]">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-light">Interactive Live Scan</h4>
                      <p className="text-xs text-gray-500 font-serif italic leading-relaxed">
                        Hold your cosmetic item or cream container label steady before your device camera.
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-8 py-3.5 bg-[#1C1C1C] text-white hover:bg-[#8B9474] font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer flex items-center gap-2.5"
                    >
                      <Camera className="w-4 h-4" />
                      Initialize Camera
                    </button>
                  </div>
                )}
                
                <div className="bg-[#FAF8F5] p-4 text-center border-t border-[#1C1C1C]/5 text-[10px] font-mono uppercase tracking-widest text-[#1C1C1C]/60">
                  Ideal for laptops & mobile devices
                </div>
              </div>

              {/* RIGHT COLUMN: MANUAL FILE DROP AREA */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 min-h-[350px] ${
                  dragActive 
                    ? 'border-[#8B9474] bg-[#8B9474]/5' 
                    : 'border-[#1C1C1C]/15 bg-white/40 hover:bg-white/90 hover:border-[#1C1C1C]/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/*"
                />

                <div className="w-16 h-16 bg-[#8B9474]/10 rounded-full flex items-center justify-center text-[#8B9474] group-hover:scale-110 transition-transform mb-6">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-light">Drag & Drop Label Image</h4>
                    <p className="text-xs text-gray-500 font-serif italic max-w-xs leading-relaxed">
                      Or click anywhere on this block to navigate filesystem files. Supports JPG, PNG, or HEIC labels.
                    </p>
                  </div>
                  <span className="inline-block px-4 py-1.5 bg-white text-[#1C1C1C]/80 border border-[#1C1C1C]/10 text-[9px] font-mono uppercase tracking-widest rounded-full group-hover:border-[#1C1C1C]/30 transition-colors">
                    Upload Ingredient List
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: CONFIRM PHOTO PREVIEW PAGE */}
          {!loading && photoBase64 && !result && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#8B9474] uppercase tracking-widest font-bold">
                  Image Anchored Successfully
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-light">Ready for Deep Safety Decoding</h3>
              </div>

              {/* Photo preview slate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/70 p-4 border border-[#1C1C1C]/5 rounded-2xl">
                <div className="max-h-[300px] overflow-hidden rounded-xl border border-[#1C1C1C]/10 bg-black flex items-center justify-center">
                  <img 
                    src={photoBase64} 
                    alt="Captured label context" 
                    className="w-full h-full object-contain max-h-[300px]"
                  />
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg font-light text-[#1C1C1C]">Expert Molecular Checkmark</h4>
                    <p className="text-xs text-gray-600 font-serif italic leading-relaxed">
                      Agnes AI will extract list texts, evaluate preservative profiles, look for hidden chemical sensitizers, and evaluate compatibility with <span className="font-sans font-bold text-[#1C1C1C]">Dry, Oily, Sensitive, and Normal skin profiles</span>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={analyzeLabel}
                      className="px-6 py-4 bg-[#1C1C1C] text-white hover:bg-[#8B9474] font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer flex-1 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      Begin Safe Analysis
                    </button>
                    
                    <button
                      onClick={resetAll}
                      className="px-5 py-4 bg-white text-gray-600 border border-gray-200 hover:border-gray-400 font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl cursor-pointer"
                    >
                      Discard & Retake
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FINISHED ANALYSIS VIEW (SAFETY RESULTS SHEET) */}
          {!loading && result && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Card top banner header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#1C1C1C]/10 pb-6 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-[#8B9474] font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Laboratory Diagnostic Matrix Done
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-[#1C1C1C]">
                    {result.productName}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Overall Safety:</span>
                  <div className="px-3.5 py-1.5 bg-[#8B9474] text-white font-mono font-bold text-[11px] uppercase tracking-widest rounded-lg shadow-sm">
                    {result.safetyRating}
                  </div>
                </div>
              </div>

              {/* DETAILED RESPONSIVE GRID GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT BLOCK: VERDICT & INGREDIENT PILLS */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Verdict Card */}
                  <div className="bg-[#FAF8F5] p-6 border-l-4 border-[#8B9474] rounded-r-xl space-y-2">
                    <h4 className="text-xs font-mono font-bold text-[#8B9474] uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Dermatologist Recommendation
                    </h4>
                    <p className="text-sm font-serif italic text-[#1C1C1C]/80 leading-relaxed">
                      "{result.verdict}"
                    </p>
                  </div>

                  {/* Scientific Ingredients detected */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold text-[#1C1C1C]/60 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      Detected Ingredients list ({result.scannedIngredients.length})
                    </h4>
                    <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1.5 border border-dashed border-gray-200 rounded-xl bg-white/50">
                      {result.scannedIngredients.length > 0 ? (
                        result.scannedIngredients.map((ing, k) => (
                          <span 
                            key={k} 
                            className="px-2.5 py-1 bg-[#FAF6F2] border border-[#1C1C1C]/5 text-[10px] font-mono text-gray-700 rounded-md shrink-0 hover:border-[#8B9474]/50 hover:bg-[#8B9474]/5 transition-all"
                          >
                            {ing}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs italic text-gray-400 pl-2">No ingredients text found</p>
                      )}
                    </div>
                  </div>

                  {/* Beneficial Ingredients highlight (Glow effects) */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-mono font-bold text-[#1C1C1C]/60 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B9474]" />
                      Highly Beneficial Compounds Found
                    </h4>
                    
                    <div className="space-y-2.5">
                      {result.beneficialIngredients.length > 0 ? (
                        result.beneficialIngredients.map((item, id) => (
                          <div key={id} className="p-3 bg-white border border-[#8B9474]/15 rounded-xl flex gap-3 shadow-2xs items-start">
                            <span className="w-5 h-5 rounded-full bg-[#8B9474]/10 text-[#8B9474] flex items-center justify-center shrink-0 text-xs mt-0.5">✓</span>
                            <div>
                              <p className="text-xs font-semibold font-sans text-gray-800">{item.ingredient}</p>
                              <p className="text-[11px] font-serif italic text-gray-500 mt-0.5 leading-relaxed">{item.benefits}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs italic text-gray-400 pl-2">None specifically flagged as remarkable.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* RIGHT BLOCK: SKIN PROFILE SUITABILITY MATRIX & IRRITANTS */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Suitability index cards */}
                  <div className="bg-white/80 p-5 border border-[#1C1C1C]/10 rounded-2xl space-y-4">
                    <h4 className="text-xs font-mono font-bold text-[#1C1C1C]/60 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                      <Info className="w-3.5 h-3.5" />
                      Skin Profile Safety Assessment
                    </h4>

                    <div className="space-y-3">
                      {/* Dry skin panel */}
                      <div className="flex flex-col gap-1 text-xs border-b border-gray-50/50 pb-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Dry Skin Type</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-bold ${
                            result.suitability.drySkin.toLowerCase().includes('avoid') ? 'bg-red-50 text-red-700 border border-red-200' :
                            result.suitability.drySkin.toLowerCase().includes('caution') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-[#8B9474]/10 text-[#8B9474]'
                          }`}>Assessed</span>
                        </div>
                        <p className="font-serif italic text-gray-600 text-[11px] mt-0.5 leading-relaxed">{result.suitability.drySkin}</p>
                      </div>

                      {/* Oily Skin panel */}
                      <div className="flex flex-col gap-1 text-xs border-b border-gray-50/50 pb-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Oily Skin Type</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-bold ${
                            result.suitability.oilySkin.toLowerCase().includes('avoid') ? 'bg-red-50 text-red-700 border border-red-200' :
                            result.suitability.oilySkin.toLowerCase().includes('caution') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-[#8B9474]/10 text-[#8B9474]'
                          }`}>Assessed</span>
                        </div>
                        <p className="font-serif italic text-gray-600 text-[11px] mt-0.5 leading-relaxed">{result.suitability.oilySkin}</p>
                      </div>

                      {/* Sensitive Skin panel */}
                      <div className="flex flex-col gap-1 text-xs border-b border-gray-50/50 pb-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Sensitive Barrier</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider font-bold ${
                            result.suitability.sensitiveSkin.toLowerCase().includes('avoid') ? 'bg-red-50 text-red-700 border border-red-200' :
                            result.suitability.sensitiveSkin.toLowerCase().includes('caution') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-[#8B9474]/10 text-[#8B9474]'
                          }`}>Assessed</span>
                        </div>
                        <p className="font-serif italic text-gray-600 text-[11px] mt-0.5 leading-relaxed">{result.suitability.sensitiveSkin}</p>
                      </div>

                      {/* Normal Skin panel */}
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[10px] uppercase font-bold text-gray-500">Normal Skin</span>
                          <span className="px-2 py-0.5 rounded bg-[#8B9474]/10 text-[#8B9474] text-[8px] font-mono tracking-wider font-bold">Safe</span>
                        </div>
                        <p className="font-serif italic text-gray-600 text-[11px] mt-0.5 leading-relaxed">{result.suitability.normalSkin}</p>
                      </div>
                    </div>
                  </div>

                  {/* Potential Irritants Alert Deck */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold text-[#1C1C1C]/60 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-[bounce_4s_infinite]" />
                      Sensitizer Alert Warnings
                    </h4>

                    <div className="space-y-2.5">
                      {result.potentialIrritants.length > 0 ? (
                        result.potentialIrritants.map((item, id) => (
                          <div key={id} className="p-3 bg-amber-50/40 border border-amber-500/10 rounded-xl flex gap-3 items-start">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xs mt-0.5 font-bold">!</span>
                            <div>
                              <p className="text-xs font-semibold font-sans text-gray-800">{item.ingredient}</p>
                              <p className="text-[11px] font-serif italic text-amber-900/70 mt-0.5 leading-relaxed">{item.reason}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 border border-dashed border-gray-200 bg-white/40 text-center rounded-xl">
                          <p className="text-xs italic text-gray-500 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#8B9474]" />
                            No heavy sensitizers detected on ingredients text label.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* ACTION GROUP CONTROLS */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-[#1C1C1C]/10 justify-center md:justify-start">
                <button
                  onClick={resetAll}
                  className="px-8 py-3.5 bg-[#1C1C1C] text-white hover:bg-[#8B9474] font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Scan Another Label
                </button>

                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3.5 bg-white text-gray-600 border border-gray-200 hover:border-gray-400 font-mono text-[10px] uppercase tracking-widest transition-all rounded-xl cursor-pointer"
                >
                  Return to Sanctuary
                </button>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
