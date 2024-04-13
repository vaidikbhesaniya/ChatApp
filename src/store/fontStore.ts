import localFont from "next/font/local";
import { create } from "zustand";

const poppinsFont = localFont({
  src: "../fonts/Poppins.ttf",
});

const calSansFont = localFont({
  src: "../fonts/CalSans.otf",
});

interface FontStoreType {
  poppins: string;
  creamCake: string;
}

const FontStore = create<FontStoreType>((set) => ({
  poppins: poppinsFont.className,
  creamCake:  calSansFont.className,
}));

export default FontStore;
