import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const supabase = createClient(
  "https://qcwoqvvfybidojahbrnd.supabase.co",
  "sb_publishable_-D3HeFoi3o91rwv8Te9orQ_o2jxIq8L"
);

const dir = "./public/photos";
const files = readdirSync(dir);

for (const file of files) {
  const buffer = readFileSync(join(dir, file));
  const contentType = file.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  const { error } = await supabase.storage
    .from("galeries")
    .upload(`portfolio/${file}`, buffer, { contentType, upsert: true });
  if (error) console.error(`❌ ${file}:`, error.message);
  else console.log(`✓ ${file}`);
}
