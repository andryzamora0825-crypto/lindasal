import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Faltan las credenciales de Supabase en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definición manual de los productos de prueba para no tener problemas de importación TypeScript
const mockProducts = [
  // ─────────────── LINDASAL ───────────────
  {
    name: "Lindasal Sal Gourmet 500g",
    description: "Sal gourmet de salmuera natural, rica en minerales esenciales que nutren y equilibran tu organismo. Combínala con agua + limón para un boost natural. 40% menos sodio que la sal común.",
    price: 5.0,
    category: "comestible",
    brand: "LINDASAL",
    image_url: null,
    stock: 80,
    is_featured: true,
    is_active: true,
    discount_percentage: 20,
  },
  {
    name: "Lindasal Sal Gourmet 1kg",
    description: "Presentación familiar de nuestra sal gourmet de salmuera natural. Ideal para el hogar, aporta minerales esenciales en cada uso. La sal que no solo realza el sabor, sino que nutre.",
    price: 10.0,
    category: "comestible",
    brand: "LINDASAL",
    image_url: null,
    stock: 60,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Lindasal Sal Ahumada 227g",
    description: "Sal marina natural con proceso de ahumado artesanal. Ideal para cortes de carne, parrillas y marinados. Aporta un toque ahumado premium a tus preparaciones.",
    price: 4.0,
    category: "comestible",
    brand: "LINDASAL",
    image_url: null,
    stock: 45,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Lindasal Sal con Especias 100g",
    description: "Mezcla exclusiva de sal gourmet con especias seleccionadas. Perfecta para darle un giro gourmet a tus comidas sin esfuerzo.",
    price: 3.0,
    category: "comestible",
    brand: "LINDASAL",
    image_url: null,
    stock: 55,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Hipertensal 250g",
    description: "Fórmula especial con bajo contenido de sodio, enriquecida con minerales esenciales. Ideal para personas con hipertensión que no quieren renunciar al sabor.",
    price: 5.0,
    category: "terapeutica",
    brand: "LINDASAL",
    image_url: null,
    stock: 35,
    is_featured: true,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Sal Termal con Pétalos de Rosa 227g",
    description: "Sal termal natural con pétalos de rosa secos. Perfecta para baños relajantes y rituales de cuidado personal. Ayuda a regenerar la piel y liberar el estrés.",
    price: 4.0,
    category: "belleza",
    brand: "LINDASAL",
    image_url: null,
    stock: 30,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Sal Termal con Pétalos de Rosa 1lt",
    description: "Presentación grande de nuestra sal termal con pétalos de rosa. Ideal para uso frecuente en spa y rituales de bienestar prolongados.",
    price: 10.0,
    category: "belleza",
    brand: "LINDASAL",
    image_url: null,
    stock: 20,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },

  // ─────────────── AGUADEMAR QUINTON ───────────────
  {
    name: "Aceite de Magnesio (ATM) 200ml",
    description: "Cloruro de Magnesio 100% orgánico para absorción transdérmica. Cumple con más de 350 funciones en el organismo: purifica la sangre, equilibra el pH, estimula las funciones cerebrales y promueve la salud renal. Aplicar directamente en la piel.",
    price: 10.0,
    category: "terapeutica",
    brand: "AGUADEMAR QUINTON",
    image_url: null,
    stock: 40,
    is_featured: true,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Agua Hipertónica Quinton 1lt",
    description: "Agua de mar hipertónica naturalmente rica en minerales y electrolitos. Complemento dietético ideal para deportistas y quienes buscan una hidratación profunda con trazas minerales del océano.",
    price: 10.0,
    category: "terapeutica",
    brand: "AGUADEMAR QUINTON",
    image_url: null,
    stock: 35,
    is_featured: true,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Agua Isotónica Quinton",
    description: "Agua de mar isotónica en proporción perfecta con agua dulce. Rehidrata y remineraliza a nivel celular. Ideal para el consumo diario como suplemento mineral natural.",
    price: 8.0,
    category: "terapeutica",
    brand: "AGUADEMAR QUINTON",
    image_url: null,
    stock: 25,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },

  // ─────────────── NAVELLA ───────────────
  {
    name: "Jabón Íntimo Navella 250ml",
    description: "Jabón íntimo formulado con ingredientes naturales para mantener el balance del pH. Suave y eficaz, protege la flora natural y brinda sensación de frescura todo el día.",
    price: 9.0,
    category: "belleza",
    brand: "NAVELLA",
    image_url: null,
    stock: 30,
    is_featured: true,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Jabón de Bebé Navella",
    description: "Fórmula ultra suave para la piel delicada de los bebés. Sin químicos agresivos, con ingredientes naturales que limpian y cuidan suavemente.",
    price: 7.0,
    category: "belleza",
    brand: "NAVELLA",
    image_url: null,
    stock: 20,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Derma Tonificador Navella",
    description: "Tonificador facial mineralizante que previene el envejecimiento prematuro. Con minerales marinos que restauran la luminosidad natural de la piel.",
    price: 12.0,
    category: "belleza",
    brand: "NAVELLA",
    image_url: null,
    stock: 15,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  },
  {
    name: "Gotas Oculares Navella",
    description: "Solución ocular natural con propiedades calmantes y restauradoras. Alivia la irritación y sequedad. Para uso diario como soporte al bienestar visual.",
    price: 8.0,
    category: "terapeutica",
    brand: "NAVELLA",
    image_url: null,
    stock: 18,
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  }
];

async function migrateProducts() {
  console.log("🌊 Iniciando migración de productos de prueba a Supabase...");
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of mockProducts) {
    try {
      const { data, error } = await supabase.from('productos').insert([product]).select();
      
      if (error) {
        console.error(`❌ Error al subir '${product.name}':`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Subido exitosamente: ${product.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error inesperado con '${product.name}':`, err);
      errorCount++;
    }
  }

  console.log("\n=================================");
  console.log(`📊 RESULTADOS:`);
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${errorCount}`);
  console.log("=================================");
  
  if (successCount > 0) {
    console.log("\n🎉 ¡Listo! Tus productos de prueba ahora son reales. Puedes ir a tu Panel para editarles la foto.");
  }
}

migrateProducts();
