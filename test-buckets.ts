import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkBuckets() {
  console.log("Checking buckets for project:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Existing buckets:", data?.map(b => b.name));
  }
}

checkBuckets();
