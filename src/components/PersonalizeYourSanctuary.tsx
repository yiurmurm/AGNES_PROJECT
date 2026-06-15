import React, { useState } from 'react';
import { UserProfile } from '../types';
import Ladybug from './Ladybug';
import CrayonFlower from './CrayonFlower';

interface PersonalizeYourSanctuaryProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onNavigateHome: () => void;
}

export default function PersonalizeYourSanctuary({
  userProfile,
  onSaveProfile,
  onNavigateHome,
}: PersonalizeYourSanctuaryProps) {
  const [name, setName] = useState(userProfile.name || 'Sweet Agnes');
  const [gender, setGender] = useState<UserProfile['gender']>(userProfile.gender || 'Female');
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(
    userProfile.experienceLevel || 'Regular User'
  );
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>(
    userProfile.favoriteBrands && userProfile.favoriteBrands.length > 0
      ? userProfile.favoriteBrands
      : ['CeraVe', 'The Ordinary']
  );

  const [savingStatus, setSavingStatus] = useState(false);

  const handleBrandToggle = (brandName: string) => {
    if (favoriteBrands.includes(brandName)) {
      setFavoriteBrands(favoriteBrands.filter((b) => b !== brandName));
    } else {
      setFavoriteBrands([...favoriteBrands, brandName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus(true);
    setTimeout(() => {
      onSaveProfile({
        name,
        gender,
        experienceLevel,
        favoriteBrands,
      });
      setSavingStatus(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#F9F6F2] font-sans overflow-x-hidden flex flex-col md:flex-row text-[#1C1C1C]">
      
      {/* Side Menu Bar (Persistent for Desktop layout to match the mockup) */}
      <nav className="fixed left-0 top-0 h-full w-72 z-40 bg-[#F9F6F2] border-r border-[#1C1C1C]/10 shadow-xl hidden md:flex flex-col p-8 select-none">
        <div className="mb-12 flex items-center justify-between gap-2">
          <div>
            <h2 className="font-serif italic text-3xl font-light text-[#1C1C1C]">Agnes.</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Your Skincare Sanctuary</p>
          </div>
          <div className="flex flex-col items-center relative overflow-visible">
            <CrayonFlower size={54} />
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {/* Edit Profile Active State wrapper */}
          <div className="flex items-center gap-4 bg-[#2D423F] text-white p-3.5 shadow-sm border border-[#2D423F] rounded-xl">
            <span className="material-symbols-outlined text-white">person_edit</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Edit Profile</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-4 text-left p-3.5 hover:bg-[#EBE5DA]/40 text-[#1C1C1C] transition-all duration-200 cursor-pointer rounded-xl"
          >
            <span className="material-symbols-outlined text-[#8B9474]">cottage</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1C1C]">Sanctuary Home</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-[#1C1C1C]/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-[#1C1C1C]/10">
            <img
              alt="User Profile Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNJy08aBHsj_Va7bLNYdBI6R_70b2UiTmcMtfol8cMgRSRpJoA34zCyKMmWHlW9bg9g5wegJe4O65IF1LPHbTW0v4YVShzMDo9gwH7Zi-_h1n2jasC1vg6roKUI3Li_l-xw5JO6kZ4AOrCBC9eYhATjReIZgK1CwcvyVld6bDVnjkSE3MLj6P1pxCDohqLOn62w8RGGPjd1ONMUqm_inwgWBb9e_CxKZ3vElZRdSqVhmF0lWSuzpHpAE7z6IAdVUy_6mX_MVwTNs"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-[#1C1C1C] leading-none">{name}</p>
            <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mt-1">Zen Member</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pt-28 pb-32 px-12 relative overflow-hidden z-10 select-none">
        
        {/* Floating Sun Sticker */}
        <div className="absolute top-20 right-10 w-48 h-48 pointer-events-none opacity-20">
          <span className="material-symbols-outlined text-[140px] text-[#8B9474]/15">wb_sunny</span>
        </div>

        {/* Scattered nature imagery: leaves and ladybugs at random warm corners */}
        <Ladybug className="top-10 left-10 scale-90" initialRotation={300} />
        <Ladybug className="bottom-1/4 right-[10%] scale-100" initialRotation={80} />
        <Ladybug className="bottom-10 left-1/3 scale-110" initialRotation={190} />

        {/* Leaf 1 Sticker */}
        <div className="absolute top-1/3 right-[5%] bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none z-10 flex items-center justify-center transform rotate-45 animate-pulse">
          <span className="material-symbols-outlined text-3xl text-[#8B9474]">spa</span>
        </div>
        {/* Leaf 2 Sticker */}
        <div className="absolute bottom-1/3 left-[5%] bg-white border-[3px] border-white rounded-2xl p-2.5 shadow-[0_5px_12px_rgba(28,28,28,0.14)] pointer-events-none select-none z-10 flex items-center justify-center transform -rotate-12">
          <span className="material-symbols-outlined text-4xl text-[#4E6E58]">nature</span>
        </div>

        {/* Top Navigation Anchor containing "Back to Home" for transitions */}
        <header className="flex justify-between items-center w-full mb-12 border-b border-[#1C1C1C]/5 pb-6">
          {/* Custom Editable Name */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#1C1C1C]/40 text-sm">edit</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent hover:border-b-2 border-b border-dashed border-[#1C1C1C]/35 font-serif text-2xl font-light text-[#1C1C1C] px-2 py-0.5 outline-none tracking-tight select-text"
              title="Edit Profile Name"
            />
          </div>

          <a
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            href="#"
            className="flex items-center gap-2 group transition-opacity opacity-75 hover:opacity-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">cottage</span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#1C1C1C]">Back to Home</span>
          </a>
        </header>

        {/* Welcome titles */}
        <div className="max-w-3xl mx-auto space-y-3 mb-16 text-center md:text-left">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8B9474] block">Volume I — Customization</span>
          <h2 className="font-serif text-5xl font-light text-[#1C1C1C] tracking-tight">Tell us about you...</h2>
          <p className="text-base font-serif italic text-[#1C1C1C]/70 max-w-xl leading-relaxed">
            We're tailoring a skincare ritual just for your unique glow. Update custom settings below to sync your Shelf.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12">
          
          {/* Section 1: Gender */}
          <section className="bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_45px_rgba(28,28,28,0.03)] transition-all duration-300">
            <h3 className="text-lg font-serif font-light text-[#1C1C1C] mb-6 flex items-center gap-3 border-b border-[#1C1C1C]/5 pb-4">
              <span className="material-symbols-outlined text-sm text-[#8B9474]">diversity_3</span>
              Gender
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['Female', 'Male', 'Non-binary', 'Prefer not to say'] as UserProfile['gender'][]).map((genderVal) => (
                <label key={genderVal} className="relative group cursor-pointer h-full">
                  <input
                    type="radio"
                    name="gender"
                    value={genderVal}
                    checked={gender === genderVal}
                    onChange={() => setGender(genderVal)}
                    className="peer sr-only"
                  />
                  {/* Clean text wrap - no overflow! */}
                  <div className="p-4 flex items-center justify-center min-h-[64px] text-center border transition-all duration-300 peer-checked:bg-[#2D423F] peer-checked:text-white peer-checked:border-[#2D423F] bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474] text-[11px] tracking-wide font-sans font-bold uppercase rounded-2xl shadow-sm">
                    <span className="block break-words overflow-visible w-full hyphens-auto leading-tight">{genderVal}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Section 2: Skincare Experience Level */}
          <section className="bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_45px_rgba(28,28,28,0.03)] transition-all duration-300">
            <h3 className="text-lg font-serif font-light text-[#1C1C1C] mb-6 flex items-center gap-3 border-b border-[#1C1C1C]/5 pb-4">
              <span className="material-symbols-outlined text-sm text-[#8B9474]">auto_awesome</span>
              Skincare Experience Level
            </h3>

            <div className="space-y-4">
              {/* Complete Novice */}
              <button
                type="button"
                onClick={() => setExperienceLevel('Complete Novice')}
                className={`w-full flex items-center justify-between p-5 border transition-all duration-300 cursor-pointer rounded-2xl ${
                  experienceLevel === 'Complete Novice'
                    ? 'bg-[#2D423F] text-white border-[#2D423F]'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474]'
                }`}
              >
                <div className="text-left font-serif">
                  <p className="text-base font-medium leading-none">Complete Novice</p>
                  <p className={`text-xs italic mt-2 ${experienceLevel === 'Complete Novice' ? 'text-white/80' : 'text-[#1C1C1C]/60'}`}>
                    "I don't know my SPF from my AHA."
                  </p>
                </div>
                {experienceLevel === 'Complete Novice' && (
                  <span className="material-symbols-outlined text-white text-base">check_circle</span>
                )}
              </button>

              {/* Starting Out */}
              <button
                type="button"
                onClick={() => setExperienceLevel('Starting Out')}
                className={`w-full flex items-center justify-between p-5 border transition-all duration-300 cursor-pointer rounded-2xl ${
                  experienceLevel === 'Starting Out'
                    ? 'bg-[#2D423F] text-white border-[#2D423F]'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474]'
                }`}
              >
                <div className="text-left font-serif">
                  <p className="text-base font-medium leading-none">Starting Out</p>
                  <p className={`text-xs italic mt-2 ${experienceLevel === 'Starting Out' ? 'text-white/80' : 'text-[#1C1C1C]/60'}`}>
                    "I use a face wash and moisturize sometimes."
                  </p>
                </div>
                {experienceLevel === 'Starting Out' && (
                  <span className="material-symbols-outlined text-white text-base">check_circle</span>
                )}
              </button>

              {/* Regular User */}
              <button
                type="button"
                onClick={() => setExperienceLevel('Regular User')}
                className={`w-full flex items-center justify-between p-5 border transition-all duration-300 cursor-pointer rounded-2xl ${
                  experienceLevel === 'Regular User'
                    ? 'bg-[#2D423F] text-white border-[#2D423F]'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474]'
                }`}
              >
                <div className="text-left font-serif">
                  <p className="text-base font-medium leading-none">Regular User</p>
                  <p className={`text-xs italic mt-2 ${experienceLevel === 'Regular User' ? 'text-white/80' : 'text-[#1C1C1C]/60'}`}>
                    "I have a solid AM/PM routine I follow."
                  </p>
                </div>
                {experienceLevel === 'Regular User' && (
                  <span className="material-symbols-outlined text-white text-base">check_circle</span>
                )}
              </button>

              {/* Expert */}
              <button
                type="button"
                onClick={() => setExperienceLevel('Expert')}
                className={`w-full flex items-center justify-between p-5 border transition-all duration-300 cursor-pointer rounded-2xl ${
                  experienceLevel === 'Expert'
                    ? 'bg-[#2D423F] text-white border-[#2D423F]'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#8B9474]'
                }`}
              >
                <div className="text-left font-serif">
                  <p className="text-base font-medium leading-none">Expert</p>
                  <p className={`text-xs italic mt-2 ${experienceLevel === 'Expert' ? 'text-white/80' : 'text-[#1C1C1C]/60'}`}>
                    "I understand ingredients and pH levels."
                  </p>
                </div>
                {experienceLevel === 'Expert' && (
                  <span className="material-symbols-outlined text-white text-base">check_circle</span>
                )}
              </button>
            </div>
          </section>

          {/* Section 3: Brand Checklist */}
          <section className="bg-white p-8 border border-[#1C1C1C]/10 rounded-3xl shadow-[0_22px_45px_rgba(28,28,28,0.03)] transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#1C1C1C]/5 pb-4">
              <h3 className="text-lg font-serif font-light text-[#1C1C1C] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#8B9474]">grid_view</span>
                Brand Checklist
              </h3>
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-40">
                Multi-select available
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {/* Minimalist */}
              <div
                onClick={() => handleBrandToggle('Minimalist')}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes('Minimalist')
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">M</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Minimalist</span>
              </div>

              {/* CeraVe */}
              <div
                onClick={() => handleBrandToggle('CeraVe')}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes('CeraVe')
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">Cv</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">CeraVe</span>
              </div>

              {/* COSRX */}
              <div
                onClick={() => handleBrandToggle('COSRX')}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes('COSRX')
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">Cx</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">COSRX</span>
              </div>

              {/* Dot & Key */}
              <div
                onClick={() => handleBrandToggle('Dot & Key')}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes('Dot & Key')
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">D&K</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Dot & Key</span>
              </div>

              {/* The Ordinary */}
              <div
                onClick={() => handleBrandToggle('The Ordinary')}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes('The Ordinary')
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">TO</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">The Ordinary</span>
              </div>

              {/* Dr. Sheth's */}
              <div
                onClick={() => handleBrandToggle("Dr. Sheth's")}
                className={`p-4 h-32 flex flex-col items-center justify-center cursor-pointer transition-all border duration-300 rounded-2xl ${
                  favoriteBrands.includes("Dr. Sheth's")
                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-md'
                    : 'bg-[#F9F6F2] border-[#1C1C1C]/10 text-[#1C1C1C]/70 hover:border-[#1C1C1C]/30'
                }`}
              >
                <div className="w-10 h-10 mb-2 rounded-full border border-current flex items-center justify-center font-mono text-xs">DrS</div>
                <span className="text-[11px] font-bold uppercase tracking-wider">Dr. Sheth's</span>
              </div>
            </div>
          </section>

          {/* Submit Button Section */}
          <div className="pt-8 text-center">
            <button
              type="submit"
              disabled={savingStatus}
              className="px-10 py-4 bg-[#1C1C1C] text-white text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-[#2D423F] transition-all duration-300 shadow-md cursor-pointer rounded-2xl"
            >
              {savingStatus ? 'Syncing Sanctuary...' : 'Complete My Profile'}
            </button>
            
            {savingStatus && (
              <p className="mt-4 text-secondary text-xs italic animate-pulse">
                Saving your sanctuary settings...
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

