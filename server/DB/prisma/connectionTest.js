import prisma from "./prismaClient.js";

async function testConnection() {
  try {
    prisma.$connect().then(() => {
      console.log("Connected to the database successfully");
    });
  } catch (error) {
    console.error("Error testing connection:", error);
  }
}

testConnection();
export default testConnection;
