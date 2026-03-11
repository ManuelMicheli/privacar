-- Privacar Rho — Initial Database Schema

-- Vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('benzina','diesel','gpl','metano','ibrida','elettrica')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manuale','automatico')),
  power_hp INTEGER,
  power_kw INTEGER,
  engine_cc INTEGER,
  body_type TEXT,
  color_exterior TEXT,
  color_interior TEXT,
  doors INTEGER DEFAULT 5,
  seats INTEGER DEFAULT 5,
  emission_class TEXT,
  drive_type TEXT,
  new_driver_ok BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL,
  monthly_payment DECIMAL(10,2),
  description TEXT,
  features JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'disponibile' CHECK (status IN ('disponibile','riservata','venduta')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_fuel ON vehicles(fuel_type);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_featured ON vehicles(is_featured) WHERE is_featured = true;

-- Vehicle images table
CREATE TABLE vehicle_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle ON vehicle_images(vehicle_id);

-- Contact requests table
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('info','finanziamento','garanzia','valutazione','generico')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_requests_read ON contact_requests(is_read);
CREATE INDEX idx_contact_requests_type ON contact_requests(request_type);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT CHECK (preferred_time IN ('mattina','pomeriggio')),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(preferred_date);

-- Site settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Vehicles are insertable by admins" ON vehicles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Vehicles are updatable by admins" ON vehicles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Vehicles are deletable by admins" ON vehicles FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images are viewable by everyone" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Images are insertable by admins" ON vehicle_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Images are updatable by admins" ON vehicle_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Images are deletable by admins" ON vehicle_images FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contacts" ON contact_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update contacts" ON contact_requests FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit appointment" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read appointments" ON appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update appointments" ON appointments FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Settings are updatable by admins" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Settings are insertable by admins" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
