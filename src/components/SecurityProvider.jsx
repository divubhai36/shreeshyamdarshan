"use client";
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SecurityProvider() {
  useEffect(() => {
    // const showAlert = () => {
    //   toast.error("Security Alert: SSD Inspection is strictly prohibited", {
    //     id: 'security-alert', // Prevents toast flooding
    //     style: {
    //       background: '#1a4332',
    //       color: '#fff',
    //       fontWeight: 'bold',
    //       fontSize: '12px',
    //       border: '1px solid #c5a059'
    //     },
    //     iconTheme: {
    //         primary: '#c5a059',
    //         secondary: '#fff',
    //     },
    //   });
    // };

    // 1. Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      // showAlert();
    };

    // 2. Disable Specific Key Combinations
    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        showAlert();
        return false;
      }

      // Ctrl+Shift+I, J, C, U
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        // showAlert();
        return false;
      }

      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        // showAlert();
        return false;
      }
    };

    // 3. Security Warning in Console
    const warningMessage = () => {
        console.log("%cSTOP!", "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;");
        console.log("%cThis is a security protected area of Shree Shyam Darshan (SSD). Unauthorized attempts to access source code or assets are monitored.", "color: #1a4332; font-size: 1.2em; font-weight: bold;");
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    warningMessage();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
