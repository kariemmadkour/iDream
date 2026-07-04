export interface Service {
  slug: string
  title: string
  description: string
  images: string[]
  href?: string
}

export const SERVICES: Service[] = [
  {
    slug: 'video-production',
    title: 'Commercial AI Video Production',
    description: 'Stunning videos powered by Google Flow for companies, factories, and education.',
    images: ['/services/video-production.jpg'],
  },
  {
    slug: 'websites-apps',
    title: 'Custom Websites & Apps',
    description: 'Elegant, logical programming and digital solutions tailored to your business needs.',
    images: ['/services/websites-apps.jpg'],
  },
  {
    slug: 'event-activations',
    title: 'Digital Event Activations',
    description: 'State-of-the-art photobooths, slow-motion booths, and filming for high-end events.',
    images: ['/services/event-activations.jpg'],
  },
  {
    slug: 'ai-content',
    title: 'AI Content Creation',
    description: 'Generative AI content with elegant logic to captivate any audience.',
    images: ['/services/ai-content.jpg'],
  },
  {
    slug: 'free-tools',
    title: 'Free Utility Services',
    description:
      'Professional tools built by us, free for everyone: QR Generator, Palette Generator, Ratio Calculator, CV Maker, Kids Edu, Build App.',
    images: ['/services/free-tools.jpg'],
    href: '#tools',
  },
]
