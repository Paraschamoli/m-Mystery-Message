import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("\nalready connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.log("data base:\n",db);
    console.log("db.connections :\n",db.connections);
    
    
    console.log("\nDB connected successfully");
  } catch (error) {
    console.log("\nDatabase connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
