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

/**
 * Store the currently authenticated Clerk user in Convex DB.
 * Uses identity.subject (stable Clerk user id).
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const clerkId = identity.subject; // ✅ Stable Clerk user ID

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", clerkId)
      )
      .unique();

    // If user exists → update if needed
    if (user) {
      if (
        user.name !== identity.name ||
        user.imageUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name ?? user.name,
          imageUrl: identity.pictureUrl ?? user.imageUrl,
          updatedAt: Date.now(),
        });
      }

      return user._id;
    }

    // Otherwise → create new user
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: clerkId,   // ✅ FIXED (was clerkId ❌)
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
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const clerkId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", clerkId)
      )
      .unique();

    return user ?? null;
  },
});
