import AppDataSource from "../typeorm.config";
import { runSeed } from "./initial-seed";

async function main() {

  const isDevelopment = process.env.API_NODE_ENV === 'development' || process.env.API_NODE_ENV === 'dev';
  
  if (!isDevelopment) {
    console.error("❌ CRITICAL ERROR: Seeding is only allowed in development mode!");
    process.exit(1);
  }
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    
    await runSeed(AppDataSource);
    
    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

main();