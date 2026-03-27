import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 bg-brand-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[url('/images/hero_2.jpg')] bg-cover bg-center mix-blend-overlay"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 text-left">

          {/* Column 1: Brand */}
          <div className="space-y-6 lg:space-y-8">
            <Link to="/" className="flex flex-col group">
              <h2 className="text-xl lg:text-2xl font-serif font-bold tracking-widest uppercase group-hover:text-brand-secondary transition-colors text-left">
                SHREE SHYAM <span className="text-brand-secondary italic">DARSHAN</span>
              </h2>
              <p className="text-[8px] lg:text-[10px] tracking-[0.3em] font-medium text-white/40 uppercase mt-1 text-left">
                laddu gopal poshak and shringar
              </p>
            </Link>
            <p className="text-white/50 text-xs lg:text-sm leading-relaxed italic max-w-xs text-left">
               "Adorning Divinity with Elegance and Love. We craft every piece with deep devotion, ensuring your deity is adorned with unparalleled grace."
            </p>
            <div className="flex gap-4">
               <a href="https://www.instagram.com/shree.shyam.darshan_?igsh=MWx6dWVqcWZmbWkzcw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary hover:border-brand-secondary transition-all group">
                  <Icon icon="mdi:instagram" className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
               </a>
               <Link to="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary hover:border-brand-secondary transition-all group">
                  <Icon icon="mdi:facebook" className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
               </Link>
               {/* <a href="https://share.google/JnMykrFgSHuIxMfmU" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary hover:border-brand-secondary transition-all group" title="Google Business">
                  <Icon icon="mdi:google-my-business" className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
               </a> */}
               <a href="https://www.google.com/search?sca_esv=31586a1ce1c44e63&rlz=1C1ONGR_enIN1026IN1026&cs=1&sxsrf=ANbL-n5ueFGkVUg_WowF-Y25qSPDd7m1yw:1774641146255&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOSXcqrOP25rdToCMYEBKfRtbV_HEmpUWriTrisUoklkqDVMM3phTcbbt_k43lxZyI6ooQQI_KxCuXyvg5A-zN-VKorowM2uoQX2ho-DGMWrDQRYQgIoRXVRiE9WKuNLxDnDH3tE%3D&q=New+Darshan+Lace+Laddu+Gopal+Poshak+Reviews&sa=X&ved=2ahUKEwj7_IC57cCTAxULhGMGHf5mAh8Q0bkNegQIIxAF&cshid=1774641343178766&biw=1536&bih=776" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-secondary hover:border-brand-secondary transition-all group" title="Google Business">
                  <Icon icon="mdi:google" className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
               </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-left">
            <h3 className="text-[11px] lg:text-xs font-bold tracking-[0.4em] uppercase mb-8 lg:mb-10 text-brand-secondary">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Collections', 'About Us', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-xs lg:text-sm text-white/60 hover:text-white flex items-center gap-2 group transition-all"
                  >
                    <Icon icon="lucide:chevron-right" className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-secondary" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="col-span-1 lg:col-span-1 text-left">
            <h3 className="text-[11px] lg:text-xs font-bold tracking-[0.4em] uppercase mb-8 lg:mb-10 text-brand-secondary">Contact Info</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                 <Icon icon="solar:phone-bold" className="w-5 h-5 text-brand-secondary shrink-0" />
                 <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Call Us</p>
                    <a href="tel:+917383699199" className="text-xs lg:text-sm font-medium hover:text-brand-secondary transition-colors text-white/80">+91 73836 99199</a>
                 </div>
              </li>
              <li className="flex gap-4">
                 <Icon icon="lucide:mail" className="w-5 h-5 text-brand-secondary shrink-0" />
                 <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</p>
                    <a href="mailto:shreeshyamdarshan155@gmail.com" className="text-xs lg:text-sm font-medium hover:text-brand-secondary transition-colors text-white/80">darshan@shreeshyam.com</a>
                 </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Address */}
          <div className="text-left">
            <h3 className="text-[11px] lg:text-xs font-bold tracking-[0.4em] uppercase mb-8 lg:mb-10 text-brand-secondary">Find Us</h3>
            <div className="flex gap-4 text-left">
               <Icon icon="lucide:map-pin" className="w-5 h-5 text-brand-secondary shrink-0" />
               <address className="text-xs lg:text-sm text-white/60 not-italic leading-relaxed text-left">
                 69, Shree, Darshan Industries, <br />
                 Kamrej Rd, Laskana, Kamrej, <br />
                 Gujarat 394185, India.
               </address>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 text-left">
               <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Icon key={i} icon="solar:star-bold" className="w-3 h-3 text-brand-secondary" />
                  ))}
               </div>
               <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Excellent Service Rating</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] lg:text-[10px] text-white/20 font-bold tracking-widest uppercase">
            © 2026 Shree Shyam Darshan • Crafted for Devotion
          </p>
          <div className="flex gap-8 text-[8px] lg:text-[10px] font-bold tracking-widest text-white/20 uppercase">
             <Link to="#" className="hover:text-white transition-all">Privacy</Link>
             <Link to="#" className="hover:text-white transition-all">Shipping</Link>
             <Link to="#" className="hover:text-white transition-all">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
