import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPBASE_URL = process.env.SUPABASE_URL;
const SUPBASE_KEY = process.env.SUPABASE_KEY;
const supbase = createClient(SUPBASE_URL, SUPBASE_KEY);

export default supbase;
