-- Privacar Rho — Seed Data

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_info', '{"phone": "+39 02 9309876", "whatsapp": "+39 345 1234567", "email": "rho@privacar.com", "address": "Via Madonna, 23, 20017 Rho (MI)"}'),
  ('opening_hours', '{"lunedi": "9:00-12:30 / 15:00-19:00", "martedi": "9:00-12:30 / 15:00-19:00", "mercoledi": "9:00-12:30 / 15:00-19:00", "giovedi": "9:00-12:30 / 15:00-19:00", "venerdi": "9:00-12:30 / 15:00-19:00", "sabato": "9:00-12:30", "domenica": "Chiuso"}'),
  ('social_links', '{"facebook": "https://facebook.com/privacarrho", "instagram": "https://instagram.com/privacarrho"}'),
  ('stats', '{"cars_sold": 200, "happy_clients": 180, "years_experience": 1}');

-- Vehicles
INSERT INTO vehicles (slug, brand, model, version, year, mileage, fuel_type, transmission, power_hp, power_kw, engine_cc, body_type, color_exterior, color_interior, doors, seats, emission_class, drive_type, new_driver_ok, price, monthly_payment, description, features, is_featured, status) VALUES

('audi-a3-sportback-35-tdi-s-tronic-2021', 'Audi', 'A3 Sportback', '35 TDI S-Tronic', 2021, 45000, 'diesel', 'automatico', 150, 110, 1968, 'Berlina', 'Grigio Nardo', 'Nero', 5, 5, 'Euro 6d', 'FWD', false, 28900.00, 602.08, 'Audi A3 Sportback in eccellenti condizioni. Unico proprietario, tagliandi certificati Audi. Dotazione completa con navigatore MMI Plus, sedili sportivi e cerchi in lega 18".',
'{"comfort": ["Climatizzatore automatico bi-zona", "Sedili sportivi riscaldati", "Sensori parcheggio ant/post", "Retrocamera", "Cruise control adattivo"], "sicurezza": ["6 airbag", "ABS", "ESP", "Lane assist", "Frenata automatica"], "infotainment": ["MMI Navigation Plus", "Apple CarPlay", "Android Auto", "Virtual Cockpit", "Bang & Olufsen"]}',
true, 'disponibile'),

('bmw-serie-3-320d-msport-2022', 'BMW', 'Serie 3', '320d MSport', 2022, 32000, 'diesel', 'automatico', 190, 140, 1995, 'Berlina', 'Nero Sapphire', 'Pelle Vernasca Nero', 4, 5, 'Euro 6d', 'RWD', false, 38500.00, 802.08, 'BMW 320d MSport con pacchetto sportivo completo. Auto in condizioni pari al nuovo con tutti i tagliandi BMW. Cerchi M da 19", interni in pelle Vernasca.',
'{"comfort": ["Climatizzatore automatico tri-zona", "Sedili sportivi M riscaldati", "Parcheggio assistito", "Head-up display", "Volante sportivo M"], "sicurezza": ["Driving Assistant Professional", "8 airbag", "Telecamera 360°", "Park Distance Control"], "infotainment": ["BMW Live Cockpit Professional", "Apple CarPlay wireless", "Harman Kardon", "WiFi hotspot"]}',
true, 'disponibile'),

('fiat-500-dolcevita-2023', 'Fiat', '500', '1.0 Hybrid Dolcevita', 2023, 12000, 'ibrida', 'manuale', 70, 51, 999, 'Berlina', 'Bianco Gelato', 'Beige/Avorio', 3, 4, 'Euro 6d', 'FWD', true, 16900.00, 352.08, 'Fiat 500 Hybrid nell allestimento Dolcevita con tetto apribile in tela. Perfetta per la città, consumi ridottissimi. Praticamente nuova con soli 12.000 km.',
'{"comfort": ["Climatizzatore automatico", "Tetto apribile in tela", "Sensori parcheggio posteriori", "Specchietti cromati", "Volante in pelle"], "sicurezza": ["6 airbag", "ABS", "ESP", "Hill holder"], "infotainment": ["Uconnect 7\" touchscreen", "Apple CarPlay", "Android Auto", "DAB+"]}',
true, 'disponibile'),

('volkswagen-golf-8-life-2022', 'Volkswagen', 'Golf', '8 2.0 TDI Life', 2022, 55000, 'diesel', 'manuale', 115, 85, 1968, 'Berlina', 'Blu Atlantico', 'Nero', 5, 5, 'Euro 6d', 'FWD', false, 22500.00, 468.75, 'Volkswagen Golf 8 Life con motore 2.0 TDI da 115 CV. Ottima per chi cerca affidabilità e bassi consumi. Tagliandi regolari, gomme nuove.',
'{"comfort": ["Climatizzatore automatico", "Cruise control", "Sensori parcheggio post", "Sedile guida regolabile elettricamente"], "sicurezza": ["Front Assist", "Lane Assist", "6 airbag", "ESP"], "infotainment": ["Discover Media 10\"", "Apple CarPlay", "Android Auto", "Digital Cockpit"]}',
false, 'disponibile'),

