import localFont from "next/font/local";
import { create } from "zustand";

const poppinsFont = localFont({
  src: "../fonts/Poppins.ttf",
});

interface FontStoreType {
  poppins: string;
}

const FontStore = create<FontStoreType>((set) => ({
  poppins: poppinsFont.className,
}));

export default FontStore;