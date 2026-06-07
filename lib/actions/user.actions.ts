'use server';
import { connectToDatabase } from "@/database/mongoose";
import { ObjectId } from "mongodb"; // Required to query by MongoDB's _id

export const getAllUsersForNewEmail = async () => {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongoose connection not connected");

        // FIX: Changed "users" to "user" to match your MongoDB collection
        const users = await db.collection("user").find(
            { email: { $exists: true, $ne: null } },
            { projection: { _id: 1, email: 1, name: 1, country: 1 } }
        ).toArray();

        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id || user._id?.toString() || '',
            email: user.email,
            name: user.name
        }))
    }
    catch (error) {
        console.error("Error fetching users for news email:", error);
        return []
    }
}

// NEW: Fetch a specific user by their database ID
export const getUserById = async (userId: string) => {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Mongoose connection not connected");

        // Convert the string ID into a MongoDB ObjectId
        const objectId = new ObjectId(userId);

        const user = await db.collection("user").findOne({ _id: objectId });

        if (!user) {
            return null;
        }

        // Return a clean JavaScript object (Next.js server actions prefer this over raw DB objects)
        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        return null;
    }
}