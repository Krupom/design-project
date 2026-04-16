export type SocketType = "Type A" | "Type B" | "Type C" | "Type G" | "USB-A" | "USB-C" | "Universal";

export interface Review {
  username: string;
  comment: string;
  stars: number;
}

export interface SocketLocation {
  position: [number, number];
  title: string;
  description: string;
  socketType: SocketType;
  isFree: boolean;
  minimumCost?: string;
  floor?: string;
  image?: string;
  verifiedCount: number;
  isVerifiedByUser: boolean;
  reviews: Review[];
}

/**
 * THIS IS YOUR "DATABASE"
 * You can edit the values below to change the charging stations on the map.
 * To change an image, replace the 'image' URL with your own link.
 */
export const initialSockets: SocketLocation[] = [
  { 
    position: [13.7563, 100.5018], 
    title: "Grand Palace Charging Station", 
    description: "Free public charging station near the Grand Palace entrance.", 
    socketType: "USB-C", 
    isFree: true, 
    floor: "Ground Floor", 
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 12,
    isVerifiedByUser: false,
    reviews: [
      { username: "TouristExpert", comment: "Very fast charging, right near the entrance!", stars: 5 },
      { username: "Traveler101", comment: "Convenient location, always works.", stars: 4 },
    ]
  },
  { 
    position: [13.7468, 100.5331], 
    title: "Wat Arun Visitor Center", 
    description: "Socket available at the visitor rest area. Purchase required from café.", 
    socketType: "Type A", 
    isFree: false, 
    minimumCost: "50 THB", 
    floor: "1st Floor", 
    image: "https://images.unsplash.com/photo-1528181304800-2f31b17caba1?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 8,
    isVerifiedByUser: true,
    reviews: [
      { username: "CoffeeLover", comment: "Good coffee, but you have to buy a drink to use the plug.", stars: 3 },
    ]
  },
  { 
    position: [13.7516, 100.4915], 
    title: "Wat Pho Rest Area", 
    description: "Free charging sockets near the massage school area.", 
    socketType: "Type C", 
    isFree: true, 
    floor: "Ground Floor", 
    image: "https://images.unsplash.com/photo-1596701062351-df1f8d45435b?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 15,
    isVerifiedByUser: false,
    reviews: [
      { username: "LocalFinder", comment: "Best free spot around here. Clean area too.", stars: 5 },
      { username: "Backpacker", comment: "Found it easily thanks to this app!", stars: 5 },
    ]
  },
  { 
    position: [13.7466, 100.5392], 
    title: "Khao San Road - Coffee Hub", 
    description: "Available for customers. Minimum order required.", 
    socketType: "Universal", 
    isFree: false, 
    minimumCost: "80 THB", 
    floor: "1st Floor", 
    image: "https://images.unsplash.com/photo-1521017432521-f34f739837b0?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 22,
    isVerifiedByUser: false,
    reviews: [
      { username: "NightLifeKing", comment: "Great place to recharge while waiting for friends.", stars: 4 },
      { username: "DigitNomad", comment: "Wifi is okay, plugs are everywhere.", stars: 4 },
    ]
  },
  { 
    position: [13.7469, 100.5349], 
    title: "Siam Paragon - Level 2 Lounge", 
    description: "Free USB charging stations on Level 2 near food court.", 
    socketType: "USB-A", 
    isFree: true, 
    floor: "2nd Floor", 
    image: "https://images.unsplash.com/photo-1563124417-6fc8a87d5553?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 45,
    isVerifiedByUser: false,
    reviews: [
      { username: "Shopper01", comment: "Perfect for a quick battery boost.", stars: 4 },
    ]
  },
  { 
    position: [13.7274, 100.5234], 
    title: "Lumphini Park Info Booth", 
    description: "Free public socket at the information booth.", 
    socketType: "Type A", 
    isFree: true, 
    floor: "Outdoor", 
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 4,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7440, 100.4935], 
    title: "Chinatown Co-working Café", 
    description: "Socket access with minimum drink purchase.", 
    socketType: "Type C", 
    isFree: false, 
    minimumCost: "60 THB", 
    floor: "2nd Floor", 
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 31,
    isVerifiedByUser: false,
    reviews: [
      { username: "CoffeeAndCode", comment: "Best atmosphere for working.", stars: 5 },
    ]
  },
  { 
    position: [13.7468, 100.5605], 
    title: "Chatuchak Market Office", 
    description: "Paid charging service near Section 8.", 
    socketType: "USB-C", 
    isFree: false, 
    minimumCost: "20 THB", 
    floor: "Ground Floor", 
    image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 10,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7262, 100.5141], 
    title: "MBK Center - 3rd Floor", 
    description: "Free public charging area on the 3rd floor near escalators.", 
    socketType: "USB-C", 
    isFree: true, 
    floor: "3rd Floor", 
    image: "https://images.unsplash.com/photo-1508394522741-82ac9c15ba69?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 56,
    isVerifiedByUser: false,
    reviews: [
      { username: "MallRat", comment: "Easy to find and always free.", stars: 5 },
    ]
  },
  { 
    position: [13.7200, 100.5147], 
    title: "Jim Thompson Café", 
    description: "Socket available for café customers only.", 
    socketType: "Type B", 
    isFree: false, 
    minimumCost: "100 THB", 
    floor: "1st Floor", 
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 5,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7450, 100.5340], 
    title: "CentralWorld Free Zone", 
    description: "Free public USB sockets on the ground floor.", 
    socketType: "USB-A", 
    isFree: true, 
    floor: "Ground Floor", 
    image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 38,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7380, 100.5600], 
    title: "Ekkamai BTS Station", 
    description: "Paid charging kiosk at BTS Ekkamai.", 
    socketType: "Universal", 
    isFree: false, 
    minimumCost: "30 THB", 
    floor: "Platform Level", 
    image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 19,
    isVerifiedByUser: false,
    reviews: [
      { username: "Commuter88", comment: "Saved my life during long commute!", stars: 5 },
    ]
  },
  { 
    position: [13.7650, 100.5385], 
    title: "Victory Monument Rest Stop", 
    description: "Public charging available at the bus hub.", 
    socketType: "Type C", 
    isFree: true, 
    floor: "Ground Floor", 
    image: "https://images.unsplash.com/photo-1563124417-6fc8a87d5553?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 14,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7290, 100.5120], 
    title: "Iconsiam Riverside Lounge", 
    description: "Premium USB-C charging for shoppers.", 
    socketType: "USB-C", 
    isFree: true, 
    floor: "4th Floor", 
    image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 27,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7150, 100.5300], 
    title: "Sathorn Square Co-working", 
    description: "Paid sockets for digital nomads.", 
    socketType: "Universal", 
    isFree: false, 
    minimumCost: "150 THB", 
    floor: "12th Floor", 
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 9,
    isVerifiedByUser: false,
    reviews: []
  },
  { 
    position: [13.7500, 100.5400], 
    title: "Pratunam Market Charging", 
    description: "Simple charging stall near the clothing area.", 
    socketType: "Type A", 
    isFree: false, 
    minimumCost: "40 THB", 
    floor: "Basement", 
    image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=1000",
    verifiedCount: 3,
    isVerifiedByUser: false,
    reviews: []
  },
];