('toyota-yaris-cross-adventure-2023', 'Toyota', 'Yaris Cross', '1.5 Hybrid Adventure', 2023, 18000, 'ibrida', 'automatico', 116, 85, 1490, 'SUV', 'Verde Cypress', 'Nero', 5, 5, 'Euro 6d', 'AWD', false, 27500.00, 572.92, 'Toyota Yaris Cross Adventure con trazione integrale AWD-i. Ibrida full hybrid senza necessità di ricarica. Garanzia Toyota ancora attiva.',
'{"comfort": ["Climatizzatore automatico", "Sedile guida riscaldato", "Portellone elettrico", "Retrocamera", "Cruise control adattivo"], "sicurezza": ["Toyota Safety Sense 3.0", "7 airbag", "Blind spot monitor", "Rear cross traffic alert"], "infotainment": ["Display 9\" touchscreen", "Apple CarPlay wireless", "Android Auto wireless", "JBL Premium Audio"]}',
true, 'disponibile'),

('mercedes-classe-a-200d-amg-2021', 'Mercedes-Benz', 'Classe A', '200d AMG Line', 2021, 48000, 'diesel', 'automatico', 150, 110, 1950, 'Berlina', 'Grigio Montagna', 'Nero/Rosso', 5, 5, 'Euro 6d', 'FWD', false, 31900.00, 664.58, 'Mercedes Classe A 200d con pacchetto AMG Line. Interni bicolore nero/rosso esclusivi. MBUX con doppio schermo da 10.25". Perfetta combinazione di sportività ed eleganza.',
'{"comfort": ["THERMOTRONIC bi-zona", "Sedili sportivi AMG", "Ambient light 64 colori", "Keyless-Go", "Specchietti MEMORY"], "sicurezza": ["Active Brake Assist", "Attention Assist", "7 airbag", "Active Lane Keep Assist"], "infotainment": ["MBUX 10.25\" doppio display", "Apple CarPlay", "Android Auto", "Navigatore", "Burmester sound"]}',
true, 'disponibile'),

('jeep-renegade-limited-2020', 'Jeep', 'Renegade', '1.6 Multijet Limited', 2020, 62000, 'diesel', 'manuale', 130, 96, 1598, 'SUV', 'Bianco Alpine', 'Pelle Nero', 5, 5, 'Euro 6d', 'FWD', false, 19900.00, 414.58, 'Jeep Renegade Limited con interni in pelle e navigatore Uconnect 8.4". Ottimo stato, gomme 4 stagioni recenti. Ideale per chi cerca un SUV compatto ben accessoriato.',
'{"comfort": ["Climatizzatore automatico bi-zona", "Sedili in pelle riscaldati", "Sensori parcheggio ant/post", "Cruise control", "My Sky panoramico"], "sicurezza": ["Lane Departure Warning", "Forward Collision Warning", "6 airbag", "Hill descent control"], "infotainment": ["Uconnect 8.4\" NAV", "Apple CarPlay", "Android Auto", "Beats Audio"]}',
false, 'disponibile'),

('ford-puma-st-line-2023', 'Ford', 'Puma', '1.0 EcoBoost 125 Hybrid ST-Line', 2023, 15000, 'ibrida', 'manuale', 125, 92, 999, 'SUV', 'Rosso Lucid', 'Nero', 5, 5, 'Euro 6d', 'FWD', true, 24500.00, 510.42, 'Ford Puma ST-Line con motore EcoBoost Hybrid da 125 CV. Design sportivo, MegaBox nel bagagliaio. Pochissimi km, condizioni eccellenti.',
'{"comfort": ["Climatizzatore automatico", "Sedili sportivi ST-Line", "Portellone hands-free", "MegaBox bagagliaio", "Cruise control adattivo"], "sicurezza": ["Co-Pilot360", "Pre-Collision Assist", "6 airbag", "Blind Spot Information System"], "infotainment": ["SYNC 3 8\" touchscreen", "Apple CarPlay", "Android Auto", "FordPass Connect", "B&O sound"]}',
true, 'disponibile'),

('renault-clio-intens-2022', 'Renault', 'Clio', '1.0 TCe 100 Intens', 2022, 35000, 'benzina', 'manuale', 100, 74, 999, 'Berlina', 'Arancio Valencia', 'Nero', 5, 5, 'Euro 6d', 'FWD', true, 15500.00, 322.92, 'Renault Clio Intens con motore turbo benzina da 100 CV. Colore esclusivo Arancio Valencia. Ottima dotazione di serie con navigatore e sensori.',
'{"comfort": ["Climatizzatore automatico", "Sensori parcheggio post con retrocamera", "Cruise control", "Bracciolo centrale"], "sicurezza": ["Highway & Traffic Jam Companion", "Lane Centering", "6 airbag", "Active Emergency Braking"], "infotainment": ["Easy Link 9.3\" touchscreen", "Apple CarPlay", "Android Auto", "Navigatore integrato"]}',
false, 'disponibile'),

('hyundai-tucson-xline-2022', 'Hyundai', 'Tucson', '1.6 CRDi 136 48V XLine', 2022, 42000, 'diesel', 'automatico', 136, 100, 1598, 'SUV', 'Grigio Shadow', 'Nero', 5, 5, 'Euro 6d', 'FWD', false, 29900.00, 622.92, 'Hyundai Tucson XLine con motore diesel mild-hybrid e cambio automatico DCT. Design avveniristico, interni spaziosi e tecnologici. Garanzia Hyundai 5 anni/km illimitati ancora attiva.',
'{"comfort": ["Climatizzatore automatico bi-zona", "Sedile guida elettrico con memory", "Portellone elettrico smart", "Heated steering wheel", "Ventilated front seats"], "sicurezza": ["SmartSense completo", "Blind-Spot Collision-Avoidance", "7 airbag", "Highway Driving Assist"], "infotainment": ["Display 10.25\" touchscreen", "Digital Cluster 10.25\"", "Apple CarPlay wireless", "Android Auto wireless", "Krell Premium Audio"]}',
false, 'riservata');
