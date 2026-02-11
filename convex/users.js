/* import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      email:identity.email ?? "",
        imageUrl: identity.pictureUrl,
        hasCompletedOnboarding: false,
        freeEventsCreated: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
  },
});
export const getCurrentUser=query({
    handler: async(ctx)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity)return null;
        
        const user=await ctx.db
        .query("users")
        .withIndex("by_token", (q)=>q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();

        if(!user) throw new Error("User not found")
        return user;
    }
}) */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Store the currently authenticated Clerk user in Convex DB.
 * Uses identity.subject (stable Clerk user id), NOT tokenIdentifier.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const clerkId = identity.subject; // ✅ STABLE ID

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (user) {
      if (
        user.name !== identity.name ||
        user.imageUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name ?? user.name,
          imageUrl: identity.pictureUrl,
          updatedAt: Date.now(),
        });
      }

      return user._id;
    }

    // Otherwise create user
    return await ctx.db.insert("users", {
      clerkId,
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl,
      hasCompletedOnboarding: false,
      freeEventsCreated: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/**
 * Get currently logged-in user from Convex DB
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const clerkId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!user) return null;
    return user;
  },
});
