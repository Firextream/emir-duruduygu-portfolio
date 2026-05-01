export type MoodboardItem = {
  id: string;
  type: "image" | "color" | "quote" | "typography";
  span: string;
  src?: string;
  alt?: string;
  hex?: string;
  label?: string;
  text?: string;
  author?: string;
  font?: string;
  weights?: string[];
  link?: string;
  tag?: string;
};

export type MoodboardCollection = {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  items: MoodboardItem[];
};

export const moodboardCollections: MoodboardCollection[] = [
  {
    id: "architecture",
    title: "Brutalist Architecture",
    subtitle: "Raw Concrete & Geometry",
    coverImage: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2071&auto=format&fit=crop",
    items: [
      {
        id: "arch-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2071&auto=format&fit=crop",
        alt: "Brutalist concrete building",
        span: "col-span-1 md:col-span-2 row-span-2",
        link: "https://unsplash.com",
        tag: "SEE IMAGE",
      },
      {
        id: "arch-2",
        type: "color",
        hex: "#C1FF00",
        label: "Neon Accent",
        span: "col-span-1 row-span-1",
        tag: "COPY HEX",
      },
      {
        id: "arch-3",
        type: "quote",
        text: "LESS IS MORE",
        author: "Ludwig Mies van der Rohe",
        span: "col-span-1 md:col-span-2 row-span-1",
        link: "https://en.wikipedia.org/wiki/Ludwig_Mies_van_der_Rohe",
        tag: "READ BIO",
      },
      {
        id: "arch-4",
        type: "image",
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        alt: "Modernist interior",
        span: "col-span-1 row-span-2",
        tag: "REFERENCE",
      },
      {
        id: "arch-5",
        type: "color",
        hex: "#050505",
        label: "Foundation Black",
        span: "col-span-1 row-span-1",
        tag: "COPY HEX",
      },
      {
        id: "arch-6",
        type: "image",
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        alt: "Geometric facade",
        span: "col-span-1 md:col-span-2 row-span-2",
        link: "https://unsplash.com",
        tag: "VIEW FULL",
      },
    ]
  },
  {
    id: "typography",
    title: "Modernist Typography",
    subtitle: "Swiss Style & Grids",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    items: [
      {
        id: "type-1",
        type: "typography",
        font: "Inter",
        weights: ["Regular 400", "SemiBold 600", "Bold 700"],
        span: "col-span-1 md:col-span-2 row-span-1",
        link: "https://fonts.google.com/specimen/Inter",
        tag: "DOWNLOAD FONT",
      },
      {
        id: "type-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
        alt: "Typography Poster",
        span: "col-span-1 md:col-span-2 row-span-2",
        tag: "INSPIRATION",
      },
      {
        id: "type-3",
        type: "quote",
        text: "DESIGN IS THE INVISIBLE ART",
        author: "Various",
        span: "col-span-1 md:col-span-2 row-span-1",
      },
      {
        id: "type-4",
        type: "color",
        hex: "#FFFFFF",
        label: "Pure White",
        span: "col-span-1 row-span-1",
      },
      {
        id: "type-5",
        type: "typography",
        font: "Playfair Display",
        weights: ["Italic", "Bold 700"],
        span: "col-span-1 md:col-span-2 row-span-1",
      },
    ]
  },
  {
    id: "cyberpunk",
    title: "SYSTEM::OVERLOAD",
    subtitle: "GLITCH / CHROME / VOID",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    items: [
      {
        id: "cyber-1",
        type: "image",
        src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
        alt: "Abstract Neon Geometry",
        span: "col-span-1 md:col-span-3 row-span-2",
        tag: "∞ SYSTEM",
      },
      {
        id: "cyber-2",
        type: "color",
        hex: "#FF2D78",
        label: "KILL.PINK",
        span: "col-span-1 row-span-1",
        tag: "INJECT",
      },
      {
        id: "cyber-3",
        type: "color",
        hex: "#00F5FF",
        label: "WIRE.CYAN",
        span: "col-span-1 row-span-1",
        tag: "INJECT",
      },
      {
        id: "cyber-4",
        type: "quote",
        text: "ERROR 404: SOUL NOT FOUND",
        author: "SYSTEM_ERROR_LOG",
        span: "col-span-1 md:col-span-2 row-span-1",
      },
      {
        id: "cyber-5",
        type: "image",
        src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        alt: "Matrix Code Rain",
        span: "col-span-1 md:col-span-2 row-span-2",
        tag: "↯ CORRUPTED",
      },
      {
        id: "cyber-6",
        type: "typography",
        font: "JetBrains Mono",
        weights: ["#000000", "#FF2D78", "#00F5FF", "///ERROR///"],
        span: "col-span-1 md:col-span-2 row-span-1",
        tag: "SYS.FONT",
      },
      {
        id: "cyber-7",
        type: "color",
        hex: "#0A0A0A",
        label: "DEAD.BLACK",
        span: "col-span-1 row-span-1",
      },
      {
        id: "cyber-8",
        type: "quote",
        text: "GOD IS A MACHINE",
        author: "DEUS_EX_MACHINA.exe",
        span: "col-span-1 md:col-span-2 row-span-1",
      },
    ]
  }
];

