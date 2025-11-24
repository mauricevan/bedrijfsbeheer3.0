export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Lucide icon name
  features: string[];
  image: string;
}

export interface NavItem {
  label: string;
  path: string;
  isButton?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
}

export interface ProductDetail {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string[];
  image: string;
  heroImage: string;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  specs: {
    label: string;
    value: string;
  }[];
  theme: {
    primary: string; // Hex or Tailwind color class for text
    secondary: string;
    gradient: string; // Tailwind gradient class
    accent: string; // For buttons/highlights
  };
}
