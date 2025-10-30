import cron from "node-cron";
import { autoCancelRentals } from "./autoCancelRentals.js";
import { remarkCarsAbilabality } from "./remarkCarsAbilabality.js";
import testConnection from "../DB/prisma/connectionTest.js";

await testConnection();


cron.schedule("*/10 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running autoCancelRentals...`);
  try {
    await autoCancelRentals();
    console.log(`[${new Date().toISOString()}] autoCancelRentals done.`);
  } catch (err) {
    console.error("autoCancelRentals failed:", err.message);
  }
});

cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running remarkCarsAbilabality...`);
  try {
    await remarkCarsAbilabality();
    console.log(`[${new Date().toISOString()}] remarkCarsAbilabality done.`);
  } catch (err) {
    console.error("remarkCarsAbilabality failed:", err.message);
  }
});
