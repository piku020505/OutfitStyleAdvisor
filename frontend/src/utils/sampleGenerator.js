// Utility to generate canvas outfit blobs for instant live analysis
export const SAMPLE_OUTFITS = [
  {
    id: 'streetwear-denim',
    name: 'Urban Denim & Hoodie',
    category: 'Streetwear',
    bgColor: '#1e293b',
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f97316',
    description: 'Casual oversized denim with hoodie layering',
  },
  {
    id: 'navy-blazer',
    name: 'Tailored Navy Blazer',
    category: 'Business Casual',
    bgColor: '#0f172a',
    primaryColor: '#1e3a8a',
    secondaryColor: '#d97706',
    accentColor: '#f8fafc',
    description: 'Sharp navy jacket with warm chino trousers',
  },
  {
    id: 'floral-dress',
    name: 'Summer Floral Dress',
    category: 'Boho Chic',
    bgColor: '#fdf2f8',
    primaryColor: '#ec4899',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    description: 'Vibrant warm floral print midi dress',
  },
  {
    id: 'monochrome-athleisure',
    name: 'Monochrome Athleisure',
    category: 'Sporty Minimal',
    bgColor: '#18181b',
    primaryColor: '#27272a',
    secondaryColor: '#52525b',
    accentColor: '#e4e4e7',
    description: 'Sleek black sweatshirt and joggers',
  },
  {
    id: 'vintage-leather',
    name: 'Vintage Biker Leather',
    category: 'Edgy Casual',
    bgColor: '#271c19',
    primaryColor: '#451a03',
    secondaryColor: '#78350f',
    accentColor: '#fbbf24',
    description: 'Rustic brown leather jacket with brass hardware',
  },
  {
    id: 'linen-resort',
    name: 'Linen Beach Resort',
    category: 'Resort Wear',
    bgColor: '#fefce8',
    primaryColor: '#fef08a',
    secondaryColor: '#06b6d4',
    accentColor: '#e0e7ff',
    description: 'Crisp white linen shirt with resort trousers',
  },
]

export function drawOutfitCanvas(outfit) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 700
  const ctx = canvas.getContext('2d')

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 600, 700)
  bgGrad.addColorStop(0, outfit.bgColor)
  bgGrad.addColorStop(1, '#0f172a')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 600, 700)

  // Torso / Outerwear garment
  ctx.fillStyle = outfit.primaryColor
  ctx.beginPath()
  ctx.moveTo(180, 180)
  ctx.lineTo(420, 180)
  ctx.lineTo(470, 420)
  ctx.lineTo(390, 440)
  ctx.lineTo(380, 240)
  ctx.lineTo(220, 240)
  ctx.lineTo(210, 440)
  ctx.lineTo(130, 420)
  ctx.closePath()
  ctx.fill()

  // Inner top / shirt accent
  ctx.fillStyle = outfit.accentColor
  ctx.beginPath()
  ctx.moveTo(250, 180)
  ctx.lineTo(350, 180)
  ctx.lineTo(340, 360)
  ctx.lineTo(260, 360)
  ctx.closePath()
  ctx.fill()

  // Trousers / Bottom garment
  ctx.fillStyle = outfit.secondaryColor
  ctx.fillRect(220, 380, 75, 260)
  ctx.fillRect(305, 380, 75, 260)

  // Decorative style pattern overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 4
  for (let i = 200; i < 440; i += 30) {
    ctx.beginPath()
    ctx.moveTo(180, i)
    ctx.lineTo(420, i)
    ctx.stroke()
  }

  // Soft shadow/vignette
  const vig = ctx.createRadialGradient(300, 350, 200, 300, 350, 450)
  vig.addColorStop(0, 'transparent')
  vig.addColorStop(1, 'rgba(0,0,0,0.4)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, 600, 700)

  return canvas
}

export function generateOutfitFile(outfit) {
  return new Promise((resolve) => {
    const canvas = drawOutfitCanvas(outfit)
    canvas.toBlob((blob) => {
      const file = new File([blob], `${outfit.id}.png`, { type: 'image/png' })
      resolve(file)
    }, 'image/png')
  })
}

