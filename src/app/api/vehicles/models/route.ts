import { NextRequest, NextResponse } from 'next/server'
import { getModelsByBrand } from '@/lib/queries/vehicles'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const brand = searchParams.get('brand')

  if (!brand) {
    return NextResponse.json({ models: [] })
  }

  const models = await getModelsByBrand(brand)

  return NextResponse.json({ models })
}
